// Header functionality
import { trackHeaderLinkClick } from './analytics.js';
import { getLinksConfig } from './api.js';
import { setLinksConfig } from './state.js';
import { initializeFooter } from './ui-footer.js';

function createLink(link, basePath, withTitle = false) {
    const a = document.createElement('a');
    a.href = link.href;
    if (link.href.startsWith('https://')) {
        a.target = '_blank';
        a.rel = 'noopener';
    }
    a.setAttribute('aria-label', link.aria);

    const img = document.createElement('img');
    img.src = `${basePath}${link.icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    a.appendChild(img);

    if (withTitle) {
        const span = document.createElement('span');
        span.textContent = link.title;
        a.appendChild(span);
    }

    a.addEventListener('click', () => trackHeaderLinkClick(link.href, 'header'));
    return a;
}

export function initializeHeader() {
    const hamburgerBtn = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeBtn = hamburgerMenu?.querySelector('.close-menu');
    const overflowNav = hamburgerMenu?.querySelector('.menu-links');
    const quickNav = document.querySelector('.header-links');

    // Load links config and render
    getLinksConfig().then(config => {
        setLinksConfig(config);
        const base = config.icons.base_path;
        if (quickNav) {
            quickNav.innerHTML = '';
            config.header.quick.forEach(link => {
                quickNav.appendChild(createLink(link, base));
            });
        }
        if (overflowNav) {
            overflowNav.innerHTML = '';
            config.header.overflow.forEach(link => {
                overflowNav.appendChild(createLink(link, base, true));
            });
        }
        initializeFooter();
    }).catch(err => console.error(err));

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
