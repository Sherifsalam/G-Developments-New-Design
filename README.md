# G Developments homepage — prototype v3

```
npm install
npm run dev
```

## Imagery from the backend
All photographs come from the legacy database (`g_website_starter.sql`) and sit in
`src/assets/media/` under the **same paths the database stores**:

| Database column | Folder | Used in |
|---|---|---|
| `hero_banners.image` | `hero-banners/` | Homepage hero |
| `offices.image` | `offices/` | HQ (same photo as the hero banner) |
| `projects.hero_image` | `projects/hero/` | Project page cover, closing section |
| `projects.thumbnail_image` | (same file as hero) | Destination cards |
| `projects.gallery[]` | `projects/gallery/` | Project gallery, latest launches, lifestyle tiles |
| `projects.amenities[].image` | `projects/amenities/` | Project "Amenities" tab (icons recoloured white) |

`src/media.js` mirrors those records. To serve the same paths from Supabase Storage, set
`VITE_MEDIA_BASE=https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/`.

Communities with no backend records use placeholder renders fetched from listing sites and
brochures (see below); the two with nothing available still use the black-and-white brand plates.

## Pages
| Path | Page |
|---|---|
| `/` | Homepage |
| `/residences` | All communities: location, status, unit type, lifestyle filters; grid or map view |
| `/residences/latest-launches` | Newest launch, all recent launches, register-interest form |
| `/residences/:slug` | One community: key facts, concept, call-back card, gallery/plans, interactive masterplan, location (slugs match thegdevelopments.com) |
| `/residences/:slug/units` | Unit types and starting prices, filterable; payment plan |
| `/about` | Overview: intro, key numbers, sub-page index, Our Approach, G Group |
| `/about/story` | 70-year timeline with a year bar that follows the scroll |
| `/about/vision` | Vision, mission, values, why families choose us |
| `/about/leadership` | "Built on people": chairman (cornerstone), board (columns), executive team (floors). `/about/board` and `/about/executive-team` land on their level |
| `/about/sustainability` | Four commitments and initiatives |
| `/g-group`, `/g-group/:slug` | Company list and ecosystem; one company page per G Group company |
| `/journal`, `/journal/:slug` | News and launches; one article |
| `/contact` | Inquiry form and contact details |

Old live-site and design-board paths (`/community/...`, `/about-us/...`, `/contact-us`, `/media`, `/en/...`) redirect to these.
Routing uses the History API, so the host must serve `index.html` for unknown paths
(Vite dev/preview already do; on Netlify/Vercel/Nginx add an SPA fallback rule).

## "Where we build" map
Homepage section after the projects row (`src/MapJourney.jsx`, loaded on demand). Scrolling unfolds a
crumpled paper world map, a magnifier settles on Egypt, the glass then opens out until the whole
country fills the stage, and from there you pick a destination to zoom in. Four scroll beats, all
driven by one `scrollYProgress` inside `recompute()`:

| Progress | Beat |
|---|---|
| 0.02 – 0.40 | the crumpled map unfolds |
| 0.45 – 0.60 | the magnifier arrives and settles over Egypt (drag it here) |
| 0.66 – 0.84 | the glass opens out (`openE`) into `countryView()` — all of Egypt, full stage |
| 0.84 – 1.0 | pick a destination; the view flies into that area |

The hint line is written straight to the DOM from the same scroll value the scene is drawn from,
rather than from React state, so it can never lag behind the view.
- Outlines: Natural Earth via `world-atlas` (public domain), converted to `src/map/geo.json` by
  `npm run build:map` (`scripts/build-map.mjs`). Only needed again if the map area changes.
- `npm run build:map` also writes `src/map/governorates.json` (Egypt's 27 governorates, Natural Earth
  10m admin-1, public domain; the ~40 MB source is cached in `scripts/.cache/` and can be deleted).
  A project whose pin has `gov` in `MAP_POINTS` gets a location map framed on that governorate, with
  it outlined and labelled: IVY New Zayed and City View (Giza), NEWKAIRO (Cairo). Each `gov` was
  checked by testing the pin against the boundaries. The view never gets tighter than the default
  window, so a small governorate like Cairo is framed rather than zoomed into.
