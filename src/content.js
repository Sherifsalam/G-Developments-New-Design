/**
 * G Developments — homepage content (EN / AR).
 *
 * Sources (Sep 2026): G Developments brand guidelines (client), thegdevelopments.com
 * community pages, and G Developments sales-partner pages (pc-thegdevelopments.com).
 * Starting prices are indicative and change often — confirm with Sales before launch,
 * or feed this file from the CMS / Supabase `projects` table.
 */

export const CONTACT = {
  hotline: '16738',
  email: 'info@thegdevelopments.com',
  // Head office as stored in the backend `offices` table (id 1, headquarters)
  address: {
    en: 'HQ · KM 22, Cairo–Alexandria Desert Road, Giza, Egypt',
    ar: 'المقر الرئيسي · الكيلو 22 طريق القاهرة–الإسكندرية الصحراوي، الجيزة، مصر',
  },
  // Leave empty until Sales confirms the WhatsApp Business number (international format, digits only).
  whatsapp: '',
  offices: [
    { id: 'hq', en: 'HQ · KM 22, Cairo–Alexandria Desert Road', ar: 'المقر الرئيسي · الكيلو 22 طريق القاهرة–الإسكندرية' },
    { id: 'zamalek', en: 'Zamalek office', ar: 'مكتب الزمالك' },
    { id: 'park-street', en: 'Park Street, New Cairo', ar: 'بارك ستريت – القاهرة الجديدة' },
  ],
  social: [
    { id: 'instagram', label: 'Instagram', href: '#' },
    { id: 'facebook', label: 'Facebook', href: '#' },
    { id: 'linkedin', label: 'LinkedIn', href: '#' },
    { id: 'youtube', label: 'YouTube', href: '#' },
  ],
};

export const G_GROUP = [
  'G Developments', 'G Communities', 'G Lifestyle', 'G Hotels',
  'G Clubs', 'G Utilities', 'G Investments', 'BuildDora',
];

/** area → used by the hero search. cats → portfolio tabs. price → EGP millions (null = on request). */
export const PROJECTS = [
  {
    id: 'new-kairo',
    slug: 'newkairo',
    name: 'NEWKAIRO',
    area: 'new-cairo',
    region: 'east',
    cats: ['urban', 'commercial'],
    types: ['apartment', 'townhouse', 'twin', 'villa'],
    price: 18.3,
    marker: 'Golf + Park',
    plate: 'arches',
    loc: { en: 'East Cairo · New Heliopolis', ar: 'شرق القاهرة · هليوبوليس الجديدة' },
    blurb: {
      en: 'Two gated communities, NEWKAIRO Golf and NEWKAIRO Park, joined by the Grand Boulevard. Homes are delivered fully finished.',
      ar: 'مجتمعان مسوّران، نيو كايرو جولف ونيو كايرو بارك، يربط بينهما الجراند بوليفارد. الوحدات تُسلَّم كاملة التشطيب.',
    },
    highlights: [
      { en: '18-hole course & clubhouse', ar: 'ملعب جولف 18 حفرة ونادٍ' },
      { en: 'The Grand Boulevard', ar: 'الجراند بوليفارد' },
      { en: 'Downtown district', ar: 'منطقة داون تاون' },
      { en: 'Uppingham New Cairo (2028)', ar: 'مدرسة أبينجهام (2028)' },
    ],
    // Concept and facilities from thegdevelopments.com/en/community/newkairo
    concept: {
      en: 'A fully integrated upscale destination that combines a vibrant downtown, hospitality, schools, recreation and homes within one community. An electric bus system connects it to the surrounding areas, and schools, sports clubs, parks and health services sit at residents’ doorsteps.',
      ar: 'وجهة راقية متكاملة تجمع داون تاون نابضاً بالحياة، وخيارات فندقية، ومؤسسات تعليمية، ومرافق ترفيهية، ووحدات سكنية داخل مجتمع واحد. تربطها شبكة حافلات كهربائية بالمناطق المحيطة، وتقع المدارس والأندية الرياضية والحدائق والخدمات الصحية على بعد خطوات من السكان.',
    },
    facilities: [
      { en: 'Sports club', ar: 'نادٍ رياضي' }, { en: 'Hotels', ar: 'فنادق' },
      { en: 'International schools', ar: 'مدارس دولية' }, { en: 'Golf courses', ar: 'ملاعب جولف' },
      { en: 'Clubhouse', ar: 'نادٍ اجتماعي' }, { en: 'Medical hub', ar: 'مركز طبي' },
      { en: 'Downtown', ar: 'داون تاون' }, { en: 'Working spaces', ar: 'مساحات عمل' },
    ],
  },
  {
    id: 'seashell',
    slug: 'seashell',
    name: 'Seashell',
    area: 'north-coast',
    region: 'north',
    cats: ['coastal'],
    types: ['chalet', 'villa'],
    price: null,
    soldOut: true,
    marker: 'KM 134',
    plate: 'horizon',
    loc: { en: 'North Coast · KM 134, Sidi Abdel Rahman', ar: 'الساحل الشمالي · الكيلو 134، سيدي عبد الرحمن' },
    blurb: {
      en: 'Seashell covers 1 million m² with 1 km of Mediterranean beach: beachfront villas, lofts, penthouses and chalets.',
      ar: 'تمتد سي شل على مليون متر مربع مع شاطئ متوسطي بطول كيلومتر: فيلات على البحر ولوفت وبنتهاوس وشاليهات.',
    },
    highlights: [
      { en: '1 km Mediterranean beach', ar: 'شاطئ متوسطي بطول 1 كم' },
      { en: '1 million m² masterplan', ar: 'مخطط مليون متر مربع' },
      { en: 'Beachfront gym', ar: 'صالة رياضية على الشاطئ' },
      { en: 'Upscale dining', ar: 'مطاعم راقية' },
    ],
  },
  {
    id: 'playa-ghazala',
    slug: 'playa',
    name: 'Playa Ghazala',
    area: 'north-coast',
    region: 'north',
    cats: ['coastal'],
    types: ['chalet', 'townhouse', 'twin', 'villa'],
    price: 21.4,
    marker: 'KM 141',
    plate: 'stair',
    loc: { en: 'North Coast · KM 141, Ghazala Bay', ar: 'الساحل الشمالي · الكيلو 141، خليج غزالة' },
    blurb: {
      en: 'A ready-to-move beachfront resort on Ghazala Bay, set along 1.5 km of private Mediterranean shoreline.',
      ar: 'منتجع جاهز للسكن على شاطئ خليج غزالة، يمتد على 1.5 كم من الشاطئ الخاص على المتوسط.',
    },
    highlights: [
      { en: '1.5 km private beach', ar: 'شاطئ خاص 1.5 كم' },
      { en: 'Ready to move', ar: 'جاهز للاستلام' },
      { en: 'Cable park', ar: 'كيبل بارك' },
      { en: 'Pet friendly', ar: 'يرحب بالحيوانات الأليفة' },
    ],
    concept: {
      en: 'A high-end coastal resort on the longest private beach on Egypt’s North Coast. The masterplan runs three zones together — a green central spine from the beach to downtown, a promenade for cycling, jogging and the sports club, and a cable park beside the retail and dining district.',
      ar: 'منتجع ساحلي راقٍ على أطول شاطئ خاص في الساحل الشمالي. يجمع المخطط ثلاث مناطق: محور أخضر يربط الشاطئ بالداون تاون، وبرومناد للدراجات والجري والنادي الرياضي، وكيبل بارك بجوار منطقة المحلات والمطاعم.',
    },
    facilities: [
      { en: 'Private beach', ar: 'شاطئ خاص' }, { en: 'Sports club', ar: 'نادٍ رياضي' },
      { en: 'Cable park', ar: 'كيبل بارك' }, { en: 'Dining by the sea', ar: 'مطاعم على البحر' },
      { en: 'Shops & boutiques', ar: 'محلات وبوتيكات' }, { en: 'Pilates & yoga', ar: 'بيلاتس ويوجا' },
      { en: 'Cycling & jogging tracks', ar: 'مسارات دراجات وجري' }, { en: 'Pet friendly', ar: 'يرحب بالحيوانات الأليفة' },
    ],
  },
  {
    id: 'seashell-rh',
    slug: 'seashell-ras-el-hekma',
    name: 'Seashell Ras El Hekma',
    area: 'north-coast',
    region: 'north',
    cats: ['coastal'],
    types: ['chalet', 'townhouse', 'villa'],
    price: 11,
    marker: 'KM 194',
    plate: 'water',
    loc: { en: 'North Coast · KM 194, Ras El Hekma', ar: 'الساحل الشمالي · الكيلو 194، رأس الحكمة' },
    blurb: {
      en: 'Beachfront chalets, townhouses and standalone villas, with the new Lagoon Views phase set directly on crystal lagoons.',
      ar: 'شاليهات وتاون هاوس وفيلات مستقلة على البحر، مع مرحلة لاجون فيوز الجديدة مباشرة على البحيرات الكريستالية.',
    },
    highlights: [
      { en: '1.6 km private beach', ar: 'شاطئ خاص 1.6 كم' },
      { en: 'Lagoon Views phase', ar: 'مرحلة لاجون فيوز' },
      { en: 'Branded five-star hotel', ar: 'فندق خمس نجوم' },
      { en: 'Commercial hub', ar: 'مركز تجاري' },
      { en: 'Sports club', ar: 'نادٍ رياضي' },
    ],
  },
  {
    id: 'playa-rh',
    slug: 'playa-ras-el-hekma',
    name: 'Playa Ras El Hekma',
    area: 'north-coast',
    region: 'north',
    cats: ['coastal'],
    types: ['chalet'],
    price: null,
    marker: 'Phase 3',
    plate: 'horizon',
    loc: { en: 'North Coast · Ras El Hekma', ar: 'الساحل الشمالي · رأس الحكمة' },
    blurb: {
      en: 'Phase 3 introduces the G Serviced Chalets: beach homes run day to day by G Hotel.',
      ar: 'تقدم المرحلة الثالثة شاليهات G المخدومة: منازل على البحر تديرها G Hotel يومياً.',
    },
    highlights: [
      { en: 'G Serviced Chalets', ar: 'شاليهات G المخدومة' },
      { en: 'Serviced by G Hotel', ar: 'خدمة فندقية من G Hotel' },
      { en: 'Mediterranean frontage', ar: 'واجهة على المتوسط' },
    ],
  },
  {
    id: 'ivy',
    slug: 'ivy-new-zayed',
    name: 'IVY New Zayed',
    area: 'new-zayed',
    region: 'west',
    cats: ['urban'],
    types: ['apartment', 'townhouse'],
    price: 14.7,
    marker: 'KM 22',
    plate: 'fins',
    loc: { en: 'West Cairo · New Zayed', ar: 'غرب القاهرة · نيو زايد' },
    blurb: {
      en: 'A boutique gated community with fully finished apartments and townhouses set around private gardens and terraces.',
      ar: 'مجتمع مسوّر بطابع بوتيك، بشقق وتاون هاوس كاملة التشطيب حول حدائق وتراسات خاصة.',
    },
    highlights: [
      { en: 'Fully finished homes', ar: 'وحدات كاملة التشطيب' },
      { en: 'Private gardens', ar: 'حدائق خاصة' },
      { en: 'Community downtown', ar: 'داون تاون المجتمع' },
    ],
  },

  {
    id: 'city-view',
    slug: 'city-view',
    name: 'City View',
    area: 'october',
    region: 'west',
    cats: ['urban'],
    types: ['apartment', 'villa'],
    price: null,
    marker: 'West Cairo',
    plate: 'fins',
    loc: { en: 'West Cairo · 6th of October', ar: 'غرب القاهرة · السادس من أكتوبر' },
    blurb: {
      en: 'A West Cairo community on the Cairo–Alexandria Desert Road. Masterplan, unit mix and pricing are being finalised.',
      ar: 'مجتمع في غرب القاهرة على طريق القاهرة–الإسكندرية الصحراوي. يجري استكمال المخطط والوحدات والأسعار.',
    },
    highlights: [
      { en: 'West Cairo location', ar: 'موقع في غرب القاهرة' },
      { en: 'Details to be announced', ar: 'التفاصيل قريباً' },
    ],
  },
  {
    id: 'hacienda-red',
    slug: 'hacienda-red',
    name: 'Hacienda Red',
    area: 'north-coast',
    region: 'north',
    cats: ['coastal'],
    types: ['chalet', 'villa'],
    price: null,
    marker: 'KM 139',
    plate: 'horizon',
    upcoming: true,
    loc: { en: 'North Coast · KM 139, Sidi Abdel Rahman', ar: 'الساحل الشمالي · الكيلو 139، سيدي عبد الرحمن' },
    blurb: {
      en: 'A North Coast beachfront destination. Masterplan, unit mix and pricing are being finalised.',
      ar: 'وجهة على شاطئ الساحل الشمالي. يجري استكمال المخطط والوحدات والأسعار.',
    },
    highlights: [
      { en: 'Mediterranean beachfront', ar: 'واجهة على المتوسط' },
      { en: 'Details to be announced', ar: 'التفاصيل قريباً' },
    ],
  },
  {
    id: 'ein-bay',
    slug: 'ein-bay',
    name: 'Ein Bay',
    area: 'ain-sokhna',
    region: 'sokhna',
    cats: ['coastal'],
    types: ['chalet', 'villa'],
    price: null,
    marker: 'KM 34',
    plate: 'water',
    loc: { en: 'Ain Sokhna · KM 34, Suez Road', ar: 'العين السخنة · الكيلو 34، طريق السويس' },
    blurb: {
      en: 'A Red Sea retreat at Ain Sokhna with its own golf course and lagoons, within easy reach of Cairo. Unit mix and pricing are being finalised.',
      ar: 'منتجع على البحر الأحمر في العين السخنة بملعب جولف وبحيرات، على مقربة من القاهرة. يجري استكمال الوحدات والأسعار.',
    },
    highlights: [
      { en: 'Red Sea frontage', ar: 'واجهة على البحر الأحمر' },
      { en: 'Golf course', ar: 'ملعب جولف' },
      { en: 'Close to Cairo', ar: 'قريب من القاهرة' },
    ],
  },
  {
    id: 'ein-resort',
    slug: 'ein-resort',
    name: 'Ein Resort',
    area: 'ain-sokhna',
    region: 'sokhna',
    cats: ['coastal'],
    types: ['chalet'],
    price: null,
    marker: 'The G Einbay',
    plate: 'curve',
    loc: { en: 'Ain Sokhna · Zafarana Road', ar: 'العين السخنة · طريق الزعفرانة' },
    blurb: {
      en: 'The G Einbay: a golf and beach resort on the Red Sea, run by G Hotels, with 216 rooms, a private beach and a 27-hole championship course.',
      ar: 'ذا جي عين باي: منتجع جولف وشاطئ على البحر الأحمر تديره G Hotels، بـ 216 غرفة وشاطئ خاص وملعب بطولات 27 حفرة.',
    },
    highlights: [
      { en: '27-hole championship course', ar: 'ملعب بطولات 27 حفرة' },
      { en: 'Private beach', ar: 'شاطئ خاص' },
      { en: '216 rooms and suites', ar: '216 غرفة وجناح' },
      { en: 'Run by G Hotels', ar: 'تديره G Hotels' },
    ],
  },
];

