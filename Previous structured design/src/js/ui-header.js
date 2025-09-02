// Header functionality
import { trackHeaderLinkClick } from './analytics.js';

export function initializeHeader() {
    const hamburgerBtn = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeBtn = hamburgerMenu?.querySelector('.close-menu');
    
    // Setup footer link tracking
    const footer = document.querySelector('.footer');
    footer?.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link) {
            trackHeaderLinkClick(link.href, 'footer');
        }
    });

    if (hamburgerBtn && hamburgerMenu && closeBtn) {
        const toggleMenu = (show) => {
            hamburgerMenu.classList.toggle('visible', show);
            hamburgerBtn.setAttribute('aria-expanded', show);
            hamburgerMenu.setAttribute('aria-hidden', !show);
            hamburgerBtn.textContent = show ? '✕' : '☰';
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });

        closeBtn.addEventListener('click', () => toggleMenu(false));

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerMenu.classList.contains('visible')) {
                toggleMenu(false);
            }
        });
    }
}