- Project pins, zoom areas, town labels and the (simplified) Nile are in `content.js`
  (`MAP_POINTS`, `MAP_AREAS`, `MAP_PLACES`, `MAP_NILE`). Three areas zoom in: North Coast, Greater
  Cairo and Ain Sokhna.
- The magnifier frames Egypt edge to edge (`MAP_ANCHOR`, `LENS_SPAN` in `MapJourney.jsx`). Inside the
  glass you see the country on its own — neighbouring land, the graticule and their labels are hidden
  (`restRef`, and `outside: true` in `MAP_LENS`) and fade back in only as you fly into a destination.
  The surrounding paper map fades out once the glass settles, so the magnified country is all that is left.
- Detail that only reads at lens magnification: cities, deserts and seas (`MAP_LENS`), the Delta, Lake
  Nasser, the Suez Canal (`MAP_DELTA`, `MAP_SUEZ`), the Tropic of Cancer and a 1° grid, plus a live
  coordinates and scale readout under the rim.

## Files
- `src/GDevelopments.jsx`: shell, router and homepage (props: `onLead`, `onNavigate`, `initialLang`, `showIntro`)
- `src/pages/`: every page except the homepage, loaded on demand (`index.jsx` picks the page;
  `residences.jsx`, `masterplan.jsx`, `about.jsx`, `leadership.jsx`, `group.jsx`, `journal.jsx`,
  `contact.jsx`, `shared.jsx`)
- `src/MapJourney.jsx`: the "Where we build" map scene
- `src/content.js`: EN/AR copy, projects, amenities, approach, G Group companies, journal
- `src/content-pages.js`: EN/AR copy for About, Leadership, G Group, launches and units pages
- `src/media.js`: backend image map
- `src/elastic.jsx`: smooth scroll, magnetic buttons, wordmark, string divider
- `src/effects/`: ThreeUI ports (Liquid Form, Ribbon Field, Condensation)
- `scripts/download_images.py` + `scripts/playa-ghazala.json`: the Playa Ghazala scrape and its image
  fetcher. Re-run with `python scripts/download_images.py`; files land in `scripts/images/` and are
  copied into `src/assets/media/` by hand (see "Playa Ghazala artwork" below).

