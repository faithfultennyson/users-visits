export function initializeScroll() {
    const backToTopButton = document.getElementById('backToTop');
    const footer = document.querySelector('.footer');
    
    function getTriggerHeight() {
        const isMobile = window.innerWidth <= 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isMobile) {
            return window.innerHeight * (isLandscape ? 1.5 : 1); // 1.5x for landscape, 2x for portrait
        }
        return window.innerHeight * 2; // Desktop trigger height
    }

    let triggerHeight = getTriggerHeight();

    function handleScroll() {
        if (window.scrollY > triggerHeight) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
        triggerHeight = getTriggerHeight(); // Update trigger height on resize
        handleScroll(); // Re-check scroll position
    });
    backToTopButton?.addEventListener('click', scrollToTop);

    // Add sticky footer after 5 seconds with animation
    setTimeout(() => {
        footer?.classList.add('sticky');
    }, 5000);
}
