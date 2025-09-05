// /src/js/theme.js
// Map /config/profile.json → CSS variables + inline styles. Video + card shape supported.

export function initializeTheme() {
  loadFonts();
}

export function applyTheme(profile) {
  if (!profile) return;
  const root = document.documentElement;

  // --- Fonts ---------------------------------------------------------------
  const fonts = profile.typography?.fonts;

  if (fonts) {
    const urls = [];
    const bodyUrl = fonts.primary_url || fonts.body_url;
    const headingUrl = fonts.heading_url;
    if (bodyUrl) urls.push(bodyUrl);
    if (headingUrl && headingUrl !== bodyUrl) urls.push(headingUrl);

    const existing = Array.from(
      document.head.querySelectorAll('link[data-profile-font]')
    );

    for (const url of urls) {
      if (!document.head.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.dataset.profileFont = 'true';
        document.head.appendChild(link);
      }
    }

    for (const link of existing) {
      if (!urls.includes(link.href)) link.remove();
    }

    const bodyFamily =
      fonts.primary_name ||
      fonts.body_family ||
      profile.fonts?.body?.family ||
      'Inter, system-ui, sans-serif';
    const headingFamily =
      fonts.heading_name ||
      fonts.heading_family ||
      profile.fonts?.heading?.family ||
      'var(--font-body)';

    root.style.setProperty('--font-body', bodyFamily);
    root.style.setProperty('--font-heading', headingFamily);
    document.body.style.fontFamily = 'var(--font-body)';
  } else {
    loadFonts(profile.fonts);
  }

  // --- Brand tokens ---------------------------------------------------------
  root.style.setProperty('--brand-primary', profile.brand.primary);
  root.style.setProperty('--brand-secondary', profile.brand.secondary);
  root.style.setProperty('--brand-tertiary', profile.brand.tertiary);
  root.style.setProperty('--brand-text', profile.brand.text);

  // Base colors used across the sheet
  root.style.setProperty('--creator-bg', profile.colors.page_bg);
  root.style.setProperty('--creator-gradient', profile.colors.gradient);
  root.style.setProperty('--accent', profile.colors.accent);
  root.style.setProperty('--text', profile.colors.header_text);
  root.style.setProperty('--text-muted', profile.colors.desc_body_text);
  root.style.setProperty('--card-bg', profile.colors.card_bg);
  root.style.setProperty('--card-title-color', profile.colors.card_title_text);

  // --- Surfaces -------------------------------------------------------------
  // Body/background
  applySurface(document.body, profile.surfaces.background, {
    gradient: profile.colors.gradient,
    solid: profile.colors.page_bg
  });

  // Header (maps to --header-bg/--header-blur in styles.css)
  applySurface(
    document.querySelector('.header'),
    profile.surfaces.header,
    { gradient: profile.colors.gradient, solid: profile.colors.page_bg },
    '--header-bg',
    '--header-blur'
  );

  // Footer (maps to --footer-bg/--footer-blur in styles.css)
  applySurface(
    document.querySelector('.footer'),
    profile.surfaces.footer,
    { gradient: profile.colors.gradient, solid: profile.colors.page_bg },
    '--footer-bg',
    '--footer-blur'
  );

  // --- Sizes ----------------------------------------------------------------
  root.style.setProperty('--hdr-h', profile.sizes.header_height_px + 'px');
  root.style.setProperty('--footer-padding-y', profile.sizes.footer_padding_y_px + 'px');
  root.style.setProperty('--logo-size', profile.sizes.logo_px + 'px');

  // Footer layout contract: padding*2 + ~content height
  const ftrH = profile.sizes.footer_padding_y_px * 2 + 20;
  root.style.setProperty('--ftr-h', ftrH + 'px');

  // --- Typography -----------------------------------------------------------
  const handle = document.getElementById('handle');
  if (handle) {
    handle.textContent = `@${profile.handle}`;
    handle.style.fontSize = profile.typography.header_rem + 'rem';
    handle.style.fontWeight = profile.typography.header_weight;
    handle.style.color = profile.colors.header_text;
    handle.style.fontFamily = 'var(--font-heading)';
  }

  root.style.setProperty('--card-title-size', profile.typography.card_title_rem + 'rem');
  root.style.setProperty('--card-title-weight', profile.typography.card_title_weight);
  root.style.setProperty('--card-title-lines', profile.clamp.card_title_lines);

  root.style.setProperty('--footer-font-size', profile.typography.footer_rem + 'rem');
  root.style.setProperty('--footer-font-weight', profile.typography.footer_weight);

  // --- Description band -----------------------------------------------------
  const desc = document.querySelector('.description');
  if (desc) {
    // visibility + sticky
    desc.style.display = profile.description.visible ? '' : 'none';
    desc.dataset.sticky = profile.description.sticky ? 'true' : 'false';

    // width: short | mid | full  (always centered)
    const widthMode = (profile.description?.width || 'short').toLowerCase();

    // base box we never want to go smaller than
    const SHORT = 'clamp(320px, 60ch, 720px)';

    // desktop/mobile friendly mids and full
    let bandMax = SHORT;
    let boxMax  = '720px';                     // inner text box max-width
    let pMax    = '600px';                     // paragraph cap
    let margin  = 'var(--gap) auto';

    if (widthMode === 'mid') {
      bandMax = `max(${SHORT}, min(90vw, var(--grid-max)))`;
      boxMax  = 'min(70vw, var(--grid-max))';
      pMax    = '70%';
    }

    if (widthMode === 'full') {
      bandMax = '100vw';                       // full-bleed background
      margin  = 'var(--gap) 0';
      boxMax  = 'min(90vw, var(--grid-max))';  // keep inner content boxed
      pMax    = 'min(70ch, 90vw)';
    }

    root.style.setProperty('--description-max-width', bandMax);
    root.style.setProperty('--description-margin',    margin);
    root.style.setProperty('--description-content-max', boxMax);
    root.style.setProperty('--description-p-max',       pMax);

    // reset background/backdrop
    desc.style.background = '';
    desc.style.backgroundImage = '';
    desc.style.backdropFilter = '';
    desc.style.webkitBackdropFilter = '';

    // background: solid | gradient | image | glass | video
    const band = profile.surfaces.desc_band;

    if (band.mode === 'video' && band.video?.url) {
      // ensure video element inside description
      const v = ensureSurfaceVideo(desc, band.video.url, 'surface-video');
      if (v) v.style.objectFit = band.video.fit || 'cover';
      // make the overlay minimal so video is visible
      desc.style.background = 'transparent';
    } else {
      // remove any previous video
      removeSurfaceVideo(desc, 'surface-video');

      if (band.mode === 'gradient') {
        desc.style.background = profile.colors.desc_band_bg;
      } else if (band.mode === 'image' && band.image?.url) {
        desc.style.backgroundImage = `url(${band.image.url})`;
        desc.style.backgroundSize = band.image.fit || 'cover';
        desc.style.backgroundPosition = band.image.pos || 'center';
        desc.style.backgroundRepeat = 'no-repeat';
      } else if (band.mode === 'glass' && band.glass) {
        desc.style.background = `rgba(255,255,255,${band.glass.opacity ?? 0.1})`;
        const blur = `${band.glass.blur_px ?? 10}px`;
        desc.style.backdropFilter = `blur(${blur})`;
        desc.style.webkitBackdropFilter = `blur(${blur})`;
      } else {
        desc.style.background = profile.colors.page_bg; // solid
      }
    }

    // content + clamps + colors
    const title = desc.querySelector('h1');
    const body  = desc.querySelector('p');
    const link  = desc.querySelector('.create-link');
    const em    = link?.querySelector('em');

    if (title) {
      title.textContent = profile.description.title || '';
      title.style.fontSize   = profile.typography.desc_title_rem + 'rem';
      title.style.fontWeight = profile.typography.desc_title_weight;
      title.style.color      = profile.colors.desc_title_text;
      title.style.fontFamily = 'var(--font-heading)';
      title.style.display = '-webkit-box';
      title.style.webkitLineClamp = profile.clamp.tiny_desc_lines;
      title.style.webkitBoxOrient = 'vertical';
      title.style.textAlign = 'center';
    }

    if (body) {
      body.textContent = profile.description.body || '';
      body.style.fontSize   = profile.typography.desc_body_rem + 'rem';
      body.style.fontWeight = profile.typography.desc_body_weight;
      body.style.color      = profile.colors.desc_body_text;
      body.style.display = '-webkit-box';
      body.style.webkitLineClamp = profile.clamp.desc_body_lines;
      body.style.webkitBoxOrient = 'vertical';
      body.style.textAlign = 'center';
    }

    if (link && em) {
      if (profile.description.marketing_link?.show) {
        em.textContent = profile.description.marketing_link.text;
        link.style.display = '';
        link.style.color = 'var(--brand-text)'; // #121212 from tokens.css
      } else {
        link.style.display = 'none';
      }
    }
  }

  // Header quick link alignment
  const quick = document.querySelector('.header-links');
  if (quick) {
    const alignMap = { left: 'start', center: 'center', right: 'end' };
    quick.style.justifySelf = alignMap[profile.layout.header_quick_alignment] || 'end';
  }

  // Footer text color
  const footer = document.querySelector('.footer');
  if (footer) footer.style.color = profile.colors.footer_text;
}

