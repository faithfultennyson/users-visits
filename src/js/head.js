export function applyHeadMeta(profile) {
  // ----- FAVICONS
  document.head.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());
  const fav = profile?.assets?.favicon || {};
  addLink({ rel:'icon', type:'image/svg+xml', href: fav.svg || '/assets/favicon/favicon.svg' });
  addLink({ rel:'icon', type:'image/png', sizes:'32x32', href: fav.png32 || '/assets/favicon/favicon-32.png' });
  addLink({ rel:'icon', type:'image/png', sizes:'16x16', href: fav.png16 || '/assets/favicon/favicon-16.png' });
  addLink({ rel:'apple-touch-icon', sizes:'180x180', href: fav.apple || '/assets/favicon/apple-touch-icon.png' });

  // ----- TEXT
  const handle = profile?.handle?.trim();
  const desc   = profile?.description?.body?.trim();
  const h1     = profile?.description?.title?.trim();
  const ogImg  = profile?.assets?.social_image || fav.png32 || fav.svg || '/assets/og/default-og.png';

  // Title: prefer handle if present
  if (handle) document.title = `${handle} | CreatorGrid`;

  // Description: only override if we actually have content
  if (desc) {
    setMeta('description', desc);
    setMeta('twitter:description', desc);
    setMetaProp('og:description', desc);
  }

  // Headline
  if (h1) {
    setMeta('twitter:title', h1);
    setMetaProp('og:title', h1);
  }

  // OG/Twitter image
  setMetaProp('og:image', ogImg);
  setMeta('twitter:image', ogImg);
}

function addLink(attrs) {
  if (!attrs.href) return;
  const el = document.createElement('link');
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
  document.head.appendChild(el);
}
function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setMetaProp(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
