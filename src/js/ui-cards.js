import { getCards, getCurrentFilter, isCardReported, setCards, setFilter } from './state.js';
import { trackCardClick, trackCardImpression } from './analytics.js';

// Constants for virtualization
const INITIAL_RENDER = 48;  // First batch size
const BATCH_SIZE = 24;      // Subsequent batch sizes
const WINDOW_CAP = 100;     // Max cards in DOM
const SKELETON_COUNT = 3;   // Number of skeleton loaders

// Observers configuration
const INTERSECTION_OPTIONS = {
    threshold: 0.5,
    rootMargin: '100px'
};

let cardObserver = null;
let sentinelObserver = null;
let currentBatch = [];
let filteredCards = [];
let currentIndex = 0;

/* ---------------- observers ---------------- */

function setupObservers() {
    // Card observer for impressions and image loading
    cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const img = card.querySelector('.thumb[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }
                trackCardImpression(card.dataset.uid);
                cardObserver.unobserve(card);
            }
        });
    }, INTERSECTION_OPTIONS);

    // Sentinel observer for infinite scroll
    sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                appendNextBatch();
            }
        });
    }, { rootMargin: '150px' });
}

/* ---------------- helpers ---------------- */

function truncateTitle(title = '') {
  const avgCharsPerLine = 25;
  const maxChars = avgCharsPerLine * 2;
  if (title.length <= maxChars) return title;

  let truncated = title.slice(0, maxChars - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.75) truncated = truncated.slice(0, lastSpace);
  return truncated + '...';
}

// inline SVG placeholder used as a background layer under the image
const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="742" height="960" viewBox="0 0 742 960" role="img" aria-labelledby="title desc">
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

/* ---------------- DOM builders ---------------- */

function createCardElement(card) {
  const uid = card?.uid || '';
  const targetUrl = card?.targetUrl || '#';
  const title = card?.title || '';
  const imageUrl = card?.imageUrl || '';
  const source = card?.source || ''; // kept for data-source + filtering

  const cardEl = document.createElement('a');
  cardEl.className = 'card';
  cardEl.href = targetUrl;
  cardEl.target = '_blank';
  cardEl.rel = 'noopener';
  cardEl.dataset.uid = uid;
  cardEl.dataset.source = source;

  const reportedAttr = isCardReported(uid) ? 'disabled' : '';

  cardEl.innerHTML = `
    <div class="thumb-wrap">
      <div class="ph" aria-hidden="true">${placeholderSvg}</div>
      <img class="thumb" data-src="${imageUrl}" alt="" loading="lazy" onerror="this.style.display='none'">
    </div>

    <button class="icon-btn dot-btn" type="button" aria-label="Report or more actions" ${reportedAttr}>
      &#8943; <!-- ⋯ -->
    </button>

    <div class="card-footer">
      <h3 class="title" title="${title.replace(/"/g, '&quot;')}">${truncateTitle(title)}</h3>
    </div>

    <div class="copy-feedback">Link copied!</div>
  `;

  // Card click analytics (ignore dot button)
  cardEl.addEventListener('click', (e) => {
    if (!e.target.closest('.dot-btn')) trackCardClick(uid);
  });

  // Optional: long-press to copy URL
  let pressTimer;
  cardEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.dot-btn')) return;
    pressTimer = setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(targetUrl);
        const fb = cardEl.querySelector('.copy-feedback');
        fb?.classList.add('visible');
        setTimeout(() => fb?.classList.remove('visible'), 1500);
      } catch {}
    }, 500);
  });
  ['mouseup', 'mouseleave'].forEach(evt =>
    cardEl.addEventListener(evt, () => clearTimeout(pressTimer))
  );

  return cardEl;
}

/* ---------------- virtualization helpers ---------------- */

function createSkeletonCard() {
    const div = document.createElement('div');
    div.className = 'skeleton-card';
    div.innerHTML = `
        <div class="thumb-wrap"></div>
        <div class="card-footer">
            <div class="title"></div>
        </div>
    `;
    return div;
}

function appendSkeletons() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < SKELETON_COUNT; i++) {
        grid.appendChild(createSkeletonCard());
    }
}

function removeSkeletons() {
    document.querySelectorAll('.skeleton-card').forEach(skeleton => skeleton.remove());
}

function appendSentinel() {
    const sentinel = document.getElementById('grid-sentinel');
    if (sentinel) sentinel.remove();
    
    if (currentIndex < filteredCards.length) {
        const sentinel = document.createElement('div');
        sentinel.id = 'grid-sentinel';
        sentinel.style.gridColumn = '1 / -1';
        sentinel.style.height = '1px';
        document.getElementById('grid').appendChild(sentinel);
        sentinelObserver.observe(sentinel);
    }
}

function trimOldCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
    if (cards.length > WINDOW_CAP) {
        const removeCount = cards.length - WINDOW_CAP;
        cards.slice(0, removeCount).forEach(card => {
            cardObserver.unobserve(card);
            card.remove();
        });
    }
}

function appendNextBatch(batchSize = BATCH_SIZE) {
    if (currentIndex >= filteredCards.length) return;
    
    appendSkeletons();
    
    const fragment = document.createDocumentFragment();
    const endIndex = Math.min(currentIndex + batchSize, filteredCards.length);
    
    for (let i = currentIndex; i < endIndex; i++) {
        const card = filteredCards[i];
        const cardEl = createCardElement(card);
        cardObserver.observe(cardEl);
        fragment.appendChild(cardEl);
    }
    
    removeSkeletons();
    document.getElementById('grid').appendChild(fragment);
    currentIndex = endIndex;
    
    trimOldCards();
    appendSentinel();
}

/* ---------------- render pipeline ---------------- */

function renderCards() {
    const grid = document.getElementById('grid');
    if (!grid) return;

    // Reset state
    currentIndex = 0;
    grid.innerHTML = '';

    // Filter and sort cards by index
    const currentFilter = getCurrentFilter();
    filteredCards = getCards()
        .filter(card => card.source === currentFilter)
        .sort((a, b) => (a.index || 0) - (b.index || 0));

    // Render initial batch
    appendNextBatch(INITIAL_RENDER);
}

/* ---------------- public API ---------------- */

export function initializeGrid(initialCards) {
    if (!initialCards?.length) {
        console.warn('No initial cards provided');
        return;
    }

    // Initialize cards and observers
    setCards(initialCards);
    setupObservers();

    // Set up filter buttons
    document.querySelectorAll('.filters button').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update button states
            document.querySelectorAll('.filters button').forEach(btn => {
                const isActive = btn === button;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });

            // Update filter and re-render
            setFilter(filter);
            renderCards();
        });
    });

    // Initial render
    renderCards();
}
