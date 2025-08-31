import { getCards, getPinnedCards, getCurrentFilter, isCardReported, setCards, setFilter } from './state.js';
import { trackCardClick } from './analytics.js';

function truncateTitle(title) {
    // Average chars per line assuming 16px font and card width
    const avgCharsPerLine = 25;
    const maxChars = avgCharsPerLine * 2; // 2 lines
    
    if (title.length <= maxChars) return title;
    
    // Try to break at word boundary
    let truncated = title.slice(0, maxChars - 1);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxChars * 0.75) { // Only break at space if it's far enough
        truncated = truncated.slice(0, lastSpace);
    }
    
    return truncated + '...';
}

function createCardElement(card) {
    const cardEl = document.createElement('a');
    cardEl.className = 'card';
    cardEl.href = card.targetUrl;
    cardEl.target = '_blank';
    cardEl.rel = 'noopener';
    cardEl.dataset.uid = card.uid;
    cardEl.dataset.source = card.source;

    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="742" height="960" viewBox="0 0 742 960" role="img" aria-labelledby="title desc">
        <title id="title">Image placeholder</title>
        <desc id="desc">A gradient background with a centered photo icon for use when images fail to load.</desc>
        <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0ea5e9"/>
                <stop offset="100%" stop-color="#1d4ed8"/>
            </linearGradient>
            <linearGradient id="iconFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.82"/>
            </linearGradient>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
            <clipPath id="photoClip">
                <rect x="-96" y="-72" width="192" height="144" rx="14" ry="14"/>
            </clipPath>
        </defs>
        <rect width="742" height="960" fill="url(#bg)"/>
        <g transform="translate(371 480)" filter="url(#shadow)">
            <rect x="-128" y="-128" width="256" height="256" rx="28" ry="28"
                  fill="#ffffff" fill-opacity="0.12"
                  stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
            <g clip-path="url(#photoClip)">
                <rect x="-96" y="-72" width="192" height="144" rx="14" ry="14" fill="url(#iconFill)"/>
                <circle cx="58" cy="-44" r="12" fill="#e6eefc"/>
                <path d="M -96,56 L -52,0 L -16,38 L 10,18 L 96,72 L -96,72 Z" fill="#dbe5fb"/>
            </g>
            <rect x="-96" y="-72" width="192" height="144" rx="14" ry="14"
                  fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1.5"/>
        </g>
    </svg>`;

    cardEl.innerHTML = `
        <img class="thumb" src="${card.imageUrl}" alt="" loading="lazy" onerror="this.outerHTML='${placeholderSvg}'"/>
        <button class="icon-btn dot-btn" type="button" aria-label="Report or more actions" 
            ${isCardReported(card.uid) ? 'disabled' : ''}>i</button>
        <div class="card-footer">
            <h3 class="title two-lines" title="${card.title}">${truncateTitle(card.title)}</h3>
            <span class="badge ${card.source}">
                <img src="assets/socials/social-${card.source.toLowerCase()}_icon.svg" alt="" aria-hidden="true">
                ${card.source === 'ig' ? 'IG' : 'TT'}
            </span>
        </div>
        <div class="copy-feedback">Link copied!</div>
    `;

    let pressTimer;
    
    cardEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('.dot-btn')) return;
        
        pressTimer = setTimeout(async () => {
            try {
                await navigator.clipboard.writeText(card.targetUrl);
                const feedback = cardEl.querySelector('.copy-feedback');
                feedback.classList.add('visible');
                setTimeout(() => {
                    feedback.classList.remove('visible');
                }, 1500);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }, 500);
    });

    cardEl.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });

    cardEl.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });

    cardEl.addEventListener('click', (e) => {
        if (!e.target.closest('.dot-btn')) {
            trackCardClick(card.uid);
        }
    });

    return cardEl;
}

function renderCards() {
    const grid = document.getElementById('grid');
    if (!grid) return;

    const currentFilter = getCurrentFilter();
    const pinnedCards = getPinnedCards().filter(card => card.source === currentFilter);
    const regularCards = getCards()
        .filter(card => !card.pinned && card.source === currentFilter)
        .slice(0, 48); // Initial load of 48 cards

    // Clear grid
    grid.innerHTML = '';

    // Render pinned cards first
    pinnedCards.forEach(card => {
        grid.appendChild(createCardElement(card));
    });

    // Render regular cards
    regularCards.forEach(card => {
        grid.appendChild(createCardElement(card));
    });

    // Add lazy loading observer
    setupLazyLoading();
}

function setupLazyLoading() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        },
        { rootMargin: '50px' }
    );

    document.querySelectorAll('.thumb[data-src]').forEach(img => {
        observer.observe(img);
    });
}

export function initializeGrid(initialCards) {
    console.log('Initializing grid with cards:', initialCards?.length);
    
    // Initialize grid with cards
    if (initialCards?.length) {
        setCards(initialCards);
        
        // Set up filter event listeners
        const filterButtons = document.querySelectorAll('.filters button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                console.log('Filter clicked:', filter);
                
                // Update button states
                filterButtons.forEach(btn => {
                    const isActive = btn === button;
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-pressed', isActive);
                });
                
                // Update state and re-render
                setFilter(filter);
                renderCards();
            });
        });

        // Initial render
        console.log('Performing initial render');
        renderCards();
    } else {
        console.warn('No initial cards provided');
    }
}
