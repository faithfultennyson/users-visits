import { getProfileConfig } from './state.js';

// Theme initialization and management
export function initializeTheme() {
    // Load fonts
    loadFonts();
    
    // Apply theme from config
    applyThemeFromConfig();
}

async function loadFonts() {
    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

function setCSSVariable(name, value) {
    if (value) {
        document.documentElement.style.setProperty(name, value);
    }
}

function setupGlassEffect(selector, config) {
    if (!config) return;

    const { opacity = 0, blur_px = 0 } = config.glass || {};
    
    if (config.mode === 'glass') {
        const background = `rgba(255, 255, 255, ${opacity})`;
        const blur = `blur(${blur_px}px)`;
        
        setCSSVariable(`--${selector.substring(1)}-bg`, background);
        setCSSVariable(`--${selector.substring(1)}-glass`, blur);
    }
}

function setupDescriptionBand(config) {
    const description = document.querySelector('.description');
    if (!description || !config) return;

    if (config.mode === 'gradient') {
        description.style.background = config.colors?.desc_band_bg;
    } else if (config.mode === 'image' && config.image?.url) {
        description.style.backgroundImage = `url(${config.image.url})`;
        description.style.backgroundSize = 'cover';
        description.style.backgroundPosition = config.image.pos || 'center';
    }
}

function applyTypography(config) {
    if (!config) return;

    const handleElem = document.getElementById('handle');
    if (handleElem) {
        handleElem.style.fontSize = `${config.header_rem}rem`;
        handleElem.style.fontWeight = config.header_weight;
    }

    const descTitle = document.querySelector('.description h1');
    if (descTitle) {
        descTitle.style.fontSize = `${config.desc_title_rem}rem`;
        descTitle.style.fontWeight = config.desc_title_weight;
    }

    const descBody = document.querySelector('.description p');
    if (descBody) {
        descBody.style.fontSize = `${config.desc_body_rem}rem`;
        descBody.style.fontWeight = config.desc_body_weight;
    }

    document.querySelectorAll('.title').forEach(title => {
        title.style.fontSize = `${config.card_title_rem}rem`;
        title.style.fontWeight = config.card_title_weight;
    });

    document.querySelectorAll('.footer-legal a, .copyright').forEach(el => {
        el.style.fontSize = `${config.footer_rem}rem`;
        el.style.fontWeight = config.footer_weight;
    });
}

function applyThemeFromConfig() {
    const config = getProfileConfig();
    if (!config) return;

    // Apply brand colors
    setCSSVariable('--brand-primary', config.brand.primary);
    setCSSVariable('--brand-secondary', config.brand.secondary);
    setCSSVariable('--brand-tertiary', config.brand.tertiary);
    setCSSVariable('--brand-text', config.brand.text);

    // Apply surface colors and effects
    setCSSVariable('--creator-bg', config.colors.page_bg);
    setCSSVariable('--creator-gradient', config.colors.gradient);
    setCSSVariable('--accent', config.colors.accent);

    // Apply text colors
    setCSSVariable('--header-text', config.colors.header_text);
    setCSSVariable('--desc-title-text', config.colors.desc_title_text);
    setCSSVariable('--desc-body-text', config.colors.desc_body_text);
    setCSSVariable('--card-title-text', config.colors.card_title_text);
    setCSSVariable('--footer-text', config.colors.footer_text);

    // Setup surface effects
    setupGlassEffect('header', config.surfaces.header);
    setupGlassEffect('footer', config.surfaces.footer);
    setupDescriptionBand(config.surfaces.desc_band);

    // Apply sizes
    setCSSVariable('--logo-size', `${config.sizes.logo_px}px`);
    setCSSVariable('--hdr-h', `${config.sizes.header_height_px}px`);
    setCSSVariable('--footer-padding-y', `${config.sizes.footer_padding_y_px}px`);

    // Apply typography
    applyTypography(config.typography);

    // Set description visibility and alignment
    const description = document.querySelector('.description');
    if (description) {
        description.style.display = config.description.visible ? 'block' : 'none';
        description.classList.toggle('sticky', config.description.sticky);
        description.classList.toggle('align-center', config.layout.description_align === 'center');
        description.classList.toggle('align-left', config.layout.description_align === 'left');
    }

    // Update description content
    const descTitle = document.querySelector('.description h1');
    if (descTitle) {
        descTitle.textContent = config.description.title;
    }

    const descBody = document.querySelector('.description p');
    if (descBody) {
        descBody.textContent = config.description.body;
    }

    // Apply gradient background if specified
    document.body.dataset.gradient = config.colors.gradient ? 'true' : 'false';
}
