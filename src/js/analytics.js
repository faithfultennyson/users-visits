// Throttle implementation
let eventQueue = [];
const MAX_EVENTS = 10;
const WINDOW_SIZE = 10000; // 10 seconds

function isThrottled() {
    const now = Date.now();
    // Remove events older than window size
    eventQueue = eventQueue.filter(ts => now - ts < WINDOW_SIZE);
    return eventQueue.length >= MAX_EVENTS;
}

function trackEvent(eventName, data = {}) {
    if (isThrottled()) return;
    
    eventQueue.push(Date.now());
    console.log('Analytics Event:', eventName, data);
}

// Event trackers
export function trackPageView() {
    let hasTracked = false;
    
    // Track after 2s if tab is visible
    setTimeout(() => {
        if (document.visibilityState === 'visible' && !hasTracked) {
            trackEvent('page_view', { ts: Date.now() });
            hasTracked = true;
        }
    }, 2000);
}

export function trackCardImpression(uid) {
    trackEvent('card_impression', { uid, ts: Date.now() });
}

export function trackCardClick(uid) {
    trackEvent('card_click', { uid });
}

export function trackHeaderLinkClick(href, source = 'header') {
    trackEvent('header_link_click', { href, source });
}

export function trackReportOpen(uid, reason) {
    trackEvent('report_open', { uid, reason });
}

export function trackReportSubmit(uid, reason) {
    trackEvent('report_submit', { uid, reason });
}

// Initialize analytics
export function initializeAnalytics() {
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
}
