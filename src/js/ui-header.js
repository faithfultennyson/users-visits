// Header functionality
import { trackHeaderLinkClick } from './analytics.js';
import { getLinksConfig, getProfileConfig } from './state.js';
import { validateUrl } from './util.js';

function createSocialLink(link, iconBasePath) {
    const a = document.createElement('a');
    a.href = link.href;
    a.setAttribute('aria-label', link.aria);
    
    const img = document.createElement('img');
    img.src = `${iconBasePath}${link.icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    
    a.appendChild(img);
    return a;
}

function createMenuLink(link, iconBasePath) {
    const a = document.createElement('a');
    a.href = link.href;
    a.setAttribute('aria-label', link.aria);
    
    const img = document.createElement('img');
    img.src = `${iconBasePath}${link.icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    
    if (link.title) {
        const span = document.createElement('span');
        span.textContent = link.title;
        a.appendChild(span);
    }
    
    a.appendChild(img);
    return a;
}

export function initializeHeader() {
    console.log('Initializing header...');
    
    const links = getLinksConfig();
    const profile = getProfileConfig();
    
    console.log('Header config:', { links, profile });
    
    if (!links || !profile) {
        console.error('Missing configuration for header');
        return;
    }

    // Set handle text
    const handleEl = document.getElementById('handle');
    if (handleEl && profile.handle) {
        handleEl.textContent = '@' + profile.handle;
    }

    // Set up quick links
    const headerLinks = document.querySelector('.header-links');
    if (headerLinks && links.header?.quick) {
        headerLinks.innerHTML = '';
        const validQuickLinks = links.header.quick
            .filter(link => link.href && validateUrl(link.href))
            .slice(0, 3);

        validQuickLinks.forEach(link => {
            const a = createSocialLink(link, links.icons.base_path);
            headerLinks.appendChild(a);
            a.addEventListener('click', () => trackHeaderLinkClick(link.href, 'header-quick'));
        });
    }
    
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
