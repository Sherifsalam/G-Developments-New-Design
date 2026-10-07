/**
 * Media map — mirrors the image columns of the legacy database dump (g_website_starter.sql)
 * so every file sits in the same place it has in the backend storage:
 *
 *   hero_banners.image            -> hero-banners/…            (homepage hero)
 *   offices.image                 -> offices/…                 (HQ)
 *   projects.hero_image           -> projects/hero/…           (project page cover, closing section)
 *   projects.thumbnail_image      -> projects/thumbnails/…     (destination cards)
 *   projects.gallery[]            -> projects/gallery/…        (project modal gallery, launches, amenities)
 *   projects.amenities[].image    -> projects/amenities/…      (project modal amenities)
 *
 * The files live in src/assets/media/<same path>. When the backend moves to Supabase Storage,
 * set VITE_MEDIA_BASE (e.g. https://<ref>.supabase.co/storage/v1/object/public/media/) and
 * `mediaUrl()` resolves the same paths from the bucket instead of the bundled copies.
 *
 * Notes from the dump:
 * - Each project's thumbnail is the same file as its hero, and NewKairo's second gallery image is
 *   the same file as its hero, so those entries point at one bundled copy.
 * - offices/01KJVWA95… is the same photo as the homepage hero banner.
 * - NewKairo's amenity rows pair "Swimming Pool" with a dumbbell icon and "Gymnasium" with a dining
 *   icon. The icon is chosen by `kind` below so the page stays correct; fix the rows in the CMS.
 */

const bundled = import.meta.glob('./assets/media/**/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' });
const BASE = import.meta.env?.VITE_MEDIA_BASE || '';

/** Resolve a backend storage path (e.g. "projects/hero/01K….webp") to a URL. */
export function mediaUrl(path) {
  if (!path) return null;
  if (BASE) return `${BASE.replace(/\/$/, '')}/${path}`;
  const direct = bundled[`./assets/media/${path}`];
  if (direct) return direct;
  // thumbnails are byte-identical to heroes in the dump; fall back to the hero copy
  const alias = ALIASES[path];
  return alias ? bundled[`./assets/media/${alias}`] || null : null;
}

const ALIASES = {
  'projects/thumbnails/01KJVYK8ZGMCK45Y672TAF9W0N.webp': 'projects/hero/01KJVYK8ZRE8PDD2E50RN8CS6M.webp',
  'projects/thumbnails/01KJVYY3D2P38PYF3M2XWDYQTJ.webp': 'projects/hero/01KJVYY3D7R8ASMM7D2D12VVWW.webp',
  'projects/thumbnails/01KJVZ3EGW3CKQ599F89A0W8PE.webp': 'projects/hero/01KJVZ3EH1TEVYWDE16ABVK06Y.webp',
  'projects/thumbnails/01KK66HQFEP68XR2N8T045Z265.webp': 'projects/hero/01KK66HQFKJ81X0M8EFBV1FBGX.webp',
  'projects/thumbnails/01KK66Q18ZS3R1TBH8RBCW41GD.webp': 'projects/hero/01KK66Q194HMG6B2Q38198S5DJ.webp',
  'projects/gallery/01KJVWVDXW30FW3WHEDM6BZ9A9.webp': 'projects/hero/01KJVYK8ZRE8PDD2E50RN8CS6M.webp',
};

/** hero_banners (id 1) */
export const HERO_BANNER = {
  image: 'hero-banners/01KJVX31Y1D8X23XZ48NAC87KW.webp',
  alt: { en: 'Aerial view of a G Developments community at sunset', ar: 'منظر جوي لمجتمع من G Developments عند الغروب' },
};

/** offices (id 1, headquarters) */
export const HQ_OFFICE = {
  image: 'offices/01KJVWA95RPXPCAY00BJ4641W2.webp',
  address: { en: 'KM 22, Cairo–Alexandria Desert Road, Giza', ar: 'الكيلو 22 طريق القاهرة–الإسكندرية الصحراوي، الجيزة' },
  mapUrl: 'https://maps.app.goo.gl/zM53Eryp6QmKoBSp6',
};

/**
 * projects — keyed by the site's project id; `slug` is the backend slug.
 * amenities keep the CMS label; `kind` picks the matching icon file.
 */