export const AMENITIES = [
  {
    id: 'golf', icon: 'Flag', plate: 'tiles', image: 'hero-banners/01KJVX31Y1D8X23XZ48NAC87KW.webp',
    title: { en: 'Championship golf', ar: 'جولف بطولي' },
    where: 'NEWKAIRO',
    text: {
      en: 'An 18-hole course at NEWKAIRO Golf, with its own clubhouse.',
      ar: 'ملعب 18 حفرة في نيو كايرو جولف مع نادٍ خاص.',
    },
  },
  {
    id: 'lagoons', icon: 'Waves', plate: 'water', image: 'projects/gallery/01KK66HQFZG6NYDW3W6WZX1XEB.webp',
    title: { en: 'Crystal lagoons', ar: 'بحيرات كريستالية' },
    where: 'Seashell Ras El Hekma',
    text: {
      en: 'Lagoon Views puts chalets and villas directly on the water.',
      ar: 'لاجون فيوز تضع الشاليهات والفيلات مباشرة على الماء.',
    },
  },
  {
    id: 'beaches', icon: 'Sun', plate: 'horizon', image: 'projects/gallery/01KJVZ3EH85BHQFXDAZ4Z4FEBF.webp',
    title: { en: 'Private beaches', ar: 'شواطئ خاصة' },
    where: 'North Coast',
    text: {
      en: '1.6 km of private beach at Seashell Ras El Hekma.',
      ar: 'شاطئ خاص بطول 1.6 كم في سي شل رأس الحكمة.',
    },
  },
  {
    id: 'dining', icon: 'UtensilsCrossed', plate: 'stair', image: 'projects/gallery/01KJVWVDXX2Y1GT5XH11KWWB33.webp',
    title: { en: 'Dining & retail', ar: 'مطاعم وتسوق' },
    where: 'NEWKAIRO · IVY',
    text: {
      en: 'A downtown district at NEWKAIRO and a community downtown at IVY New Zayed.',
      ar: 'منطقة داون تاون في نيو كايرو، وداون تاون المجتمع في آيفي نيو زايد.',
    },
  },
  {
    id: 'education', icon: 'GraduationCap', plate: 'arches', image: 'projects/new-kairo/uppingham-school.jpg',
    title: { en: 'Education', ar: 'التعليم' },
    where: 'NEWKAIRO',
    text: {
      en: 'Uppingham New Cairo opens inside NEWKAIRO in 2028.',
      ar: 'تفتتح مدرسة أبينجهام القاهرة الجديدة داخل نيو كايرو عام 2028.',
    },
  },
  {
    id: 'hospitality', icon: 'Hotel', plate: 'curve', image: 'projects/gallery/01KK66Q19A3VMYGR9CN780TYZN.webp',
    title: { en: 'G Hotels', ar: 'G Hotels' },
    where: 'The G Seashell · Playa',
    text: {
      en: 'Hotel service at The G Seashell and inside the serviced chalets at Playa Ras El Hekma.',
      ar: 'خدمة فندقية في ذا جي سي شل وداخل الشاليهات المخدومة في بلايا رأس الحكمة.',
    },
  },
];