## Type scale and motion
- Display sizes are CSS `clamp(min, vw, max)` values tuned to a mainstream property-site scale
  (the client's reference is emaarmisr.com). The content column is `max-w-[1320px]`.
- Project cards (`ReelCard`) use a 4:3 picture and a tight caption so a whole card fits on a
  1366x768 laptop at 100% zoom; the all-communities grid goes to four columns from `xl`.
- The gallery frame is sized by height (`h-[min(60svh,70vw)]`), not by aspect ratio — an
  `aspect-*` box with a `max-h` shrinks its own width to keep the ratio, which left a narrow
  picture in a wide column.
- The Gallery / Masterplan / Units / Amenities tabs on a project page stick under the header
  while you scroll their panel, at the same offset as the About tabs.
- Scroll-in reveals all go through `useRevealProps()` / `staggered()` in `GDevelopments.jsx`
  (`Reveal`, `RiseItem`, the destinations rail, the lifestyle grid, the board columns). They fade and
  rise; when the reader prefers reduced motion the props are dropped and the content is simply there.
  `Photo` behaves the same way, so images are never hidden behind a load event that never fires.
- The footer wordmark plays when it is scrolled to (`<ElasticWordmark inView />`), not on mount —
  on mount it finished long before anyone reached the bottom of the page.

## Our story
`STORY` in `content-pages.js`: the timeline starts at the company's founding in 2006 and runs to
today (2006, 2010s, 2016, 2020s, 2024, Today), under the headline "Twenty years in the making",
with three guiding principles above it. Nothing before 2006 and no founders' names are shown.
The principles, the purpose line ("better, healthier lives") and the education milestone come from
a 2023 company profile the client supplied (a university management study, not an official
document). **Confirm before launch:** the 2016 university milestone and its EGP 2.7 billion figure.

Left out of that profile on purpose: its financial figures (they contradict each other: $79M
revenue against a $3bn gross profit), "established 1997" (the site says 2006), a Zamalek HQ (the
site lists KM 22), headcount, interviewed staff and the org chart, unverified awards and ISO/LEED
certifications, and everything about the New Giza compound, which is excluded from the site. It
also lists Hacienda among the group's projects, which bears on the open question about Hacienda Red.

"1955" still appears outside the story page: the About overview ("Egypt since 1955", the
"Family founded" stat, "seventy years" in the approach text) and the leadership page's cornerstone
("G · 1955", "Building Egypt since 1955"). Decide whether those should start at 2006 too.

## G Group profiles
`GROUP_COMPANIES` in `content.js` marks each company `verified: true` when its profile came from a
public source, named in `source`. Three did:

| Company | Source | What it gave us |
|---|---|---|
| G Developments | nawy.com | Founded 2006 as New Giza Development, renamed 2024 |
| G Hotels | theg-hotels.com | Est. 2019; The G Seashell (2019, 186 rooms), The G Einbay (2024, 216 rooms, 27-hole course by John Sanford and Tim Lobb), The G City View (2027), The G Ras El Hekma (2028) |
| G Communities | gcommunities.eg | Community management across the North Coast and New Cairo, OneCommunity resident app |

**BuildDora, G Investments, G Utilities, G Clubs and G Lifestyle have no public presence we could
find** (searched Sep 2026 — "BuildDora" only returns Dorra, an unrelated contractor founded 1943).
Their pages carry the one-line role the client described plus a "Company profile to follow" panel;
no founding year, headcount or capability list has been invented for them. Fill in `facts`,
`capabilities` and `properties` as the group supplies them, and set `verified: true`.

Two founder names are widely published (Mahmoud El-Gammal and Salah Diab) but are deliberately not
on the site, since the leadership page is still waiting on the client's own list.

The "Works with" row was removed from entity pages, and `worksWith` with it.

## Masterplans and phases
`src/pages/masterplan.jsx` renders one section per project, from two independent sources:
- **Zones** (`MASTERPLANS[id].zones`) — areas of a resort, each pinned to the plan drawing by a
  percentage `at`. Only Playa Ghazala has these.
- **Phases** (`PROJECT_PHASES[id]`) — what is being sold: status, payment terms and a unit table.
  NEWKAIRO, Seashell Ras El Hekma, Playa Ras El Hekma and Playa Ghazala have these, taken from the
  launch modals captured in `scripts/playa-ghazala.json`. Prices are indicative; confirm with Sales.

Markers only appear when the project has a real plan drawing (`PROJECT_MEDIA[id].masterplan`), so
nothing is ever pinned to the generated schematic, where a position would mean nothing. A project
with phases but no drawing shows the phase browser on its own; one with a drawing but no zones or
phases shows just the plan. Clicking any plan photo opens the zoom-and-drag viewer, and the same
viewer backs the Masterplan tab (`PlanLightbox`).

| Project | Plan photo | Source |
|---|---|---|
| Playa Ghazala | ✓ with zone markers | sales site |
| Seashell Ras El Hekma | ✓ with phase markers | sales site, "Master Plan" section |
| IVY New Zayed | ✓ | realestate.eg |
| City View | ✓ **carries an elbayt.com watermark** | Property Finder |
| Ein Bay | ✓ (only 506x269) | realestate.eg |
| NEWKAIRO, Playa Ras El Hekma | phases only | no plan found; Playa's "Master Plan" image is a title card |
| Seashell, Hacienda Red, Ein Resort | none | no plan found |

The Seashell Ras El Hekma phase markers are placed on what the drawing shows (lagoons, beachfront
villa rows); confirm the exact plots with Sales.

## Placeholder photography
`scripts/download_project_images.py` fetches the renders and masterplans listed in
`scripts/projects-images-masterplans.json` into `src/assets/media/projects/<id>/`, and
`PLACEHOLDER_MEDIA` in `media.js` wires them up. **All of these are listing-site or brochure
copies — replace them with originals from the marketing team before launch.**

| Community | What it has | Notes |
|---|---|---|
| IVY New Zayed | aerial, sports club, townhouses, masterplan | aerial is only 690x388, soft as a page hero |
| City View | lagoon, apartments, pool | no masterplan (see below) |
| Ein Bay | aerial, golf, lakeside, masterplan | masterplan is only 505x263 |
| Hacienda Red | lagoon villas, sea view, compound | attribution still unconfirmed, see below |
| Ein Resort | hotel frontage, pool, beach, entrance, The Fore restaurant | official theg-hotels.com photos; taken to be The G Einbay |

Deliberately left out:
- **IVY's `masterplan-1`** was a location map, not a masterplan, and it labels New Giza.
- **`hacienda-red/gate-branded-unused.webp`** shows the compound's entrance sign with the Hacienda
  logo on it. The other three Hacienda Red photos are in use; this one is held back so a rival
  developer's branding does not appear on the site.
- Exact duplicates (Ein Bay 01/04, City View 03/04) were deleted, keeping the larger copy.

A community with no photography at all falls back to the brand plate art, captioned
"Photography to follow" (`t.portfolio.photosSoon`) on its card and project page, so the fallback
reads as deliberate rather than as a broken image. No community is currently in that state.

**Ein Resort** is treated as **The G Einbay**, the G Hotels golf and beach resort at Ein Bay (the
client pointed to it via an "ein bay hotel" search). Its photos come from the hotel's own media
library at theg-hotels.com, so they are originals rather than listing-site copies. Confirm that
Ein Resort and The G Einbay are the same thing.

A project's Masterplan tab shows `PROJECT_MEDIA[id].masterplan` when there is one, and falls back
to the generated schematic otherwise.

## Playa Ghazala artwork
Renders come from the G Developments sales site via `scripts/download_images.py`. That page pairs
several images with the wrong caption; the files in `src/assets/media/projects/playa-ghazala/` are
named for what each render actually shows, and `PLAYA_GHAZALA_MEDIA` in `media.js` maps them to the
zones and offerings. The masterplan drawing (`projects/masterplans/`) drives the interactive plan,
and the brochure PDF is served from `public/brochures/playa-ghazala.pdf`.

## Before launch
- Font licence: confirm web-embedding rights for Helvetica, Helvetica Now Text and DIN Next Arabic.
- Fix NewKairo's amenity rows in the CMS (pool/gym icons are swapped in the database).
- Confirm indicative prices and the WhatsApp number in `content.js`.
- Confirm the project coordinates in `MAP_POINTS` (`content.js`); they are approximate.
- **City View, Hacienda Red, Ein Bay and Ein Resort** came from the sales-site navigation. They now
  carry researched locations and (except the last two) placeholder photography, but still no unit mix
  or pricing, so each page says "details to be announced". Confirm with the client that all four belong
  in the portfolio, then add real copy, originals and exact coordinates. New Giza stays excluded.
- **Hacienda Red is attributed to Palm Hills by every source** in `scripts/projects-images-masterplans.json`.
  It is listed as a G Developments community here because it appears in the sales-site menu, and now
  carries three of its four photos. Confirm the project is G Developments' or remove it.
- **Ein Resort** has no public listing, photography or masterplan under that name. The only trace
  found is a company history line placing its construction in 1992, before Ein Bay in 1998, which
  suggests it is a real early Sokhna project rather than a mistake in the menu. Ask marketing for
  photography, or confirm whether it is a zone inside Ein Bay rather than a separate community.
- Playa Ghazala's figures (1.5 km private beach, KM 141, from EGP 21.4M, ready to move) come from the
  sales site, not the CMS — confirm before launch.
- Confirm the G Group company descriptions (`GROUP_COMPANIES` in `content.js`) and the contact form's inquiry types.
- Leadership (`LEADERSHIP` in `content-pages.js`): add names, B&W 4:5 portraits, biographies and the
  chairman's message. Until then the page shows "Name to be announced" and a G monogram.
- Confirm the 1955 and 1970s milestones in `STORY` and the About figures (e.g. 4.8 km of beachfront).
- Replace the sample unit table and payment plan for Seashell Ras El Hekma (`UNIT_TABLES`,
  `PAYMENT_PLANS`, marked `sample: true`) with the live Salesforce feed; confirm build statuses (`PROJECT_STATUS`).

## Credits
Liquid Form, Ribbon Field and Condensation are adapted from ThreeUI by Meng To
(https://github.com/MengTo/threeui), MIT License, © 2026 Meng To.