const AMENITY_ICON = {
  gym: 'projects/amenities/01KJVYY3CQM8WQCVXR7RDF61DJ.png',    // dumbbell + kettlebell
  gymAlt: 'projects/amenities/01KJVWVDXK6PRW7P45MHSEGERB.png', // flexed-arm dumbbell
  dining: 'projects/amenities/01KJVYY3CYXKAG5180FW7HTBGY.png', // cloche
};

/**
 * Communities that had no photography in the backend. These renders are listing-site and brochure
 * copies fetched by scripts/download_project_images.py — placeholders until the marketing team
 * supplies originals. `masterplan` is shown by the project page's Masterplan tab in place of the
 * generic schematic.
 */
const PLACEHOLDER_MEDIA = {
  ivy: {
    slug: 'ivy-new-zayed',
    hero: 'projects/ivy/aerial.webp',
    thumbnail: 'projects/ivy/aerial.webp',
    masterplan: 'projects/ivy/masterplan.png',
    gallery: ['projects/ivy/sports-club.webp', 'projects/ivy/townhouses.webp'],
    amenities: [],
  },
  'city-view': {
    slug: 'city-view',
    hero: 'projects/city-view/lagoon.webp',
    thumbnail: 'projects/city-view/lagoon.webp',
    // Property Finder copy; carries an elbayt.com watermark — replace with the original.
    masterplan: 'projects/city-view/masterplan.webp',
    gallery: ['projects/city-view/apartments.webp', 'projects/city-view/pool.webp'],
    amenities: [],
  },
  'ein-bay': {
    slug: 'ein-bay',
    hero: 'projects/ein-bay/aerial.webp',
    thumbnail: 'projects/ein-bay/aerial.webp',
    masterplan: 'projects/ein-bay/masterplan.jpg',
    gallery: ['projects/ein-bay/golf.webp', 'projects/ein-bay/lakeside.webp'],
    amenities: [],
  },
  // Ein Resort is taken to be The G Einbay, the G Hotels resort at Ein Bay; these are that
  // hotel's own photographs from theg-hotels.com.
  'ein-resort': {
    slug: 'ein-resort',
    hero: 'projects/ein-resort/resort.webp',
    thumbnail: 'projects/ein-resort/resort.webp',
    gallery: [
      'projects/ein-resort/pool.webp',
      'projects/ein-resort/beach.webp',
      'projects/ein-resort/entrance.webp',
      'projects/ein-resort/dining.webp',
    ],
    amenities: [],
  },
  // Hacienda Red: every source in scripts/projects-images-masterplans.json attributes this
  // compound to Palm Hills, so its listing on the site still needs the client's confirmation.
  // `gate-branded-unused.webp` is held back on purpose — it shows the Hacienda entrance sign.
  'hacienda-red': {
    slug: 'hacienda-red',
    hero: 'projects/hacienda-red/lagoon-villas.webp',
    thumbnail: 'projects/hacienda-red/lagoon-villas.webp',
    gallery: ['projects/hacienda-red/sea-view.webp', 'projects/hacienda-red/compound.webp'],
    amenities: [],
  },
};