/** Latest launches (Emaar / Madinet Masr-style "now selling" strip). Sources: G Developments press pages, Aug 2025. */
export const LAUNCHES = [
  {
    id: 'lagoon-views', project: 'seashell-rh', tag: 'Aug 2025', plate: 'water', image: 'projects/hero/01KK66HQFKJ81X0M8EFBV1FBGX.webp',
    title: { en: 'Lagoon Views', ar: 'لاجون فيوز' },
    text: {
      en: 'Villas and beachfront chalets on crystal lagoons at Seashell Ras El Hekma, from EGP 7.1M.*',
      ar: 'فيلات وشاليهات على البحيرات الكريستالية في سي شل رأس الحكمة، تبدأ من 7.1 مليون ج.م.*',
    },
  },
  {
    id: 'new-kairo-launch', project: 'new-kairo', tag: 'Aug 2025', plate: 'arches', image: 'projects/gallery/01KJVWVDXTJFQT5PKKV295PNVC.webp',
    title: { en: 'NEWKAIRO', ar: 'نيو كايرو' },
    text: {
      en: 'Fully finished townhouses and villas in East Cairo, with 5% down and seven years to pay.',
      ar: 'تاون هاوس وفيلات كاملة التشطيب في شرق القاهرة، بمقدم 5% وتقسيط على سبع سنوات.',
    },
  },
  {
    id: 'playa-phase-3', project: 'playa-rh', tag: 'Phase 3', plate: 'horizon', image: 'projects/gallery/01KK66Q19FJ0AVZ3QP0G8DFPBR.webp',
    title: { en: 'G Serviced Chalets', ar: 'شاليهات G المخدومة' },
    text: {
      en: 'The third phase of Playa Ras El Hekma: beach chalets serviced by G Hotel.',
      ar: 'المرحلة الثالثة من بلايا رأس الحكمة: شاليهات على البحر بخدمة G Hotel.',
    },
  },
  {
    id: 'neon-views', project: 'new-kairo', tag: 'Townhouses', plate: 'fins', image: 'projects/gallery/01KJVWVDXW30FW3WHEDM6BZ9A9.webp',
    title: { en: 'Neon Views', ar: 'نيون فيوز' },
    text: {
      en: 'Villas and townhouses in NEWKAIRO, set around reflection lakes and garden walks.',
      ar: 'فيلات وتاون هاوس في نيو كايرو حول بحيرات عاكسة وممرات حدائق.',
    },
  },
];

/** Sample layouts for the unit inspector. Grid units ≈ 0.5 m. Replace with per-project unit sheets. */
export const PLANS = {
  1: {
    bua: 85, baths: 1, outdoor: 18,
    rooms: [
      { x: 0, y: 0, w: 58, h: 38, n: 'living' }, { x: 58, y: 0, w: 42, h: 18, n: 'kitchen' },
      { x: 58, y: 18, w: 20, h: 20, n: 'bath' }, { x: 78, y: 18, w: 22, h: 20, n: 'entry' },
      { x: 0, y: 38, w: 58, h: 26, n: 'master' }, { x: 58, y: 38, w: 42, h: 26, n: 'terrace', out: true },
    ],
  },
  2: {
    bua: 130, baths: 2, outdoor: 24,
    rooms: [
      { x: 0, y: 0, w: 52, h: 36, n: 'living' }, { x: 52, y: 0, w: 28, h: 18, n: 'kitchen' },
      { x: 80, y: 0, w: 20, h: 18, n: 'bath' }, { x: 52, y: 18, w: 48, h: 18, n: 'entry' },
      { x: 0, y: 36, w: 38, h: 28, n: 'master' }, { x: 38, y: 36, w: 30, h: 28, n: 'bed' },
      { x: 68, y: 36, w: 14, h: 14, n: 'bath' }, { x: 68, y: 50, w: 14, h: 14, n: 'store' },
      { x: 82, y: 36, w: 18, h: 28, n: 'terrace', out: true },
    ],
  },
  3: {
    bua: 185, baths: 3, outdoor: 32,
    rooms: [
      { x: 0, y: 0, w: 44, h: 34, n: 'living' }, { x: 44, y: 0, w: 22, h: 34, n: 'dining' },
      { x: 66, y: 0, w: 20, h: 18, n: 'kitchen' }, { x: 86, y: 0, w: 14, h: 18, n: 'bath' },
      { x: 66, y: 18, w: 34, h: 16, n: 'entry' }, { x: 0, y: 34, w: 34, h: 30, n: 'master' },
      { x: 34, y: 34, w: 12, h: 14, n: 'bath' }, { x: 34, y: 48, w: 12, h: 16, n: 'dress' },
      { x: 46, y: 34, w: 26, h: 30, n: 'bed' }, { x: 72, y: 34, w: 28, h: 30, n: 'bed' },
      { x: 0, y: 64, w: 100, h: 12, n: 'terrace', out: true },
    ],
  },
  4: {
    bua: 260, baths: 4, outdoor: 48,
    rooms: [
      { x: 0, y: 0, w: 40, h: 32, n: 'living' }, { x: 40, y: 0, w: 24, h: 32, n: 'dining' },
      { x: 64, y: 0, w: 20, h: 16, n: 'kitchen' }, { x: 84, y: 0, w: 16, h: 16, n: 'staff' },
      { x: 64, y: 16, w: 36, h: 16, n: 'entry' }, { x: 0, y: 32, w: 30, h: 32, n: 'master' },
      { x: 30, y: 32, w: 12, h: 14, n: 'bath' }, { x: 30, y: 46, w: 12, h: 18, n: 'dress' },
      { x: 42, y: 32, w: 20, h: 32, n: 'bed' }, { x: 62, y: 32, w: 12, h: 14, n: 'bath' },
      { x: 62, y: 46, w: 12, h: 18, n: 'bath' }, { x: 74, y: 32, w: 26, h: 16, n: 'bed' },
      { x: 74, y: 48, w: 26, h: 16, n: 'bed' }, { x: 0, y: 64, w: 100, h: 14, n: 'garden', out: true },
    ],
  },
};

/** "Our Approach": wording from thegdevelopments.com/en/about-us. */
export const APPROACH = [
  {
    id: 'location',
    title: { en: 'Location', ar: 'الموقع' },
    text: {
      en: 'Our approach begins with strategic site selection, focusing on accessibility, growth potential, and vibrant neighborhood dynamics to ensure a thriving community environment.',
      ar: 'يبدأ نهجنا باختيار استراتيجي للموقع، مع التركيز على سهولة الوصول وإمكانات النمو وحيوية المحيط، لضمان بيئة مجتمعية مزدهرة.',
    },
  },
  {
    id: 'design',
    title: { en: 'Design', ar: 'التصميم' },
    text: {
      en: 'We prioritize innovative, functional design that maximizes space and aesthetic appeal, incorporating user-centric details that enhance living experiences.',
      ar: 'نعطي الأولوية لتصميم مبتكر وعملي يستغل المساحة ويعزز الجمال، مع تفاصيل تتمحور حول الساكن وترتقي بتجربة المعيشة.',
    },
  },
  {
    id: 'construction',
    title: { en: 'Construction', ar: 'الإنشاء' },
    text: {
      en: 'Our construction approach emphasizes quality, efficiency, and sustainability, delivering durable spaces that meet both modern standards and client expectations.',
      ar: 'يركز نهجنا في الإنشاء على الجودة والكفاءة والاستدامة، لنسلّم مساحات تدوم وتلبي المعايير الحديثة وتوقعات عملائنا.',
    },
  },
  {
    id: 'service',
    title: { en: 'End-to-End Service', ar: 'خدمة متكاملة' },
    text: {
      en: 'From concept to completion, we offer comprehensive support, ensuring seamless integration of every project phase for a hassle-free experience.',
      ar: 'من الفكرة إلى التسليم، نقدم دعماً شاملاً يضمن تكامل كل مراحل المشروع بسلاسة لتجربة خالية من العناء.',
    },
  },
];

/**
 * G Group companies.
 *
 * `verified: true` means the profile below comes from a public source, named in `source`.
 * The rest carry only the role the client described; they have no public presence we could find
 * (searched Sep 2026), so their pages say the profile is still to be supplied rather than
 * inventing founding years, headcounts or capabilities. See README, "G Group profiles".
 *
 * Optional per company: founded, website, facts, capabilities, properties, projects.
 */