// Internal: apply a surface mode to an element.
// bgVar and blurVar are optional CSS variable names that styles.css consumes.
function applySurface(element, surface, colors, bgVar, blurVar) {
  if (!element || !surface) return;
  const root = document.documentElement;
  const { mode, image, glass, video } = surface;

  // Body background special handling
  if (element === document.body) {
    element.style.background = '';
    element.style.backgroundImage = '';
    element.style.backgroundAttachment = '';
    delete element.dataset.gradient;

    if (mode === 'video' && video?.url) {
      // create a fixed full-screen video under everything
      let v = document.querySelector('video.video-bg');
      if (!v) {
        v = document.createElement('video');
        v.className = 'video-bg';
        v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
        Object.assign(v.style, {
          position: 'fixed',
          inset: '0',
          width: '100%',
          height: '100%',
          objectFit: video.fit || 'cover',
          zIndex: '-1'
        });
        document.body.prepend(v);
      }
      if (v.src !== video.url) v.src = video.url;
      element.style.background = 'transparent';
    } else {
      // remove bg video if present
      document.querySelector('video.video-bg')?.remove();

      if (mode === 'gradient') {
        element.dataset.gradient = 'true'; // styles.css uses body[data-gradient="true"]
      } else if (mode === 'image' && image?.url) {
        element.style.backgroundImage = `url(${image.url})`;
        element.style.backgroundSize = image.fit || 'cover';
        element.style.backgroundPosition = image.pos || 'center';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundAttachment = 'fixed'; // stick
      } else {
        element.style.background = colors.solid; // solid
      }
    }
    return;
  }

  // Reset inline image on non-body surfaces
  element.style.backgroundImage = '';
  element.style.backgroundSize = '';
  element.style.backgroundPosition = '';
  element.style.backgroundRepeat = '';

  if (mode === 'video' && video?.url) {
    const v = ensureSurfaceVideo(element, video.url, 'surface-video');
    if (v) v.style.objectFit = video.fit || 'cover';
    if (bgVar) root.style.setProperty(bgVar, 'transparent');
    if (blurVar) root.style.setProperty(blurVar, '0px');
  } else if (mode === 'glass' && glass && bgVar && blurVar) {
    root.style.setProperty(bgVar, `rgba(255,255,255,${glass.opacity})`);
    root.style.setProperty(blurVar, `${glass.blur_px}px`);
  } else if (mode === 'image' && image?.url) {
    element.style.backgroundImage = `url(${image.url})`;
    element.style.backgroundSize = image.fit || 'cover';
    element.style.backgroundPosition = image.pos || 'center';
    element.style.backgroundRepeat = 'no-repeat';
    if (bgVar) root.style.setProperty(bgVar, 'transparent');
    if (blurVar) root.style.setProperty(blurVar, '0px');
    removeSurfaceVideo(element, 'surface-video');
  } else if (mode === 'gradient') {
    if (bgVar) root.style.setProperty(bgVar, colors.gradient);
    if (blurVar) root.style.setProperty(blurVar, '0px');
    removeSurfaceVideo(element, 'surface-video');
  } else {
    if (bgVar) root.style.setProperty(bgVar, colors.solid);
    if (blurVar) root.style.setProperty(blurVar, '0px');
    removeSurfaceVideo(element, 'surface-video');
  }
}

