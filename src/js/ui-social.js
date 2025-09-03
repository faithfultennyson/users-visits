import { getIntegrations } from './api.js';

function setActiveFilter(source) {
  // source = 'ig' | 'tt' | null (null => show all)
  const grid = document.getElementById('grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('[data-source]'); // renderer should set this
  cards.forEach(el => {
    const s = el.getAttribute('data-source');
    el.style.display = (!source || s === source) ? '' : 'none';
  });

  // analytics hook optional
  // window.cgBeacon?.('filter_change', { source: source || 'all' });
}

export async function renderSocialButtons() {
  const mount = document.getElementById('social-cta');
  if (!mount) return;

  const { instagram, tiktok } = await getIntegrations();

  // Only show when BOTH are present; else remove entirely
  if (!(instagram && tiktok)) {
    mount.remove();
    // Also ensure ALL cards are visible if only one provider exists
    setActiveFilter(null);
    return;
  }

  // Icons
  const base = '/assets/icons/';
  const igBtn = mount.querySelector('#btn-ig');
  const ttBtn = mount.querySelector('#btn-tt');
  igBtn?.querySelector('img')?.setAttribute('src', base + 'social-instagram_icon.svg');
  ttBtn?.querySelector('img')?.setAttribute('src', base + 'social-tiktok_icon.svg');

  // Default = show ALL content, no active tab
  setActiveFilter(null);
  igBtn?.setAttribute('aria-pressed', 'false');
  ttBtn?.setAttribute('aria-pressed', 'false');
  igBtn?.classList.remove('active');
  ttBtn?.classList.remove('active');

  // Click handlers (toggle behavior)
  function toggle(tab, other, source) {
    const isActive = tab.classList.contains('active');
    if (isActive) {
      tab.classList.remove('active');
      tab.setAttribute('aria-pressed', 'false');
      setActiveFilter(null); // back to ALL
      return;
    }
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    other.classList.remove('active');
    other.setAttribute('aria-pressed', 'false');
    setActiveFilter(source);
  }

  igBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!ttBtn) return;
    toggle(igBtn, ttBtn, 'ig');
  });

  ttBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!igBtn) return;
    toggle(ttBtn, igBtn, 'tt');
  });

  mount.hidden = false;
}