export const GROUP_COMPANIES = [
  {
    id: 'developments', slug: 'g-developments', name: 'G Developments', mark: 'G', sector: 'dev', core: true,
    verified: true, founded: 2006, source: 'nawy.com/developer/3-g-developments',
    kind: { en: 'Real estate development', ar: 'التطوير العقاري' },
    text: {
      en: 'The group’s development arm, building gated communities and coastal destinations across Cairo, the North Coast and the Red Sea.',
      ar: 'ذراع التطوير في المجموعة، تبني مجتمعات مسوّرة ووجهات ساحلية بين القاهرة والساحل الشمالي والبحر الأحمر.',
    },
    facts: [
      { label: { en: 'Founded', ar: 'التأسيس' }, value: { en: '2006', ar: '2006' } },
      { label: { en: 'Previously', ar: 'الاسم السابق' }, value: { en: 'New Giza Development', ar: 'New Giza Development' } },
      { label: { en: 'Regions', ar: 'المناطق' }, value: { en: 'Cairo · North Coast · Red Sea', ar: 'القاهرة · الساحل الشمالي · البحر الأحمر' } },
    ],
    capabilities: [
      { title: { en: 'Masterplanning', ar: 'المخططات العامة' }, text: { en: 'Whole communities planned around their landscape, from a golf valley to 1.5 km of private beach.', ar: 'مجتمعات كاملة مخططة حول طبيعتها، من وادي الجولف إلى 1.5 كم من الشاطئ الخاص.' } },
      { title: { en: 'Residential delivery', ar: 'تسليم الوحدات' }, text: { en: 'Apartments, chalets, townhouses and standalone villas, handed over fully finished.', ar: 'شقق وشاليهات وتاون هاوس وفيلات مستقلة، تُسلّم كاملة التشطيب.' } },
      { title: { en: 'Mixed use', ar: 'الاستخدام المختلط' }, text: { en: 'Downtown districts, offices, schools and medical facilities inside the gate.', ar: 'مناطق داون تاون ومكاتب ومدارس ومرافق طبية داخل البوابة.' } },
    ],
    projects: ['new-kairo', 'seashell-rh', 'playa-rh'],
  },
  {
    id: 'hotels', slug: 'g-hotels', name: 'G Hotels', mark: 'G', sector: 'life',
    verified: true, founded: 2019, website: 'https://theg-hotels.com/', source: 'theg-hotels.com',
    kind: { en: 'Hospitality', ar: 'الضيافة' },
    text: {
      en: 'The group’s hotel management company, running two resorts on the Red Sea and the Mediterranean with two more to open by 2028.',
      ar: 'شركة إدارة الفنادق في المجموعة، تدير منتجعين على البحر الأحمر والمتوسط، واثنين آخرين حتى 2028.',
    },
    facts: [
      { label: { en: 'Established', ar: 'التأسيس' }, value: { en: '2019', ar: '2019' } },
      { label: { en: 'Open', ar: 'تعمل الآن' }, value: { en: '2 hotels · 402 rooms', ar: 'فندقان · 402 غرفة' } },
      { label: { en: 'In progress', ar: 'قيد التطوير' }, value: { en: '2 more by 2028', ar: 'اثنان حتى 2028' } },
    ],
    properties: [
      { name: 'The G Seashell', year: '2019', rooms: 186, where: { en: 'North Coast · KM 134', ar: 'الساحل الشمالي · الكيلو 134' }, note: { en: 'The first G hotel. Beachfront, with the LA7 fitness club and the Sea Resto restaurant.', ar: 'أول فنادق المجموعة، على الشاطئ مع نادي LA7 ومطعم Sea Resto.' } },
      { name: 'The G Einbay', year: '2024', rooms: 216, where: { en: 'Ain Sokhna · Zafarana Road', ar: 'العين السخنة · طريق الزعفرانة' }, note: { en: 'A golf resort on the Red Sea, with a 27-hole championship course by John Sanford and Tim Lobb.', ar: 'منتجع جولف على البحر الأحمر، بملعب بطولات 27 حفرة من تصميم John Sanford و Tim Lobb.' } },
      { name: 'The G City View', year: '2027', where: { en: 'Giza', ar: 'الجيزة' }, note: { en: 'An urban hotel overlooking the Pyramids.', ar: 'فندق حضري يطل على الأهرامات.' } },
      { name: 'The G Ras El Hekma', year: '2028', where: { en: 'North Coast', ar: 'الساحل الشمالي' }, note: { en: 'A coastal resort inside the Ras El Hekma destinations.', ar: 'منتجع ساحلي داخل وجهات رأس الحكمة.' } },
    ],
    capabilities: [
      { title: { en: 'Hotel management', ar: 'إدارة الفنادق' }, text: { en: 'Operating the group’s resorts, and the serviced chalets at Playa Ras El Hekma.', ar: 'تشغيل منتجعات المجموعة، والشاليهات المخدومة في بلايا رأس الحكمة.' } },
      { title: { en: 'Golf and leisure', ar: 'الجولف والترفيه' }, text: { en: 'The 27-hole Einbay course, fitness clubs, kids clubs and resort dining.', ar: 'ملعب عين باي 27 حفرة، وأندية اللياقة والأطفال ومطاعم المنتجعات.' } },
      { title: { en: 'Growth', ar: 'التوسع' }, text: { en: 'Aiming to become a leading hotel management company in the MENA region, with the GCC, North Africa and Southern Europe next.', ar: 'تسعى لتكون من أبرز شركات إدارة الفنادق في المنطقة، ثم الخليج وشمال أفريقيا وجنوب أوروبا.' } },
    ],
    projects: ['seashell', 'playa-rh', 'ein-resort'],
  },
  {
    id: 'communities', slug: 'g-communities', name: 'G Communities', mark: 'G', sector: 'dev',
    verified: true, website: 'https://www.gcommunities.eg/', source: 'gcommunities.eg',
    kind: { en: 'Community management', ar: 'إدارة المجتمعات' },
    text: {
      en: 'Runs the communities after handover — facilities, security and resident services across the North Coast and Cairo.',
      ar: 'تدير المجتمعات بعد التسليم — المرافق والأمن وخدمات السكان في الساحل الشمالي والقاهرة.',
    },
    facts: [
      { label: { en: 'Regions', ar: 'المناطق' }, value: { en: 'North Coast · New Cairo', ar: 'الساحل الشمالي · القاهرة الجديدة' } },
      { label: { en: 'Resident app', ar: 'تطبيق السكان' }, value: { en: 'OneCommunity', ar: 'OneCommunity' } },
    ],
    capabilities: [
      { title: { en: 'Facilities management', ar: 'إدارة المرافق' }, text: { en: 'Landscaping, cleaning, maintenance and the shared spaces residents use every day.', ar: 'تنسيق المواقع والنظافة والصيانة والمساحات المشتركة.' } },
      { title: { en: 'Security', ar: 'الأمن' }, text: { en: 'Gate control and patrols across every community.', ar: 'التحكم في البوابات والدوريات في كل مجتمع.' } },
      { title: { en: 'Resident services', ar: 'خدمات السكان' }, text: { en: 'Requests, payments and community news through the OneCommunity app.', ar: 'الطلبات والمدفوعات وأخبار المجتمع عبر تطبيق OneCommunity.' } },
    ],
    projects: ['seashell', 'playa-ghazala'],
  },
  {
    id: 'builddora', slug: 'builddora', name: 'BuildDora', mark: 'B', sector: 'build',
    kind: { en: 'Construction', ar: 'الإنشاءات' },
    text: { en: 'The group’s construction company, delivering its communities from groundwork to handover.', ar: 'شركة الإنشاءات في المجموعة، تنفّذ مجتمعاتها من الأساسات حتى التسليم.' },
    projects: ['seashell-rh', 'playa-rh', 'new-kairo'],
  },
  {
    id: 'investments', slug: 'g-investments', name: 'G Investments', mark: 'G', sector: 'dev',
    kind: { en: 'Investment', ar: 'الاستثمار' },
    text: { en: 'Land, capital and partnerships behind every new project.', ar: 'الأرض ورأس المال والشراكات وراء كل مشروع جديد.' },
  },
  {
    id: 'utilities', slug: 'g-utilities', name: 'G Utilities', mark: 'G', sector: 'build',
    kind: { en: 'Infrastructure', ar: 'البنية التحتية' },
    text: { en: 'Water, power and infrastructure services for the group’s destinations.', ar: 'خدمات المياه والطاقة والبنية التحتية لوجهات المجموعة.' },
  },
  {
    id: 'clubs', slug: 'g-clubs', name: 'G Clubs', mark: 'G', sector: 'life',
    kind: { en: 'Clubs', ar: 'الأندية' },
    text: { en: 'Beach, sports and social clubs for residents and members.', ar: 'أندية شاطئية ورياضية واجتماعية للسكان والأعضاء.' },
  },
  {
    id: 'lifestyle', slug: 'g-lifestyle', name: 'G Lifestyle', mark: 'G', sector: 'life',
    kind: { en: 'Lifestyle', ar: 'نمط الحياة' },
    text: { en: 'Dining, retail and leisure experiences in the group’s destinations.', ar: 'تجارب المطاعم والتسوق والترفيه في وجهات المجموعة.' },
  },
];

