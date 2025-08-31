// Header functionality
export function initializeHeader() {
    const hamburgerBtn = document.getElementById('hamburger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');

    if (hamburgerBtn && hamburgerMenu) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            hamburgerMenu.classList.toggle('visible');
            hamburgerMenu.setAttribute('aria-hidden', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerMenu.classList.remove('visible');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerMenu.setAttribute('aria-hidden', 'true');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerMenu.classList.contains('visible')) {
                hamburgerMenu.classList.remove('visible');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                hamburgerMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }
}
