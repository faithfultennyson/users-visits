// Theme initialization and management
import { getProfileConfig } from './state.js';

export function initializeTheme() {
    console.log('Initializing theme...');
    const profile = getProfileConfig();
    console.log('Theme config:', profile);

    if (!profile) {
        console.error('No profile config available for theme');
        return;
    }

    const root = document.documentElement;
    
    // Apply brand colors
    root.style.setProperty('--brand-primary', profile.brand.primary);
    root.style.setProperty('--brand-secondary', profile.brand.secondary);
    root.style.setProperty('--brand-tertiary', profile.brand.tertiary);
    root.style.setProperty('--brand-text', profile.brand.text);

    // Apply color scheme
    root.style.setProperty('--creator-bg', profile.colors.page_bg);
    root.style.setProperty('--creator-gradient', profile.colors.gradient);

    // Apply surface styles for header
    if (profile.surfaces.header.mode === 'glass') {
        root.style.setProperty('--header-bg', `rgba(255,255,255,${profile.surfaces.header.glass.opacity})`);
        root.style.setProperty('--header-blur', `${profile.surfaces.header.glass.blur_px}px`);
    }

    // Set header size
    root.style.setProperty('--logo-size', `${profile.sizes.logo_px}px`);
    root.style.setProperty('--header-height', `${profile.sizes.header_height_px}px`);

    // Set footer styles
    if (profile.surfaces.footer.mode === 'glass') {
        root.style.setProperty('--footer-bg', `rgba(0,0,0,${profile.surfaces.footer.glass.opacity})`);
        root.style.setProperty('--footer-blur', `${profile.surfaces.footer.glass.blur_px}px`);
    }

    // Set gradient on body if needed
    document.body.dataset.gradient = profile.surfaces.background.mode === 'gradient' ? 'true' : 'false';
    
    // Load fonts
    loadFonts();
    
    console.log('Theme initialization complete');
}

async function loadFonts() {
    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}