// Util: ensure a <video> exists inside a host
function ensureSurfaceVideo(host, src, className) {
  if (!host) return null;
  let v = host.querySelector('video.' + className);
  if (!v) {
    v = document.createElement('video');
    v.className = className;
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    Object.assign(v.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: '0'
    });
    host.style.position = host.style.position || 'relative';
    host.prepend(v); // behind content
  }
  if (v.src !== src) v.src = src;
  return v;
}
function removeSurfaceVideo(host, className) {
  host?.querySelector('video.' + className)?.remove();
}

// Cards: shape tokens → data attribute + vars
export function applyCardShape(profile) {
  const shape  = profile?.cards?.shape || 'rounded'; // 'rounded' | 'blocky' | 'beveled'
  const radius = (profile?.cards?.radius_px ?? 18) + 'px';
  const bevel  = (profile?.cards?.bevel_px ?? 10) + 'px';

  document.body.dataset.cardShape = shape;  // CSS selects on this
  document.documentElement.style.setProperty('--creator-card-radius', radius);
  document.documentElement.style.setProperty('--card-bevel', bevel);
}

// Surfaces: explicit video pass (call after applyTheme if you prefer)
export function applySurfaceVideos(profile) {
  const bg = profile?.surfaces?.background;
  const hd = profile?.surfaces?.header;
  const ft = profile?.surfaces?.footer;
  const ds = profile?.surfaces?.desc_band;

  // Background video handled inside applySurface for body
  if (!(bg?.mode === 'video')) {
    document.querySelector('video.video-bg')?.remove();
  }

  // Header video
  const headerEl = document.querySelector('.header');
  if (hd?.mode === 'video' && hd.video?.url) {
    const v = ensureSurfaceVideo(headerEl, hd.video.url, 'surface-video');
    if (v) v.style.objectFit = hd.video.fit || 'cover';
  } else {
    removeSurfaceVideo(headerEl, 'surface-video');
  }

  // Footer video
  const footerEl = document.querySelector('.footer');
  if (ft?.mode === 'video' && ft.video?.url) {
    const v = ensureSurfaceVideo(footerEl, ft.video.url, 'surface-video');
    if (v) v.style.objectFit = ft.video.fit || 'cover';
  } else {
    removeSurfaceVideo(footerEl, 'surface-video');
  }

  // Description band video
  const descEl = document.querySelector('.description');
  if (ds?.mode === 'video' && ds.video?.url) {
    const v = ensureSurfaceVideo(descEl, ds.video.url, 'surface-video');
    if (v) v.style.objectFit = ds.video.fit || 'cover';
  } else {
    removeSurfaceVideo(descEl, 'surface-video');
  }
}

let defaultFontLoaded = false;
async function loadFonts(fonts) {
  // Ensure default Inter is loaded to avoid flashes.
  if (!defaultFontLoaded) {
    const interHref = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    if (!document.head.querySelector(`link[href="${interHref}"]`)) {
      const link = document.createElement('link');
      link.href = interHref;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    defaultFontLoaded = true;
  }

  if (!fonts) return;

  const urls = [];
  const bodyUrl = fonts.body?.url;
  const headingUrl = fonts.heading?.url;
  if (bodyUrl) urls.push(bodyUrl);
  if (headingUrl && headingUrl !== bodyUrl) urls.push(headingUrl);

  const existing = Array.from(document.head.querySelectorAll('link[data-profile-font]'));

  for (const url of urls) {
    if (!document.head.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.dataset.profileFont = 'true';
      document.head.appendChild(link);
    }
  }

  for (const link of existing) {
    if (!urls.includes(link.href)) link.remove();
  }
}