/**
 * Journal (the live site's Media Center). The Seashell Ras El Hekma item mirrors the live
 * media page; the others are the launch notes that used to sit on the homepage.
 */
export const JOURNAL = [
  {
    slug: 'seashell-ras-el-hekma-launch', type: 'news', date: '2025-12-14', project: 'seashell-rh',
    image: 'projects/hero/01KK66HQFKJ81X0M8EFBV1FBGX.webp', plate: 'water',
    title: { en: 'G Developments launches Seashell Ras El Hekma', ar: 'G Developments تطلق سي شل رأس الحكمة' },
    excerpt: {
      en: 'The first fully-integrated coastal resort at the heart of the North Coast’s Ras El Hekma.',
      ar: 'أول منتجع ساحلي متكامل في قلب رأس الحكمة بالساحل الشمالي.',
    },
    body: [
      {
        en: 'Seashell Ras El Hekma sits at KM 194 on the Alexandria–Matrouh Road, with 1.6 km of private beach.',
        ar: 'تقع سي شل رأس الحكمة عند الكيلو 194 على طريق الإسكندرية–مطروح، بشاطئ خاص بطول 1.6 كم.',
      },
      {
        en: 'The resort brings beachfront chalets, townhouses and standalone villas together with a branded five-star hotel, a commercial hub and a sports club.',
        ar: 'يجمع المنتجع شاليهات وتاون هاوس وفيلات مستقلة على البحر، مع فندق خمس نجوم ومركز تجاري ونادٍ رياضي.',
      },
    ],
  },
  {
    slug: 'lagoon-views', type: 'launch', date: '2025-08', project: 'seashell-rh',
    image: 'projects/gallery/01KK66HQFZG6NYDW3W6WZX1XEB.webp', plate: 'water',
    title: { en: 'Lagoon Views at Seashell Ras El Hekma', ar: 'لاجون فيوز في سي شل رأس الحكمة' },
    excerpt: {
      en: 'Villas and beachfront chalets on crystal lagoons, from EGP 7.1M.*',
      ar: 'فيلات وشاليهات على البحيرات الكريستالية، تبدأ من 7.1 مليون ج.م.*',
    },
    body: [
      {
        en: 'Lagoon Views is the newest phase of Seashell Ras El Hekma. It puts villas and beachfront chalets directly on the water, set on crystal lagoons.',
        ar: 'لاجون فيوز هي أحدث مراحل سي شل رأس الحكمة، وتضع الفيلات والشاليهات مباشرة على الماء حول البحيرات الكريستالية.',
      },
      { en: '* Indicative starting price, subject to change.', ar: '* سعر بداية استرشادي وقابل للتغيير.' },
    ],
  },
  {
    slug: 'new-kairo-launch', type: 'launch', date: '2025-08', project: 'new-kairo',
    image: 'projects/gallery/01KJVWVDXTJFQT5PKKV295PNVC.webp', plate: 'arches',
    title: { en: 'NEWKAIRO townhouses and villas', ar: 'تاون هاوس وفيلات نيو كايرو' },
    excerpt: {
      en: 'Fully finished townhouses and villas in East Cairo, with 5% down and seven years to pay.',
      ar: 'تاون هاوس وفيلات كاملة التشطيب في شرق القاهرة، بمقدم 5% وتقسيط على سبع سنوات.',
    },
    body: [
      {
        en: 'NEWKAIRO joins two gated communities, NEWKAIRO Golf and NEWKAIRO Park, along the Grand Boulevard. The new release offers fully finished townhouses and villas.',
        ar: 'تضم نيو كايرو مجتمعين مسوّرين، نيو كايرو جولف ونيو كايرو بارك، على امتداد الجراند بوليفارد. ويقدم الطرح الجديد تاون هاوس وفيلات كاملة التشطيب.',
      },
      { en: 'Payment plans start at 5% down with instalments over seven years.', ar: 'تبدأ خطط السداد بمقدم 5% مع تقسيط على سبع سنوات.' },
    ],
  },
  {
    slug: 'g-serviced-chalets', type: 'launch', date: '2025-08', project: 'playa-rh',
    image: 'projects/gallery/01KK66Q19FJ0AVZ3QP0G8DFPBR.webp', plate: 'horizon',
    title: { en: 'G Serviced Chalets at Playa Ras El Hekma', ar: 'شاليهات G المخدومة في بلايا رأس الحكمة' },
    excerpt: {
      en: 'The third phase of Playa Ras El Hekma: beach chalets serviced by G Hotel.',
      ar: 'المرحلة الثالثة من بلايا رأس الحكمة: شاليهات على البحر بخدمة G Hotel.',
    },
    body: [
      {
        en: 'Phase 3 of Playa Ras El Hekma introduces the G Serviced Chalets: beach homes run day to day by G Hotel.',
        ar: 'تقدم المرحلة الثالثة من بلايا رأس الحكمة شاليهات G المخدومة: منازل على البحر تديرها G Hotel يومياً.',
      },
    ],
  },
  {
    slug: 'neon-views', type: 'launch', date: '2025-08', project: 'new-kairo',
    image: 'projects/gallery/01KJVWVDXX2Y1GT5XH11KWWB33.webp', plate: 'fins',
    title: { en: 'Neon Views at NEWKAIRO', ar: 'نيون فيوز في نيو كايرو' },
    excerpt: {
      en: 'Villas and townhouses set around reflection lakes and garden walks.',
      ar: 'فيلات وتاون هاوس حول بحيرات عاكسة وممرات حدائق.',
    },
    body: [
      {
        en: 'Neon Views brings villas and townhouses to NEWKAIRO, arranged around reflection lakes and garden walks.',
        ar: 'تقدم نيون فيوز فيلات وتاون هاوس في نيو كايرو، موزعة حول بحيرات عاكسة وممرات حدائق.',
      },
    ],
  },
];

/**
 * "Where we build" map (MapJourney.jsx). [lat, lon] in degrees.
 * Project points are approximate, placed from each project's published location
 * (KM markers on the Alexandria–Matrouh road, New Zayed, Al Shorouk): confirm with the client.
 * `label` is the side of the pin its name sits on, so neighbouring names don't collide.
 */
export const MAP_POINTS = {
  'seashell-rh': { at: [31.17, 27.96], label: 'bottom' },
  'playa-rh': { at: [31.215, 27.83], label: 'top' },
  seashell: { at: [30.975, 28.74], label: 'top' },
  'playa-ghazala': { at: [30.955, 28.85], label: 'right' },
  ivy: { at: [30.07, 30.93], label: 'left', gov: 'EG-GZ' },
  'new-kairo': { at: [30.14, 31.64], label: 'right', gov: 'EG-C' },
  'city-view': { at: [29.98, 30.97], label: 'bottom', gov: 'EG-GZ' },
  'hacienda-red': { at: [30.99, 28.66], label: 'left' },
  'ein-bay': { at: [29.62, 32.29], label: 'right' },
  'ein-resort': { at: [29.48, 32.35], label: 'left' },
};

/*
 * `gov` (ISO 3166-2) frames a project's location map on its whole governorate and outlines it.
 * Each was checked by testing the pin against the Natural Earth governorate boundaries.
 */

/** Where the magnifier settles, and the two areas you can zoom into (view = lon/lat box). */
export const MAP_ANCHOR = [26.85, 30.8];
export const MAP_AREAS = [
  {
    id: 'north-coast', label: 'left',
    name: { en: 'North Coast', ar: 'الساحل الشمالي' },
    projects: ['seashell-rh', 'playa-rh', 'hacienda-red', 'seashell', 'playa-ghazala'],
    view: { west: 27.35, east: 29.3, south: 30.62, north: 31.5 },
  },
  {
    id: 'cairo', label: 'right',
    name: { en: 'Greater Cairo', ar: 'القاهرة الكبرى' },
    projects: ['ivy', 'city-view', 'new-kairo'],
    view: { west: 30.6, east: 31.95, south: 29.8, north: 30.38 },
  },
  {
    id: 'sokhna', label: 'right',
    name: { en: 'Ain Sokhna', ar: 'العين السخنة' },
    projects: ['ein-bay', 'ein-resort'],
    view: { west: 31.98, east: 32.62, south: 29.3, north: 29.82 },
  },
];

