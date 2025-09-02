// Theme initialization and management
export function initializeTheme() {
    loadFonts();
}

export function applyTheme(profile) {
    if (!profile) return;
    const root = document.documentElement;

    // Brand colors
    root.style.setProperty('--brand-primary', profile.brand.primary);
    root.style.setProperty('--brand-secondary', profile.brand.secondary);
    root.style.setProperty('--brand-tertiary', profile.brand.tertiary);
    root.style.setProperty('--brand-text', profile.brand.text);

    // Base colors
    root.style.setProperty('--creator-bg', profile.colors.page_bg);
    root.style.setProperty('--creator-gradient', profile.colors.gradient);
    root.style.setProperty('--accent', profile.colors.accent);
    root.style.setProperty('--text', profile.colors.header_text);
    root.style.setProperty('--text-muted', profile.colors.desc_body_text);

    // Glass surfaces
    const hGlass = profile.surfaces.header.glass;
    root.style.setProperty('--header-bg', `rgba(255,255,255,${hGlass.opacity})`);
    root.style.setProperty('--header-blur', `${hGlass.blur_px}px`);
    const fGlass = profile.surfaces.footer.glass;
    root.style.setProperty('--footer-bg', `rgba(0,0,0,${fGlass.opacity})`);
    root.style.setProperty('--footer-blur', `${fGlass.blur_px}px`);

    // Sizes
    root.style.setProperty('--hdr-h', profile.sizes.header_height_px + 'px');
    root.style.setProperty('--footer-padding-y', profile.sizes.footer_padding_y_px + 'px');
    root.style.setProperty('--logo-size', profile.sizes.logo_px + 'px');
    const ftrH = profile.sizes.footer_padding_y_px * 2 + 20;
    root.style.setProperty('--ftr-h', ftrH + 'px');

    // Typography variables
    root.style.setProperty('--card-title-size', profile.typography.card_title_rem + 'rem');
    root.style.setProperty('--card-title-weight', profile.typography.card_title_weight);
    root.style.setProperty('--card-title-lines', profile.clamp.card_title_lines);
    root.style.setProperty('--footer-font-size', profile.typography.footer_rem + 'rem');
    root.style.setProperty('--footer-font-weight', profile.typography.footer_weight);
    root.style.setProperty('--card-title-color', profile.colors.card_title_text);

    // Header text
    const handle = document.getElementById('handle');
    if (handle) {
        handle.textContent = `@${profile.handle}`;
        handle.style.fontSize = profile.typography.header_rem + 'rem';
        handle.style.fontWeight = profile.typography.header_weight;
        handle.style.color = profile.colors.header_text;
    }

    // Description
    const desc = document.querySelector('.description');
    if (desc) {
        desc.style.display = profile.description.visible ? '' : 'none';
        desc.dataset.sticky = profile.description.sticky ? 'true' : 'false';
        desc.classList.toggle('align-center', profile.layout.description_align === 'center');
        desc.classList.toggle('align-left', profile.layout.description_align === 'left');
        if (profile.surfaces.desc_band.mode === 'gradient') {
            desc.style.background = profile.colors.desc_band_bg;
        } else if (profile.surfaces.desc_band.mode === 'image') {
            const img = profile.surfaces.desc_band.image;
            if (img?.url) {
                desc.style.backgroundImage = `url(${img.url})`;
                desc.style.backgroundSize = img.fit || 'cover';
                desc.style.backgroundPosition = img.pos || 'center';
                desc.style.backgroundRepeat = 'no-repeat';
            }
        }
        const title = desc.querySelector('h1');
        const body = desc.querySelector('p');
        const link = desc.querySelector('.create-link');
        const em = link?.querySelector('em');
        if (title) {
            title.textContent = profile.description.title || '';
            title.style.fontSize = profile.typography.desc_title_rem + 'rem';
            title.style.fontWeight = profile.typography.desc_title_weight;
            title.style.color = profile.colors.desc_title_text;
            title.style.display = '-webkit-box';
            title.style.webkitLineClamp = profile.clamp.tiny_desc_lines;
            title.style.webkitBoxOrient = 'vertical';
        }
        if (body) {
            body.textContent = profile.description.body || '';
            body.style.fontSize = profile.typography.desc_body_rem + 'rem';
            body.style.fontWeight = profile.typography.desc_body_weight;
            body.style.color = profile.colors.desc_body_text;
            body.style.display = '-webkit-box';
            body.style.webkitLineClamp = profile.clamp.desc_body_lines;
            body.style.webkitBoxOrient = 'vertical';
        }
        if (link && em) {
            if (profile.description.marketing_link?.show) {
                em.textContent = profile.description.marketing_link.text;
                link.style.display = '';
                link.style.color = 'var(--accent)';
            } else {
                link.style.display = 'none';
            }
        }
    }

    const quick = document.querySelector('.header-links');
    if (quick) {
        const alignMap = {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end'
        };
        quick.style.justifyContent = alignMap[profile.layout.header_quick_alignment] || 'flex-end';
    }

    // Footer color
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.color = profile.colors.footer_text;
    }

    // Body gradient toggle
    if (profile.colors.gradient) {
        document.body.dataset.gradient = 'true';
    }
}

async function loadFonts() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

