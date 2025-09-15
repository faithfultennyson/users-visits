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
import { adaptiveDeadline } from './offline-deadline.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ---- loader DOM + freeze scroll -----------------------------------------
  const unfreeze = freezeScroll();
  const loader = mountLoader(); // returns {root, logo}

  try {
    // base UI (fonts, header shell, reports)
    initializeTheme();
    initializeHeader();
    initializeReports();

    const profile = await getPublicProfile();
    // update loader accent/logo only if profile has favicon; DEFAULT_PROFILE has none, so this is a no-op
    const logoUrl = profile?.assets?.favicon?.svg || profile?.assets?.favicon?.png32 || profile?.assets?.favicon?.apple || profile?.assets?.favicon?.png16 || '';
    if (logoUrl && loader.logo) loader.logo.src = logoUrl;

    setProfile(profile);
    applyHeadMeta(profile);
    applyTheme(profile);
    applySurfaceVideos(profile);
    applyCardShape(profile);

    await renderSocialButtons?.(); // optional if present

    // Start 5s deadline AFTER first paint of shell
    const deadline = adaptiveDeadline(5000, () => {
      console.warn('cards_deadline_expired');
      // keep skeletons; Phase 0 no redirect
    });
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    deadline.start();

    // Kick cards fetch
    const cards = await getPublicCards();
    setCards(cards);
    initializeGrid(cards);
    initializeScroll();
    initializeAnalytics();

    await wait(700);
  } catch (err) {
    console.error('init error:', err);
    // fall through; we still clear loader + unfreeze so page is usable
  } finally {
    // remove loader + unfreeze scroll
    loader.root?.remove();
    unfreeze();
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