/** Context labels for the close-up views. */
export const MAP_PLACES = [
  { id: 'cairo', kind: 'city', at: [30.044, 31.236], name: { en: 'Cairo', ar: 'القاهرة' } },
  { id: 'giza', kind: 'city', at: [29.987, 31.2118], name: { en: 'Giza', ar: 'الجيزة' } },
  { id: 'alexandria', kind: 'city', at: [31.2, 29.918], name: { en: 'Alexandria', ar: 'الإسكندرية' } },
  { id: 'alamein', kind: 'city', at: [30.83, 28.955], name: { en: 'El Alamein', ar: 'العلمين' } },
  { id: 'matrouh', kind: 'city', at: [31.354, 27.237], name: { en: 'Marsa Matrouh', ar: 'مرسى مطروح' } },
  { id: 'med', kind: 'water', tone: 'dark', at: [31.4, 28.3], name: { en: 'Mediterranean Sea', ar: 'البحر المتوسط' } },
  { id: 'nile', kind: 'water', tone: 'light', at: [29.9, 31.42], name: { en: 'River Nile', ar: 'نهر النيل' } },
  { id: 'suez', kind: 'city', at: [29.973, 32.526], name: { en: 'Suez', ar: 'السويس' } },
  { id: 'sokhna-town', kind: 'city', at: [29.6, 32.31], name: { en: 'Ain Sokhna', ar: 'العين السخنة' } },
  { id: 'gulf-suez', kind: 'water', tone: 'dark', at: [29.35, 32.62], name: { en: 'Gulf of Suez', ar: 'خليج السويس' } },
];

/**
 * What you read through the magnifier (lens view only). `side` is where a city's name sits;
 * `phone: true` items are the only ones shown on small screens, where the lens is smaller.
 * Label kinds: `country` (large, spaced), `region` (italic), `water` (italic, on the sea).
 */
export const MAP_LENS = {
  cities: [
    { id: 'siwa', at: [29.2, 25.52], side: 'right', name: { en: 'Siwa', ar: 'سيوة' } },
    { id: 'asyut', at: [27.18, 31.18], side: 'right', name: { en: 'Asyut', ar: 'أسيوط' } },
    { id: 'luxor', at: [25.69, 32.64], side: 'left', phone: true, name: { en: 'Luxor', ar: 'الأقصر' } },
    { id: 'aswan', at: [24.09, 32.9], side: 'left', phone: true, name: { en: 'Aswan', ar: 'أسوان' } },
    { id: 'hurghada', at: [27.26, 33.81], side: 'right', name: { en: 'Hurghada', ar: 'الغردقة' } },
    { id: 'sharm', at: [27.91, 34.33], side: 'left', phone: true, name: { en: 'Sharm El Sheikh', ar: 'شرم الشيخ' } },
    { id: 'abu-simbel', at: [22.34, 31.63], side: 'left', name: { en: 'Abu Simbel', ar: 'أبو سمبل' } },
  ],
  labels: [
    { id: 'egypt', kind: 'country', at: [25.6, 28.2], phone: true, name: { en: 'Egypt', ar: 'مصر' } },
    { id: 'western', kind: 'region', at: [27.4, 27.9], name: { en: 'Western Desert', ar: 'الصحراء الغربية' } },
    { id: 'eastern', kind: 'region', at: [25.6, 33.45], name: { en: 'Eastern Desert', ar: 'الصحراء الشرقية' } },
    { id: 'sinai', kind: 'region', at: [29.45, 33.75], phone: true, name: { en: 'Sinai', ar: 'سيناء' } },
    { id: 'qattara', kind: 'region', at: [29.75, 27.1], name: { en: 'Qattara Depression', ar: 'منخفض القطارة' } },
    { id: 'delta', kind: 'region', at: [30.75, 30.95], name: { en: 'Nile Delta', ar: 'دلتا النيل' } },
    { id: 'nasser', kind: 'region', at: [22.95, 31.75], name: { en: 'Lake Nasser', ar: 'بحيرة ناصر' } },
    { id: 'tropic', kind: 'region', at: [23.62, 27.4], name: { en: 'Tropic of Cancer', ar: 'مدار السرطان' } },
    { id: 'med', kind: 'water', at: [32.05, 31.0], phone: true, name: { en: 'Mediterranean Sea', ar: 'البحر المتوسط' } },
    { id: 'red', kind: 'water', at: [26.65, 35.0], phone: true, name: { en: 'Red Sea', ar: 'البحر الأحمر' } },
    { id: 'libya', kind: 'region', outside: true, at: [27.5, 23.7], name: { en: 'Libya', ar: 'ليبيا' } },
    { id: 'sudan', kind: 'region', outside: true, at: [21.3, 30.5], name: { en: 'Sudan', ar: 'السودان' } },
    { id: 'saudi', kind: 'region', outside: true, at: [26.9, 37.6], name: { en: 'Saudi Arabia', ar: 'السعودية' } },
  ],
};

/** The Suez Canal, the fertile Nile Delta and the Tropic of Cancer, simplified (illustrative). */
export const MAP_SUEZ = [[31.26, 32.31], [30.95, 32.31], [30.6, 32.28], [30.42, 32.33], [30.25, 32.46], [29.97, 32.55]];
export const MAP_DELTA = [
  [30.12, 31.2], [30.55, 30.75], [30.9, 30.25], [31.1, 29.98], [31.35, 30.3], [31.52, 30.8],
  [31.58, 31.3], [31.5, 31.8], [31.3, 32.2], [30.85, 31.95], [30.45, 31.5],
];
export const MAP_TROPIC = 23.44;

/** The Nile and its two Delta branches, simplified (illustrative, not survey data). */
export const MAP_NILE = [
  [[22.0, 31.4], [22.6, 32.15], [23.3, 32.7], [23.97, 32.88], [24.09, 32.9], [24.47, 32.95], [24.98, 32.88], [25.29, 32.55],
    [25.7, 32.64], [26.16, 32.73], [26.05, 32.25], [26.34, 31.89], [26.56, 31.7], [27.18, 31.18], [27.7, 30.85], [28.1, 30.75],
    [28.6, 30.87], [29.07, 31.1], [29.5, 31.22], [29.85, 31.3], [30.05, 31.23], [30.19, 31.13]],
  [[30.19, 31.13], [30.36, 30.98], [30.6, 30.93], [30.82, 30.82], [31.05, 30.55], [31.4, 30.42], [31.46, 30.36]],
  [[30.19, 31.13], [30.47, 31.18], [30.71, 31.24], [31.04, 31.38], [31.33, 31.72], [31.42, 31.81], [31.52, 31.84]],
];

