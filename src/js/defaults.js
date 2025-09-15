// Single source of truth used only when network/config fails.
// Copy the values from /config/profile.json EXCEPT assets and any logo/profile image.
export const DEFAULT_PROFILE = {
  handle: "Take_Down",
  brand: { primary:"#26C6DA", secondary:"#4361EE", tertiary:"#3A0CA3", text:"#121212" },
  colors: {
    accent:"#26C6DA",
    gradient:"linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
    header_text:"#FFFFFF",
    desc_title_text:"#26C6DA",
    desc_body_text:"#FFFFFF",
    card_title_text:"#FFFFFF",
    footer_text:"#CCCCCC",
    card_bg:"#121212",
    desc_band_bg:"linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
    header_bg:"#26C6DA",
    footer_bg:"#26C6DA",
    desc_bg:"#3A0CA3",
    background_bg:"#26C6DA"
  },
  cards: { shape:"rounded", radius_px:18, bevel_px:10 },
  fonts: {
    primary:{ family:"Inter, system-ui, sans-serif" },     // keep Inter as safe default
    heading:{ family:"Merriweather, serif" }
  },
  surfaces: {
    background:{ mode:"gradient", image:{}, glass:{opacity:0,blur_px:0}, video:{} },
    header:{ mode:"glass", image:{}, glass:{opacity:0.10, blur_px:15}, video:{} },
    footer:{ mode:"glass", image:{}, glass:{opacity:0.20, blur_px:15}, video:{} },
    desc_band:{ mode:"glass", image:{}, glass:{opacity:0.8, blur_px:35}, video:{} }
  },
  sizes:{ header_height_px:94, footer_padding_y_px:52, logo_px:64 },
  typography:{
    header_rem:1.70, header_weight:600,
    desc_title_rem:1.20, desc_title_weight:800,
    desc_body_rem:1.00, desc_body_weight:400,
    card_title_rem:1.00, card_title_weight:800,
    footer_rem:0.95, footer_weight:500
  },
  clamp:{ tiny_desc_lines:1, desc_body_lines:3, card_title_lines:2 },
  layout:{ header_quick_alignment:"right", description_align:"center" },
  description:{
    visible:true, sticky:true, width:"short",
    title:"Welcome to my creative space",
    body:"Explore my latest content from Instagram and TikTok. Feel free to browse through my curated collection of posts and connect with me on various social platforms",
    marketing_link:{ show:true, text:"Create your own creative space" }
  }
};
