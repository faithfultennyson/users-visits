import { initializeTheme } from './theme.js';
import { initializeGrid } from './ui-cards.js';
import { initializeReports } from './reports.js';
import { initializeAnalytics } from './analytics.js';
import { getPublicProfile, getPublicCards } from './api.js';
import { setCards, setProfile } from './state.js';
import { initializeHeader } from './ui-header.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initializing CreatorGrid app...');
        
        // Initialize theme first
        console.log('Initializing theme...');
        initializeTheme();

        // Initialize header
        console.log('Initializing header...');
        initializeHeader();

        // Initialize reports system
        console.log('Initializing reports system...');
        initializeReports();
        
        // Get initial data
        console.log('Fetching initial data...');
        const [profile, cards] = await Promise.all([
            getPublicProfile(),
            getPublicCards()
        ]);

        console.log(`Received ${cards.length} cards and profile data`);

        // Set state
        setProfile(profile);
        setCards(cards);

        // Initialize grid with cards
        console.log('Initializing grid...');
        initializeGrid(cards);

        // Initialize analytics last
        console.log('Initializing analytics...');
        initializeAnalytics();

        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
});
