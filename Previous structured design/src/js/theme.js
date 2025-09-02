// Theme initialization and management
export function initializeTheme() {
    // Set initial gradient state
    document.body.dataset.gradient = '1';
    
    // Load fonts
    loadFonts();
}

async function loadFonts() {
    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}
