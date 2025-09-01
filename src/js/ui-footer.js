import { getLinksConfig } from './state.js';
import { trackHeaderLinkClick } from './analytics.js';

function createFooterIcon(link, basePath) {
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

function createTextLink(link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = link.label;
    return a;
}

export function initializeFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const linksConfig = getLinksConfig();
    if (!linksConfig?.footer) return;

    // Handle footer visibility
    if (!linksConfig.footer.visible) {
        footer.style.display = 'none';
        return;
    }

    const footerLinks = footer.querySelector('.footer-links');
    const footerLegal = footer.querySelector('.footer-legal');
    const copyright = footer.querySelector('.copyright');
    const basePath = linksConfig.icons.base_path;

    // Clear existing content
    if (footerLinks) footerLinks.innerHTML = '';
    if (footerLegal) footerLegal.innerHTML = '';

    // Add icon links
    if (footerLinks && linksConfig.footer.icons) {
        linksConfig.footer.icons.forEach(link => {
            const iconLink = createFooterIcon(link, basePath);
            iconLink.addEventListener('click', () => trackHeaderLinkClick(link.href, 'footer'));
            footerLinks.appendChild(iconLink);
        });
    }

    // Add text links
    if (footerLegal && linksConfig.footer.text_links) {
        linksConfig.footer.text_links.forEach(link => {
            if (link.fixed || link.show) {
                const textLink = createTextLink(link);
                textLink.addEventListener('click', () => trackHeaderLinkClick(link.href, 'footer'));
                footerLegal.appendChild(textLink);
            }
        });
    }

    // Set disclaimer
    if (copyright && linksConfig.footer.disclaimer) {
        copyright.textContent = linksConfig.footer.disclaimer;
    }

    // Make footer sticky after delay
    setTimeout(() => {
        footer.classList.add('sticky');
    }, 5000);
}
