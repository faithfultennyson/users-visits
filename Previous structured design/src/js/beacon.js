// Shared analytics functionality
const STORAGE_KEYS = {
    ANON_ID: 'cg_aid',
    SESSION_ID: 'cg_sid',
    LAST_ACTIVE: 'cg_last',
    REPORTED_CARDS: 'cg_reported'
};

// Generate a random ID with timestamp prefix for uniqueness
function generateId(prefix = '') {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create anonymous ID (persists across sessions)
function getAnonId() {
    let aid = localStorage.getItem(STORAGE_KEYS.ANON_ID);
    if (!aid) {
        aid = generateId('a-');
        localStorage.setItem(STORAGE_KEYS.ANON_ID, aid);
    }
    return aid;
}

// Get or create session ID (new for each session)
function getSessionId() {
    let sid = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sid) {
        sid = generateId('s-');
        sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sid);
    }
    return sid;
}

// Update last active timestamp
function updateLastActive() {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
}

// Check if we should start a new session
function shouldStartNewSession() {
    const lastActive = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE) || '0');
    const inactiveTime = Date.now() - lastActive;
    return inactiveTime > 30 * 60 * 1000; // 30 minutes
}

// Get reported cards from localStorage
export function getReportedCards() {
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTED_CARDS);
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Save reported cards to localStorage
export function saveReportedCards(reportedCards) {
    localStorage.setItem(STORAGE_KEYS.REPORTED_CARDS, JSON.stringify([...reportedCards]));
}

// Create unified payload structure for all events
export function createPayload(eventName, data = {}) {
    const payload = {
        event: eventName,
        aid: getAnonId(),
        sid: getSessionId(),
        ts: Date.now(),
        url: window.location.href,
        ref: document.referrer || undefined,
        vp: {
            w: window.innerWidth,
            h: window.innerHeight
        },
        ...data
    };

    updateLastActive();
    return payload;
}

// Initialize beacon system
export function initializeBeacon() {
    // Start new session if needed
    if (shouldStartNewSession()) {
        sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    }
    
    // Initialize session and last active
    getSessionId();
    updateLastActive();
    
    // Set up visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (shouldStartNewSession()) {
                sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
                getSessionId(); // Get new session ID
            }
            updateLastActive();
        }
    });
}

// Export storage keys for use in other modules
export { STORAGE_KEYS };