export const COPY = {
  en: {
    intro: { skip: 'Skip intro' },
    registerInterest: 'Register interest',
    scroll: 'Scroll',
    drag: 'Drag',
    prev: 'Previous destination',
    next: 'Next destination',
    menuLabel: { open: 'Menu', close: 'Close', explore: 'Destinations', company: 'Company', contact: 'Talk to sales' },
    launches: { eyebrow: 'Latest launches', title: 'Now selling.', subtitle: 'The newest phases across the portfolio.', register: 'Register interest', note: '* Indicative starting price, subject to change.' },
    search2: { eyebrow: 'Find your home', title: 'Tell us what you are looking for.' },
    nav: { home: 'Home', residences: 'Residences', about: 'About us', group: 'G Group', journal: 'Journal', contact: 'Contact', sustainability: 'Sustainability' },
    map: {
      eyebrow: 'Where we build', title: 'One map,', subtitle: (n) => `${n} destinations.`,
      hintUnfold: 'Keep scrolling to unfold the map', hintLens: 'Zooming in on Egypt…',
      hintDrag: 'Drag the magnifier, or keep scrolling to open it.',
      hintOpen: 'Opening the full view of Egypt…',
      hintReady: 'Pick a destination to zoom in.',
      choose: 'Choose a destination', back: 'Back to the map', projects: (n) => `${n} ${n === 1 ? 'destination' : 'destinations'}`,
      discover: 'Discover', inquire: 'Inquire', approx: 'Locations are approximate.',
    },
    pages: {
      residences: {
        title: 'Residences', subtitle: 'Communities across Cairo, the North Coast and the Red Sea.',
        text: 'Our developments span Cairo, the North Coast and the Red Sea, blending timeless design with comfortable living spaces for every lifestyle.',
        location: 'Location', type: 'Unit type', all: 'All', clear: 'Clear filters',
        count: (n) => `${n} ${n === 1 ? 'community' : 'communities'}`,
        none: 'No community matches these filters.',
      },
      project: {
        concept: 'Project concept', highlights: 'Highlights', facilities: 'Amenities & facilities', explore: 'Explore',
        unitTypes: 'Residential types', startingFrom: 'Starting price',
        brochure: 'Download brochure', inquire: 'Inquire now', more: 'Discover more projects', all: 'All communities',
      },
      about: {
        title: 'Our story', subtitle: 'Creating experiential living spaces and communities.',
        text: 'With a focus on creating exceptional living spaces that cater to modern lifestyles, the company has established a strong footprint in the Egyptian real estate market.',
        approach: 'Our approach', approachTitle: 'Four steps,', approachSubtitle: 'one standard.',
      },
      group: {
        title: 'G Group', subtitle: 'One group, eight companies.',
        text: 'G Developments is part of G Group, whose companies cover every stage of community life: from building and utilities to hospitality, clubs and investment.',
      },
      journal: {
        title: 'Journal', subtitle: 'News and launches.',
        text: 'Launches, project news and updates from G Developments.',
        types: { all: 'All', news: 'News', launch: 'Launches' },
        latest: 'Latest first', oldest: 'Oldest first', read: 'Read more', back: 'Back to Journal',
        related: 'View the community',
      },
      contact: {
        title: 'Contact us', subtitle: 'Send an inquiry.',
        text: 'We’d love to hear from you. Fill in this form and we’ll get in touch with you as soon as possible.',
        inquiry: 'Inquiry type', choose: 'Select inquiry type',
        inquiries: { sales: 'Sales', service: 'Customer service', brochure: 'Brochure request', careers: 'Careers', other: 'Other' },
        name: 'Full name', email: 'Email', phone: 'Mobile number', message: 'Message', send: 'Send message',
        errType: 'Choose an inquiry type.', errEmail: 'Enter a valid email address.',
        done: 'Thank you. Your message is with our team and we will reply soon.', another: 'Send another message',
        details: 'Contact details', offices: 'Offices', directions: 'Get directions',
      },
      notFound: { title: 'Page not found.', text: 'The page you are looking for does not exist.', home: 'Back to home' },
    },
    regions: { west: 'West Cairo', east: 'East Cairo', north: 'North Coast', sokhna: 'Ain Sokhna' },
    hotline: 'Hotline',
    bookTour: 'Book a VIP tour',
    menu: 'Menu',
    close: 'Close',
    heroEyebrow: 'Est. 2006 · Formerly New Giza Development',
    heroTitle: 'Redefining architectural legacy and coastal prestige across Egypt.',
    heroSub: 'A well-curated variety of distinguished projects, from NEWKAIRO to the beaches of Ras El Hekma.',
    explore: 'Explore destinations',
    search: {
      location: 'Location', type: 'Property type', budget: 'Budget', any: 'Any', submit: 'Find a home',
      locations: { 'new-zayed': 'New Zayed', 'new-cairo': 'New Cairo', 'north-coast': 'North Coast', 'ain-sokhna': 'Ain Sokhna', october: '6th of October' },
      budgets: { lt12: 'Under EGP 12M', '12-16': 'EGP 12M – 16M', gt16: 'EGP 16M and above' },
    },
    types: { villa: 'Villas', townhouse: 'Townhouses', twin: 'Twin houses', apartment: 'Apartments', chalet: 'Chalets' },
    stats: [
      { value: '2006', label: 'Founded as New Giza Development' },
      { value: '1M m²', label: 'Seashell masterplan on the Mediterranean' },
      { value: '10', label: 'Destinations across Cairo and the North Coast' },
      { value: 'KM 194', label: 'Seashell Ras El Hekma, Alexandria–Matrouh Road' },
    ],
    portfolio: {
      eyebrow: 'Portfolio', title: (n) => `${n} destinations.`, subtitle: 'One standard of delivery.',
      tabs: { all: 'All projects', coastal: 'Coastal', urban: 'Urban', commercial: 'Commercial' },
      tabHints: { coastal: 'Seashell & Playa', urban: 'NEWKAIRO & IVY', commercial: 'Offices & retail' },
      photosSoon: 'Photography to follow',
      view: 'Discover', from: 'From', onRequest: 'Price on request', soldOut: 'Sold out', million: 'M',
      note: '* Indicative starting prices in EGP, subject to change.',
      results: (n) => `${n} ${n === 1 ? 'destination matches' : 'destinations match'} your search`,
      noResults: 'No destination matches every filter. Try a wider budget or another property type.',
      clear: 'Clear search',
    },
    amenities: { eyebrow: 'Lifestyle', title: 'Everything a community needs,', subtitle: 'inside the gate.' },
    cta: { title: 'See it in person.', text: 'Private tours of every destination, arranged by the sales concierge.', call: 'Call' },
    modal: {
      gallery: 'Gallery', amenitiesTab: 'Amenities', masterplan: 'Masterplan', units: 'Units', illustrative: 'Illustrative masterplan · not to scale', of: 'of', prevImg: 'Previous image', nextImg: 'Next image', noGallery: 'Photography for this destination is being prepared.',
      bedrooms: 'Bedrooms', plan: 'Floor plan', exterior: 'Exterior', specs: 'Specifications',
      sample: 'Sample layout. Final areas come from the unit sheet for each phase.',
      bua: 'Built-up area', baths: 'Bathrooms', outdoor: 'Terrace / garden', availableAs: 'Available as',
      brochure: 'Request brochure', enquire: 'Enquire about this unit', sqm: 'm²',
      rooms: { living: 'Living', dining: 'Dining', kitchen: 'Kitchen', bath: 'Bath', entry: 'Entry', master: 'Master', bed: 'Bedroom', store: 'Store', dress: 'Dressing', terrace: 'Terrace', garden: 'Garden', staff: 'Staff' },
    },
    concierge: {
      title: 'Private sales concierge', subtitle: 'A dedicated advisor replies within one working day.',
      tabs: { call: 'Request a call', meeting: 'Private meeting', whatsapp: 'WhatsApp' },
      name: 'Full name', phone: 'Mobile number', destination: 'Destination', anyDestination: 'Not sure yet',
      date: 'Preferred date', slot: 'Preferred time', slots: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
      office: 'Meet at', submitCall: 'Request a call', submitMeeting: 'Book the meeting',
      intentBrochure: 'Brochure request',
      whatsappText: 'Chat with an advisor on WhatsApp. Replies during sales hours, Saturday to Thursday.',
      whatsappOpen: 'Open WhatsApp', whatsappPending: 'WhatsApp is being set up. Call the hotline and ask for the concierge desk.',
      errName: 'Enter your name.', errPhone: 'Enter a mobile number with at least 10 digits.',
      done: (name) => `Thank you, ${name}.`, doneText: 'Your request is with the concierge team. An advisor will contact you on the number you gave.',
      prototype: 'Prototype: no data is sent from this page.',
      another: 'Make another request',
    },
    footer: {
      newsletter: 'Launch news and private previews.', email: 'Email address', subscribe: 'Subscribe', subscribed: 'You are on the list.',
      errEmail: 'Enter a valid email address.',
      destinations: 'Destinations', company: 'Company', group: 'G Group', contact: 'Contact', rights: 'All rights reserved.',
      careers: 'Careers', privacy: 'Privacy',
    },
    toastSoon: (page) => `The ${page} page is part of the next build.`,
    quick: 'Concierge',
  },
  ar: {
    intro: { skip: 'تخطي المقدمة' },
    registerInterest: 'سجّل اهتمامك',
    scroll: 'مرّر',
    drag: 'اسحب',
    prev: 'الوجهة السابقة',
    next: 'الوجهة التالية',
    menuLabel: { open: 'القائمة', close: 'إغلاق', explore: 'الوجهات', company: 'الشركة', contact: 'تحدث مع المبيعات' },
    launches: { eyebrow: 'أحدث الإطلاقات', title: 'متاح الآن.', subtitle: 'أحدث المراحل في كل المشروعات.', register: 'سجّل اهتمامك', note: '* سعر بداية استرشادي وقابل للتغيير.' },
    search2: { eyebrow: 'ابحث عن منزلك', title: 'أخبرنا بما تبحث عنه.' },
    nav: { home: 'الرئيسية', residences: 'المشروعات', about: 'من نحن', group: 'مجموعة G', journal: 'المجلة', contact: 'تواصل معنا', sustainability: 'الاستدامة' },
    map: {
      eyebrow: 'أين نبني', title: 'خريطة واحدة،', subtitle: (n) => `${n} وجهات.`,
      hintUnfold: 'واصل التمرير لفتح الخريطة', hintLens: 'نقترب من مصر…',
      hintDrag: 'اسحب العدسة، أو واصل التمرير لفتحها.',
      hintOpen: 'نفتح العرض الكامل لمصر…',
      hintReady: 'اختر وجهة للتكبير.',
      choose: 'اختر وجهة', back: 'العودة إلى الخريطة', projects: (n) => `${n} ${n === 1 ? 'وجهة' : 'وجهات'}`,
      discover: 'اكتشف', inquire: 'استفسر', approx: 'المواقع تقريبية.',
    },
    pages: {
      residences: {
        title: 'المشروعات', subtitle: 'مجتمعات في القاهرة والساحل الشمالي والبحر الأحمر.',
        text: 'تمتد مشروعاتنا بين القاهرة والساحل الشمالي والبحر الأحمر، وتجمع تصميماً خالداً ومساحات معيشة مريحة تناسب كل أسلوب حياة.',
        location: 'الموقع', type: 'نوع الوحدة', all: 'الكل', clear: 'مسح الفلاتر',
        count: (n) => `${n} ${n === 1 ? 'مجتمع' : 'مجتمعات'}`,
        none: 'لا يوجد مجتمع يطابق هذه الفلاتر.',
      },
      project: {
        concept: 'فكرة المشروع', highlights: 'أبرز المزايا', facilities: 'المرافق والخدمات', explore: 'استكشف',
        unitTypes: 'أنواع الوحدات', startingFrom: 'سعر البداية',
        brochure: 'حمّل الكتيّب', inquire: 'استفسر الآن', more: 'اكتشف مشروعات أخرى', all: 'كل المجتمعات',
      },
      about: {
        title: 'قصتنا', subtitle: 'نصنع مساحات ومجتمعات للحياة.',
        text: 'بتركيزها على تقديم مساحات معيشة استثنائية تناسب أنماط الحياة الحديثة، رسّخت الشركة حضوراً قوياً في سوق العقارات المصري.',
        approach: 'نهجنا', approachTitle: 'أربع خطوات،', approachSubtitle: 'ومعيار واحد.',
      },
      group: {
        title: 'مجموعة G', subtitle: 'مجموعة واحدة، ثماني شركات.',
        text: 'G Developments جزء من مجموعة G، التي تغطي شركاتها كل مراحل الحياة في المجتمع: من البناء والمرافق إلى الضيافة والأندية والاستثمار.',
      },
      journal: {
        title: 'المجلة', subtitle: 'الأخبار والإطلاقات.',
        text: 'الإطلاقات وأخبار المشروعات وآخر المستجدات من G Developments.',
        types: { all: 'الكل', news: 'أخبار', launch: 'إطلاقات' },
        latest: 'الأحدث أولاً', oldest: 'الأقدم أولاً', read: 'اقرأ المزيد', back: 'العودة إلى المجلة',
        related: 'شاهد المجتمع',
      },
      contact: {
        title: 'تواصل معنا', subtitle: 'أرسل استفسارك.',
        text: 'يسعدنا تواصلك. املأ النموذج وسنتواصل معك في أقرب وقت.',
        inquiry: 'نوع الاستفسار', choose: 'اختر نوع الاستفسار',
        inquiries: { sales: 'المبيعات', service: 'خدمة العملاء', brochure: 'طلب كتيّب', careers: 'الوظائف', other: 'أخرى' },
        name: 'الاسم بالكامل', email: 'البريد الإلكتروني', phone: 'رقم الموبايل', message: 'الرسالة', send: 'أرسل الرسالة',
        errType: 'اختر نوع الاستفسار.', errEmail: 'اكتب بريداً إلكترونياً صحيحاً.',
        done: 'شكراً لك. رسالتك لدى فريقنا وسنرد قريباً.', another: 'أرسل رسالة أخرى',
        details: 'بيانات التواصل', offices: 'المكاتب', directions: 'الاتجاهات',
      },
      notFound: { title: 'الصفحة غير موجودة.', text: 'الصفحة التي تبحث عنها غير موجودة.', home: 'العودة للرئيسية' },
    },
    regions: { west: 'غرب القاهرة', east: 'شرق القاهرة', north: 'الساحل الشمالي', sokhna: 'العين السخنة' },
    hotline: 'الخط الساخن',
    bookTour: 'احجز جولة خاصة',
    menu: 'القائمة',
    close: 'إغلاق',
    heroEyebrow: 'تأسست 2006 · نيو جيزة للتطوير سابقاً',
    heroTitle: 'نعيد تعريف الإرث المعماري وفخامة الساحل في مصر.',
    heroSub: 'مجموعة منتقاة من المشروعات المتميزة، من نيو كايرو إلى شواطئ رأس الحكمة.',
    explore: 'استكشف الوجهات',
    search: {
      location: 'الموقع', type: 'نوع الوحدة', budget: 'الميزانية', any: 'الكل', submit: 'ابحث عن منزلك',
      locations: { 'new-zayed': 'نيو زايد', 'new-cairo': 'القاهرة الجديدة', 'north-coast': 'الساحل الشمالي', 'ain-sokhna': 'العين السخنة', october: 'السادس من أكتوبر' },
      budgets: { lt12: 'أقل من 12 مليون ج.م', '12-16': '12 – 16 مليون ج.م', gt16: '16 مليون ج.م فأكثر' },
    },
    types: { villa: 'فيلات', townhouse: 'تاون هاوس', twin: 'توين هاوس', apartment: 'شقق', chalet: 'شاليهات' },
    stats: [
      { value: '2006', label: 'التأسيس باسم نيو جيزة للتطوير' },
      { value: '1M m²', label: 'مخطط سي شل على البحر المتوسط' },
      { value: '10', label: 'وجهات بين القاهرة والساحل الشمالي' },
      { value: 'KM 194', label: 'سي شل رأس الحكمة، طريق الإسكندرية–مطروح' },
    ],
    portfolio: {
      eyebrow: 'المشروعات', title: (n) => `${n} وجهات.`, subtitle: 'ومعيار واحد في التسليم.',
      tabs: { all: 'كل المشروعات', coastal: 'الساحل', urban: 'المدن', commercial: 'تجاري' },
      tabHints: { coastal: 'سي شل وبلايا', urban: 'نيو كايرو وآيفي', commercial: 'مكاتب وتجزئة' },
      photosSoon: 'الصور قريباً',
      view: 'اكتشف', from: 'يبدأ من', onRequest: 'السعر عند الطلب', soldOut: 'تم البيع بالكامل', million: ' مليون',
      note: '* أسعار بداية استرشادية بالجنيه المصري وقابلة للتغيير.',
      results: (n) => `${n} ${n === 1 ? 'وجهة تطابق' : 'وجهات تطابق'} بحثك`,
      noResults: 'لا توجد وجهة تطابق كل الاختيارات. جرّب ميزانية أوسع أو نوع وحدة آخر.',
      clear: 'مسح البحث',
    },
    amenities: { eyebrow: 'نمط الحياة', title: 'كل ما يحتاجه المجتمع،', subtitle: 'داخل البوابة.' },
    cta: { title: 'شاهدها بنفسك.', text: 'جولات خاصة في كل الوجهات يرتبها فريق المبيعات الخاص.', call: 'اتصل' },
    modal: {
      gallery: 'الصور', amenitiesTab: 'المرافق', masterplan: 'المخطط', units: 'الوحدات', illustrative: 'مخطط توضيحي · ليس بمقياس رسم', of: 'من', prevImg: 'الصورة السابقة', nextImg: 'الصورة التالية', noGallery: 'يتم تجهيز صور هذه الوجهة.',
      bedrooms: 'غرف النوم', plan: 'المسقط', exterior: 'الواجهة', specs: 'المواصفات',
      sample: 'مسقط نموذجي. المساحات النهائية وفق كراسة الوحدات لكل مرحلة.',
      bua: 'المساحة المبنية', baths: 'الحمامات', outdoor: 'تراس / حديقة', availableAs: 'متاحة كـ',
      brochure: 'اطلب الكتيّب', enquire: 'استفسر عن هذه الوحدة', sqm: 'م²',
      rooms: { living: 'معيشة', dining: 'طعام', kitchen: 'مطبخ', bath: 'حمام', entry: 'مدخل', master: 'رئيسية', bed: 'نوم', store: 'مخزن', dress: 'ملابس', terrace: 'تراس', garden: 'حديقة', staff: 'خدمة' },
    },
    concierge: {
      title: 'خدمة كبار العملاء', subtitle: 'يرد مستشار مخصص خلال يوم عمل واحد.',
      tabs: { call: 'اطلب مكالمة', meeting: 'اجتماع خاص', whatsapp: 'واتساب' },
      name: 'الاسم بالكامل', phone: 'رقم الموبايل', destination: 'الوجهة', anyDestination: 'لم أحدد بعد',
      date: 'التاريخ المفضل', slot: 'الوقت المفضل', slots: { morning: 'صباحاً', afternoon: 'ظهراً', evening: 'مساءً' },
      office: 'مكان اللقاء', submitCall: 'اطلب مكالمة', submitMeeting: 'احجز الاجتماع',
      intentBrochure: 'طلب كتيّب',
      whatsappText: 'تحدث مع مستشار عبر واتساب. الرد خلال ساعات العمل من السبت إلى الخميس.',
      whatsappOpen: 'افتح واتساب', whatsappPending: 'جاري تجهيز واتساب. اتصل بالخط الساخن واطلب مكتب كبار العملاء.',
      errName: 'اكتب اسمك.', errPhone: 'اكتب رقم موبايل من 10 أرقام على الأقل.',
      done: (name) => `شكراً، ${name}.`, doneText: 'طلبك لدى فريق كبار العملاء. سيتواصل معك مستشار على الرقم الذي أدخلته.',
      prototype: 'نموذج أولي: لا تُرسل أي بيانات من هذه الصفحة.',
      another: 'طلب آخر',
    },
    footer: {
      newsletter: 'أخبار الإطلاقات والمعاينات الخاصة.', email: 'البريد الإلكتروني', subscribe: 'اشترك', subscribed: 'تم تسجيلك.',
      errEmail: 'اكتب بريداً إلكترونياً صحيحاً.',
      destinations: 'الوجهات', company: 'الشركة', group: 'مجموعة G', contact: 'تواصل', rights: 'جميع الحقوق محفوظة.',
      careers: 'الوظائف', privacy: 'الخصوصية',
    },
    toastSoon: (page) => `صفحة ${page} ضمن الإصدار القادم.`,
    quick: 'كبار العملاء',
  },
};
