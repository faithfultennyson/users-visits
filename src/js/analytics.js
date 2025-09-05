import { createPayload, initializeBeacon } from './beacon.js';

const QUEUE_KEY = 'cg_queue';
const memoryQueue = [];
let storageAvailable = true;
let storageWarned = false;

function loadQueue() {
    try {
        const stored = sessionStorage.getItem(QUEUE_KEY);
        return stored ? JSON.parse(stored) : memoryQueue;
    } catch (e) {
        if (!storageWarned) {
            console.warn('analytics storage unavailable', e);
            storageWarned = true;
        }
        storageAvailable = false;
        return memoryQueue;
    }
}

function saveQueue() {
    if (!storageAvailable) {
        memoryQueue.length = 0;
        memoryQueue.push(...eventQueue);
        return;
    }
    try {
        sessionStorage.setItem(QUEUE_KEY, JSON.stringify(eventQueue));
    } catch (e) {
        if (!storageWarned) {
            console.warn('analytics storage unavailable', e);
            storageWarned = true;
        }
        storageAvailable = false;
        memoryQueue.length = 0;
        memoryQueue.push(...eventQueue);
    }
}

// Throttle implementation
let eventQueue = loadQueue();
const MAX_EVENTS = 10;
const WINDOW_SIZE = 10000; // 10 seconds
const DWELL_INTERVAL = 5000; // Check dwell time every 5 seconds

// Track total dwell time
let dwellStartTime = Date.now();
let totalDwellTime = 0;
let isTracking = false;

function isThrottled() {
    const now = Date.now();
    // Remove events older than window size
    eventQueue = eventQueue.filter(ts => now - ts < WINDOW_SIZE);
    saveQueue();
    return eventQueue.length >= MAX_EVENTS;
}

function trackEvent(eventName, data = {}) {
    if (isThrottled()) return;
    
    eventQueue.push(Date.now());
    saveQueue();
    const payload = createPayload(eventName, data);
    
    // Use sendBeacon if available, fall back to console.log
    if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/analytics', blob);
    } else {
        console.log('Analytics Event:', payload);
    }
}

// Dwell time tracking
function startDwellTracking() {
    if (isTracking) return;
    
    dwellStartTime = Date.now();
    isTracking = true;
    
    // Set up interval to track dwell time
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            const currentTime = Date.now();
            const dwellTime = currentTime - dwellStartTime;
            totalDwellTime += dwellTime;
            dwellStartTime = currentTime;
            
            // Track dwell checkpoint every interval
            trackEvent('dwell_update', {
                dwell_time: totalDwellTime,
                interval: DWELL_INTERVAL
            });
        }
    }, DWELL_INTERVAL);
}

// Event trackers
export function trackPageView() {
    let hasTracked = false;
    
    // Track after 2s if tab is visible
    setTimeout(() => {
        if (document.visibilityState === 'visible' && !hasTracked) {
            trackEvent('page_view', {
                title: document.title,
                dwell_time: 0
            });
            hasTracked = true;
            startDwellTracking();
        }
    }, 2000);
}

export function trackCardImpression(uid) {
    trackEvent('card_impression', {
        uid,
        dwell_time: totalDwellTime
    });
}

export function trackCardClick(uid) {
    trackEvent('card_click', {
        uid,
        dwell_time: totalDwellTime
    });
}

export function trackHeaderLinkClick(href, source = 'header') {
    trackEvent('header_link_click', {
        href,
        source,
        dwell_time: totalDwellTime
    });
}

export function trackReportOpen(uid, reason) {
    trackEvent('report_open', {
        uid,
        reason,
        dwell_time: totalDwellTime
    });
}

export function trackReportSubmit(uid, reportData) {
    trackEvent('report_submit', {
        uid,
        report_type: reportData.type,
        message: reportData.message,
        contact: reportData.contact,
        dwell_time: totalDwellTime
    });
}

// Initialize analytics
export function initializeAnalytics() {
    // Initialize beacon system first
    initializeBeacon();
    
    // Start page view tracking
    trackPageView();
    
    // Set up intersection observer for card impressions
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const uid = entry.target.dataset.uid;
                    if (uid) trackCardImpression(uid);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    // Observe all cards
    document.querySelectorAll('.card[data-uid]').forEach(card => {
        observer.observe(card);
    });

    // Set up visibility change handler for dwell time
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            dwellStartTime = Date.now();
        } else {
            // Update total dwell time when page becomes hidden
            totalDwellTime += Date.now() - dwellStartTime;
        }
    });
}