export const PROJECT_MEDIA = {
  ...PLACEHOLDER_MEDIA,
  'new-kairo': {
    slug: 'newkairo',
    hero: 'projects/hero/01KJVYK8ZRE8PDD2E50RN8CS6M.webp',
    thumbnail: 'projects/thumbnails/01KJVYK8ZGMCK45Y672TAF9W0N.webp',
    gallery: [
      'projects/gallery/01KJVWVDXTJFQT5PKKV295PNVC.webp',
      'projects/gallery/01KJVWVDXW30FW3WHEDM6BZ9A9.webp',
      'projects/gallery/01KJVWVDXX2Y1GT5XH11KWWB33.webp',
    ],
    amenities: [
      { en: 'Swimming pools', ar: 'حمامات السباحة', detail: { en: 'Five Olympic-size pools with sun decks', ar: 'خمسة حمامات أولمبية مع مناطق استلقاء' }, kind: null },
      { en: 'Gymnasium', ar: 'صالة ألعاب', detail: { en: 'State-of-the-art fitness centre', ar: 'مركز لياقة حديث' }, kind: 'gymAlt' },
    ],
  },
  seashell: {
    slug: 'seashell',
    hero: 'projects/hero/01KJVYY3D7R8ASMM7D2D12VVWW.webp',
    thumbnail: 'projects/thumbnails/01KJVYY3D2P38PYF3M2XWDYQTJ.webp',
    gallery: ['projects/gallery/01KJVYY3DC4GT1CNF874W5PF0E.webp', 'projects/gallery/01KJVYY3DHAQRQGA7DNP76RZYZ.webp'],
    amenities: [
      { en: 'Beachfront gym', ar: 'صالة رياضية على الشاطئ', kind: 'gym' },
      { en: 'Upscale dining', ar: 'مطاعم راقية', kind: 'dining' },
    ],
  },
  'playa-ghazala': {
    slug: 'playa',
    hero: 'projects/hero/01KJVZ3EH1TEVYWDE16ABVK06Y.webp',
    masterplan: 'projects/masterplans/playa-ghazala-masterplan.webp',
    thumbnail: 'projects/thumbnails/01KJVZ3EGW3CKQ599F89A0W8PE.webp',
    gallery: [
      'projects/gallery/01KJVZ3EH85BHQFXDAZ4Z4FEBF.webp',
      'projects/gallery/01KJVZ3EHEMQ0K938FC4ERCAX0.webp',
      'projects/playa-ghazala/g-villas.webp',
      'projects/playa-ghazala/g-village.webp',
    ],
    amenities: [{ en: 'Beachfront gym', ar: 'صالة رياضية على الشاطئ', kind: 'gym' }],
  },
  'seashell-rh': {
    slug: 'seashell-ras-el-hekma',
    hero: 'projects/hero/01KK66HQFKJ81X0M8EFBV1FBGX.webp',
    thumbnail: 'projects/thumbnails/01KK66HQFEP68XR2N8T045Z265.webp',
    masterplan: 'projects/masterplans/seashell-rh-masterplan.webp', // sales site, "Master Plan" section
    gallery: [
      'projects/gallery/01KK66HQFSC53W1V0RE7287DKY.webp',
      'projects/gallery/01KK66HQFZG6NYDW3W6WZX1XEB.webp',
      'projects/gallery/seashell-rh-lagoon-pool.webp',
    ],
    amenities: [{ en: 'Beachfront gym', ar: 'صالة رياضية على الشاطئ', kind: 'gym' }],
  },
  'playa-rh': {
    slug: 'playa-ras-el-hekma',
    hero: 'projects/hero/01KK66Q194HMG6B2Q38198S5DJ.webp',
    thumbnail: 'projects/thumbnails/01KK66Q18ZS3R1TBH8RBCW41GD.webp',
    gallery: [
      'projects/gallery/01KK66Q19A3VMYGR9CN780TYZN.webp',
      'projects/gallery/01KK66Q19FJ0AVZ3QP0G8DFPBR.webp',
      'projects/gallery/playa-rh-beach-aerial.webp',
    ],
    amenities: [{ en: 'Upscale dining', ar: 'مطاعم راقية', kind: 'dining' }],
  },
};

export const amenityIcon = (kind) => (kind ? mediaUrl(AMENITY_ICON[kind]) : null);

/**
 * Playa Ghazala artwork pulled from the sales site (scripts/download_images.py, Sep 2026).
 * The source page paired several of these with the wrong caption — the names here follow what
 * each render actually shows, which is how the project page uses them.
 */
export const PLAYA_GHAZALA_MEDIA = {
  masterplan: 'projects/masterplans/playa-ghazala-masterplan.webp',
  brand: 'projects/playa-ghazala/brand-playa.webp',
  zones: {
    spine: 'projects/playa-ghazala/zone-central-spine.webp',
    promenade: 'projects/playa-ghazala/zone-promenade.webp',
    downtown: 'projects/playa-ghazala/zone-cable-park.webp',
  },
  offerings: {
    'g-villas': 'projects/playa-ghazala/g-villas.webp',
    'g-village': 'projects/playa-ghazala/g-village.webp',
  },
  sports: 'projects/playa-ghazala/sports-district.webp',
};

/** Cover / card / gallery helpers used by the page. */
export function projectImages(id) {
  const m = PROJECT_MEDIA[id];
  if (!m) return { cover: null, card: null, gallery: [] };
  const all = [m.hero, ...m.gallery].map(mediaUrl).filter(Boolean);
  return {
    cover: mediaUrl(m.hero),
    card: mediaUrl(m.thumbnail),
    gallery: [...new Set(all)],
  };
}
