// /src/js/main.js
import { applyHeadMeta } from './head.js';
import { initializeTheme, applyTheme, applyCardShape, applySurfaceVideos } from './theme.js';
import { initializeHeader } from './ui-header.js';
import { initializeGrid } from './ui-cards.js';
import { initializeReports } from './reports.js';
import { initializeAnalytics } from './analytics.js';
import { getPublicProfile, getPublicCards } from './api.js';
import { setCards, setProfile } from './state.js';
import { initializeScroll } from './ui-scroll.js';
import { renderSocialButtons } from './ui-social.js';
import { reduceMotion } from './a11y.js';

const HOME = 'https://creatorspase.com';

function makeOfflineAwareTimer(ms, onExpire) {
  let remain = ms, timer = 0, t0 = 0, wasOnline = navigator.onLine;
  const clear = () => { if (timer) { clearTimeout(timer); timer = 0; } };
  const start = () => {
    if (!navigator.onLine || timer || remain <= 0) return;
    t0 = performance.now();
    timer = setTimeout(() => { timer = 0; onExpire(); }, remain);
  };
  const reset = () => { clear(); remain = ms; };
  const pause = () => {
    if (!timer) return;
    const spent = performance.now() - t0;
    clear(); remain = Math.max(0, remain - spent);
  };
  window.addEventListener('offline', () => { wasOnline = false; pause(); });
  window.addEventListener('online',  () => { if (!wasOnline) { wasOnline = true; start(); } });
  return { start, reset, pause, remaining: () => remain };
}

document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');

  initializeTheme();
  initializeReports();
  initializeAnalytics();

  // Config deadline: 3s from now; pause on offline
  const configDeadline = makeOfflineAwareTimer(3000, () => {
    if (app.classList.contains('is-hidden')) window.location.replace(HOME);
  });
  configDeadline.start();

    try {
      // Fetch both configs in parallel; block render until both resolve
      const [profile, links] = await Promise.all([
        getPublicProfile(),   // /config/profile.json (has theme + meta)
        getLinksConfig()      // /config/links.json (has header/footer icons)
      ]);

      setProfile(profile);          // also calls applyTheme in state.js
      setLinksConfig(links);

      applyHeadMeta(profile);
      applyCardShape(profile);
      applySurfaceVideos(profile);

      // Header/Footer depend on links; initialize after links are set
      initializeHeader();
      renderSocialButtons?.();

      // Reveal app, hide loader, unlock scroll
      app.classList.remove('is-hidden');
      app.classList.add('is-ready');
      loader?.classList.remove('visible');
      body.classList.remove('loading');

      // Cards deadline: 5s starting AFTER app is visible; pause on offline
      const cardsDeadline = makeOfflineAwareTimer(5000, () => {
        const grid = document.getElementById('grid');
        const hasCards = grid && grid.querySelector('[data-card]');
        if (!hasCards) window.location.replace(HOME);
      });
      requestAnimationFrame(() => requestAnimationFrame(() => cardsDeadline.start()));

      // Fetch and render cards (existing logic)
      try {
        const cards = await getPublicCards();
        setCards(cards);
        initializeGrid(cards);
        initializeScroll();
      } catch (e) {
        // Let cardsDeadline handle redirect after 5s if nothing renders
        console.warn('cards fetch error', e);
      }
    } catch (e) {
      // On config error: allow configDeadline to redirect after 3s (online-only)
      console.error('config init error', e);
    }
});

// ---------- helpers ----------------------------------------------------------

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function freezeScroll() {
  const html = document.documentElement;
  const body = document.body;
  const prevHtml = html.style.overflow;
  const prevBody = body.style.overflow;
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  return () => {
    html.style.overflow = prevHtml || '';
    body.style.overflow = prevBody || '';
  };
}

function mountLoader() {
  // container
  const root = document.createElement('div');
  root.id = 'app-loader';
  root.setAttribute('aria-busy', 'true');
  root.style.position = 'fixed';
  root.style.inset = '0';
  root.style.zIndex = '2147483647';
  root.style.background = 'var(--creator-bg, #000)';
  root.style.display = 'grid';
  root.style.placeItems = 'center';
  root.style.pointerEvents = 'none';

  // stack: logo square + progress bar
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.placeItems = 'center';
  wrap.style.rowGap = '72px';

  // logo square
  const box = document.createElement('div');
  box.style.width = '48px';
  box.style.height = '48px';
  box.style.borderRadius = '12px';
  box.style.background = 'rgba(255,255,255,0.08)';

  const logo = document.createElement('img');
  logo.alt = '';
  logo.style.width = '100%';
  logo.style.height = '100%';
  logo.style.objectFit = 'cover';
  logo.style.borderRadius = '12px';
  logo.style.display = 'block';
  box.appendChild(logo);

  // progress bar
  const bar = document.createElement('div');
  bar.style.width = 'min(420px, 60vw)';
  bar.style.height = '6px';
  bar.style.borderRadius = '999px';
  bar.style.background = 'rgba(255,255,255,0.06)';
  bar.style.overflow = 'hidden';
  const fill = document.createElement('div');
  fill.style.width = '40%';
  fill.style.height = '100%';
  fill.style.borderRadius = '999px';
  fill.style.background = 'var(--creator-gradient, linear-gradient(90deg,#26C6DA,#4361EE))';
  fill.style.transform = 'translateX(-60%)';
  if (!reduceMotion) fill.style.animation = 'loader-sweep 1.6s ease-in-out infinite';
  bar.appendChild(fill);

  // keyframes (inline so no CSS edit needed)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes loader-sweep {
      0% { transform: translateX(-70%); opacity: .6; }
      50% { transform: translateX(10%); opacity: 1; }
      100% { transform: translateX(120%); opacity: .6; }
    }
  `;
  document.head.appendChild(style);

  wrap.appendChild(box);
  wrap.appendChild(bar);
  root.appendChild(wrap);
  document.body.appendChild(root);

  return { root, logo };
}
