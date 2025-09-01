import { trackHeaderLinkClick } from './analytics.js';
import { getLinksConfig, getProfileConfig } from './state.js';

function createQuickLink(link, basePath) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', link.aria);

    const img = document.createElement('img');
    img.src = `${basePath}${link.icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');

    a.appendChild(img);
    return a;
}

function createOverflowLink(link, basePath) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', link.aria);

    const iconContainer = document.createElement('span');
    iconContainer.className = 'icon';
    
    const img = document.createElement('img');
    img.src = `${basePath}${link.icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    
    const text = document.createElement('span');
    text.textContent = link.title;
    
    iconContainer.appendChild(img);
    a.appendChild(iconContainer);
    a.appendChild(text);
    
    return a;
}

export function initializeHeader() {
    const hamburgerBtn = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeBtn = hamburgerMenu?.querySelector('.close-menu');
    const quickLinks = document.querySelector('.quick-links');
    const overflowLinks = hamburgerMenu?.querySelector('.overflow-links');

    // Get configs
    const linksConfig = getLinksConfig();
    const profileConfig = getProfileConfig();
    
    if (!linksConfig?.icons?.base_path) {
        console.error('Links config not loaded');
        return;
    }
    
    const basePath = linksConfig.icons.base_path;
    
    // Setup quick links
    if (quickLinks && linksConfig.header?.quick) {
        quickLinks.innerHTML = '';
        // Enforce exactly 3 quick links
        const quickLinksToShow = linksConfig.header.quick.slice(0, 3);
        quickLinksToShow.forEach(link => {
            const quickLink = createQuickLink(link, basePath);
            quickLink.addEventListener('click', () => trackHeaderLinkClick(link.href, 'quick'));
            quickLinks.appendChild(quickLink);
        });

        // Set alignment from profile config
        if (profileConfig?.layout?.header_quick_alignment) {
            quickLinks.style.justifyContent = profileConfig.layout.header_quick_alignment;
        }
    }
    
    // Setup overflow menu
    if (overflowLinks && linksConfig.header?.overflow) {
        overflowLinks.innerHTML = '';
        linksConfig.header.overflow.forEach(link => {
            const overflowLink = createOverflowLink(link, basePath);
            overflowLink.addEventListener('click', () => {
                trackHeaderLinkClick(link.href, 'overflow');
                toggleMenu(false);
            });
            overflowLinks.appendChild(overflowLink);
        });
    }
    
    // Set handle text
    const handleElement = document.getElementById('handle');
    if (handleElement && profileConfig) {
        handleElement.textContent = profileConfig.handle;
    }

    // Setup hamburger menu functionality
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
