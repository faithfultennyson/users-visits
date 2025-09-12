import { getReportedCards } from './beacon.js';
import { applyTheme } from './theme.js';

// State management
let state = {
    cards: [],
    pinnedCards: [],
    currentFilter: 'ig', // Default to Instagram
    currentPage: 0,
    reportedCards: getReportedCards(), // Initialize from localStorage
    profile: null,
    linksConfig: null
};

// Debug state changes
function logStateChange(action, data) {
    console.log(`State Change - ${action}:`, data);
}

// Getters
export const getCards = () => state.cards;
export const getPinnedCards = () => state.pinnedCards;
export const getCurrentFilter = () => state.currentFilter;
export const getCurrentPage = () => state.currentPage;
export const getProfile = () => state.profile;
export const getLinksConfig = () => state.linksConfig;
export const isCardReported = (cardPublicHash) => state.reportedCards.has(cardPublicHash);

// Setters
export const setCards = (cards) => {
    logStateChange('setCards', { count: cards.length });
    state.cards = cards;
    state.pinnedCards = cards.filter(card => card.pinned);
};

export const setFilter = (filter) => {
    logStateChange('setFilter', { from: state.currentFilter, to: filter });
    state.currentFilter = filter;
    state.currentPage = 0;
};

export const incrementPage = () => {
    logStateChange('incrementPage', { from: state.currentPage, to: state.currentPage + 1 });
    state.currentPage++;
};

import { saveReportedCards } from './beacon.js';

export const markCardReported = (cardPublicHash) => {
    logStateChange('markCardReported', { public_hash: cardPublicHash });
    state.reportedCards.add(cardPublicHash);
    saveReportedCards(state.reportedCards);
};

export const setProfile = (profile) => {
    logStateChange('setProfile', { handle: profile.handle });
    state.profile = profile;
    applyTheme(profile);
};

export const setLinksConfig = (links) => {
    logStateChange('setLinksConfig', {});
    state.linksConfig = links;
};

export const APP_STATE = state;
