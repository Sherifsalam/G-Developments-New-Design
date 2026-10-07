/**
 * Content for the About, Leadership, G Group and Residences sub-pages (EN / AR).
 * Source: the "G Developments UI designs" board (About Us, G Group, Communities), Sep 2026.
 *
 * Placeholders to replace before launch are marked TODO:
 *   - Leadership names, photos, biographies and the chairman's message (never invent these).
 *   - Early history milestones (1955, 1970s): wording is the board's headline only.
 *   - Unit tables and payment plans marked `sample: true` are the board's sample figures.
 */

/* ───────── About ───────── */

export const ABOUT = {
  hero: {
    title: { en: 'A family building', ar: 'عائلة تبني' },
    subtitle: { en: 'Egypt since 1955.', ar: 'في مصر منذ 1955.' },
    text: {
      en: 'Three generations of one family, shaping homes and coastal communities across Cairo and the North Coast.',
      ar: 'ثلاثة أجيال من عائلة واحدة، تصنع المنازل والمجتمعات الساحلية بين القاهرة والساحل الشمالي.',
    },
  },
  intro: {
    title: { en: 'The byword for integrated excellence.', ar: 'المرادف للتميّز المتكامل.' },
    subtitle: { en: 'A well-curated variety of distinguished projects.', ar: 'مجموعة منتقاة من المشروعات المتميزة.' },
    lead: {
      en: 'With a focus on exceptional living spaces that suit modern lifestyles, G Developments has built a strong footprint in the Egyptian real estate market.',
      ar: 'بتركيزها على مساحات معيشة استثنائية تناسب أنماط الحياة الحديثة، رسّخت G Developments حضوراً قوياً في سوق العقارات المصري.',
    },
    body: {
      en: 'Every project begins with the same question our founders asked seventy years ago: will people still love living here in thirty years? That standard shapes where we build, how we design, and how long we stay involved after handover.',
      ar: 'يبدأ كل مشروع بالسؤال نفسه الذي طرحه المؤسسون قبل سبعين عاماً: هل سيظل الناس يحبون العيش هنا بعد ثلاثين عاماً؟ هذا المعيار يحدد أين نبني، وكيف نصمم، وإلى متى نبقى مسؤولين بعد التسليم.',
    },
  },
  stats: [
    { value: '1955', label: { en: 'Family founded', ar: 'تأسيس العائلة' } },
    { value: '6', label: { en: 'Destinations', ar: 'وجهات' } },
    { value: '4.8 km', label: { en: 'Private Mediterranean beachfront', ar: 'شواطئ خاصة على المتوسط' } },
    { value: '8', label: { en: 'Companies in G Group', ar: 'شركات في مجموعة G' } },
  ],
  index: {
    title: { en: 'Get to know us', ar: 'تعرّف علينا' },
    subtitle: { en: 'Seventy years, four ways in.', ar: 'سبعون عاماً، وأربعة مداخل.' },
  },
  group: {
    title: { en: 'One group,', ar: 'مجموعة واحدة،' },
    subtitle: { en: 'eight companies.', ar: 'ثماني شركات.' },
    text: {
      en: 'G Developments sits alongside G Communities, G Lifestyle, G Hotels, G Clubs, G Utilities, G Investments and BuildDora: the companies that fund, build and run what we deliver.',
      ar: 'تعمل G Developments جنباً إلى جنب مع G Communities وG Lifestyle وG Hotels وG Clubs وG Utilities وG Investments وBuildDora: الشركات التي تموّل ما نسلّمه وتبنيه وتديره.',
    },
    cta: { en: 'Explore G Group', ar: 'استكشف مجموعة G' },
  },
};

/** About sub-pages, in menu order. `key` matches ROUTES in GDevelopments.jsx. */
export const ABOUT_PAGES = [
  { key: 'about', title: { en: 'Overview', ar: 'نظرة عامة' } },
  {
    key: 'story', title: { en: 'Our story', ar: 'قصتنا' }, plate: 'curve',
    text: { en: 'From 2006 to communities on two coasts and the Red Sea.', ar: 'من عام 2006 إلى مجتمعات على ساحلين والبحر الأحمر.' },
  },
  {
    key: 'vision', title: { en: 'Vision, mission & values', ar: 'الرؤية والرسالة والقيم' }, plate: 'stair',
    text: { en: 'What we build for, and the five commitments behind every home.', ar: 'ما نبني من أجله، والالتزامات الخمسة وراء كل منزل.' },
  },
  {
    key: 'leadership', title: { en: 'Leadership', ar: 'القيادة' }, plate: 'arches',
    text: { en: 'The chairman, the board and the executive team.', ar: 'رئيس مجلس الإدارة وأعضاء المجلس والفريق التنفيذي.' },
  },
  {
    key: 'sustainability', title: { en: 'Sustainability', ar: 'الاستدامة' }, plate: 'horizon',
    text: { en: 'How we protect the coastline and invest in the communities around us.', ar: 'كيف نحمي الساحل ونستثمر في المجتمعات من حولنا.' },
  },
];

/* ───────── Our story ───────── */

export const STORY = {
  hero: {
    title: { en: 'Twenty years', ar: 'عشرون عاماً' },
    subtitle: { en: 'in the making.', ar: 'من البناء.' },
    text: {
      en: 'A company that has grown one careful project at a time, built around a single idea: the places we make should help people live better, healthier lives.',
      ar: 'شركة نمت مشروعاً تلو الآخر بعناية، حول فكرة واحدة: أن تساعد الأماكن التي نبنيها الناس على حياة أفضل وأكثر صحة.',
    },
  },
  /**
   * What has guided the work from the start. Drawn from a 2023 company profile supplied by the
   * client (a university management study of the company) — see README, "Our story".
   */
  principles: {
    title: { en: 'What has always guided us', ar: 'ما يوجّهنا منذ البداية' },
    items: [
      {
        id: 'old-cairo',
        title: { en: 'The charm of old Cairo', ar: 'سحر القاهرة القديمة' },
        text: {
          en: 'Our design starts from Zamalek and Garden City: tree-lined, walkable neighbourhoods, reimagined with a contemporary architectural vision.',
          ar: 'ينطلق تصميمنا من الزمالك وجاردن سيتي: أحياء تظللها الأشجار ويُمشى فيها، نعيد تخيّلها برؤية معمارية معاصرة.',
        },
      },
      {
        id: 'harmony',
        title: { en: 'One harmonious whole', ar: 'كلٌّ متناغم' },
        text: {
          en: 'Modern and neoclassical homes share one palette, set in organic landscape along gently curving streets, so a community reads as one place.',
          ar: 'منازل حديثة وكلاسيكية جديدة تتشارك لوحة ألوان واحدة، وسط طبيعة عضوية وشوارع منحنية بهدوء، فيبدو المجتمع مكاناً واحداً.',
        },
      },
      {
        id: 'people',
        title: { en: 'People first', ar: 'الإنسان أولاً' },
        text: {
          en: 'Projects that support a healthy life, with the people who live in them placed first and their satisfaction treated as the goal.',
          ar: 'مشروعات تدعم الحياة الصحية، تضع ساكنيها في المقام الأول وتجعل رضاهم هو الغاية.',
        },
      },
    ],
  },
  // The story starts at the company's founding in 2006. TODO(client): confirm the 2016 milestone.
  milestones: [
    {
      id: '2006', year: '2006', tag: { en: 'The company', ar: 'الشركة' }, plate: 'arches',
      title: { en: 'The development company is founded', ar: 'تأسيس شركة التطوير' },
      text: {
        en: 'The development company is founded, bringing residential and commercial development under one name.',
        ar: 'تتأسس شركة التطوير، فتجمع التطوير السكني والتجاري تحت اسم واحد.',
      },
    },
    {
      id: '2010s', year: '2010s', tag: { en: 'The coast', ar: 'الساحل' }, project: 'seashell', image: 'projects/gallery/01KJVYY3DC4GT1CNF874W5PF0E.webp',
      title: { en: 'Seashell and Playa open on the North Coast', ar: 'افتتاح سي شل وبلايا على الساحل الشمالي' },
      text: { en: 'Seashell covers 1 million m² with 1 km of Mediterranean beach at KM 134. Playa follows on a 1.5 km seafront at Ghazala Bay.', ar: 'تمتد سي شل على مليون متر مربع بشاطئ متوسطي طوله كيلومتر عند الكيلو 134، وتتبعها بلايا على واجهة بحرية بطول 1.5 كم في خليج غزالة.' },
    },
    {
      id: '2016', year: '2016', tag: { en: 'Education', ar: 'التعليم' }, plate: 'fins',
      title: { en: 'A university of our own', ar: 'جامعة خاصة بنا' },
      text: {
        en: 'The group opens a private university in 2016, and in 2019 commits EGP 2.7 billion to expanding it: education as part of the community, not an afterthought.',
        ar: 'تفتتح المجموعة جامعة خاصة عام 2016، وتخصص عام 2019 مبلغ 2.7 مليار جنيه لتوسعتها: التعليم جزء من المجتمع، لا إضافة لاحقة.',
      },
    },
    {
      id: '2020s', year: '2020s', tag: { en: 'Ras El Hekma', ar: 'رأس الحكمة' }, project: 'seashell-rh', image: 'projects/gallery/01KK66HQFSC53W1V0RE7287DKY.webp',
      title: { en: 'Two new destinations at Ras El Hekma', ar: 'وجهتان جديدتان في رأس الحكمة' },
      text: { en: 'Seashell Ras El Hekma brings a private 1.6 km beach and lagoons. Playa Ras El Hekma adds the G Serviced Chalets.', ar: 'تقدم سي شل رأس الحكمة شاطئاً خاصاً بطول 1.6 كم وبحيرات كريستالية، وتضيف بلايا رأس الحكمة شاليهات G المخدومة.' },
    },
    {
      id: '2024', year: '2024', tag: { en: 'A new name', ar: 'اسم جديد' }, project: 'ein-resort', image: 'projects/ein-resort/resort.webp',
      title: { en: 'G Developments, and The G Einbay', ar: 'G Developments، وذا جي عين باي' },
      text: {
        en: 'The company takes the name G Developments, shared across the whole G Group. The same year G Hotels opens The G Einbay, a 216-room golf and beach resort at Ain Sokhna.',
        ar: 'تتخذ الشركة اسم G Developments المشترك بين شركات مجموعة G. وفي العام نفسه تفتتح G Hotels منتجع ذا جي عين باي للجولف والشاطئ بـ216 غرفة في العين السخنة.',
      },
    },
    {
      id: 'today', year: { en: 'Today', ar: 'اليوم' }, tag: { en: 'NEWKAIRO', ar: 'نيو كايرو' }, project: 'new-kairo', image: 'projects/hero/01KJVYK8ZRE8PDD2E50RN8CS6M.webp',
      title: { en: 'An integrated city destination', ar: 'وجهة حضرية متكاملة' },
      text: { en: 'NEWKAIRO combines a downtown, hospitality, schools, leisure and homes in one community, connected by an electric bus network.', ar: 'تجمع نيو كايرو داون تاون وضيافة ومدارس وترفيه ومنازل في مجتمع واحد، تربطه شبكة حافلات كهربائية.' },
    },
  ],
  next: { en: 'The next chapter is being built now.', ar: 'الفصل التالي يُبنى الآن.' },
};


/* ───────── Vision, mission & values ───────── */

export const VISION = {
  hero: {
    title: { en: 'Timeless homes,', ar: 'منازل خالدة،' },
    subtitle: { en: 'built to be lived in.', ar: 'بُنيت لتُعاش.' },
  },
  vision: {
    title: { en: 'Our vision', ar: 'رؤيتنا' }, subtitle: { en: 'Where we’re going.', ar: 'إلى أين نمضي.' },
    text: {
      en: 'To be Egypt’s most trusted name in residential and coastal living, measured by how families feel in our homes decades after handover.',
      ar: 'أن نكون الاسم الأكثر ثقة في مصر في السكن الحضري والساحلي، ومقياسنا شعور العائلات في منازلنا بعد عقود من التسليم.',
    },
  },
  mission: {
    title: { en: 'Our mission', ar: 'رسالتنا' }, subtitle: { en: 'What we do every day.', ar: 'ما نفعله كل يوم.' },
    text: {
      en: 'Choose locations with lasting value, design homes around how people actually live, build them to last, and stay responsible for them long after the keys are handed over.',
      ar: 'نختار مواقع ذات قيمة دائمة، ونصمم المنازل حول الطريقة التي يعيش بها الناس فعلاً، ونبنيها لتدوم، ونبقى مسؤولين عنها طويلاً بعد تسليم المفاتيح.',
    },
  },
  values: {
    title: { en: 'Our values', ar: 'قيمنا' }, subtitle: { en: 'Five commitments behind every home.', ar: 'خمسة التزامات وراء كل منزل.' },
    items: [
      { id: 'quality', title: { en: 'Quality', ar: 'الجودة' }, text: { en: 'We would rather build less and build it properly.', ar: 'نفضّل أن نبني أقل، وأن نبني بإتقان.' } },
      { id: 'integrity', title: { en: 'Integrity', ar: 'النزاهة' }, text: { en: 'What we promise at launch is what we hand over.', ar: 'ما نعد به عند الإطلاق هو ما نسلّمه.' } },
      { id: 'design', title: { en: 'Timeless design', ar: 'تصميم خالد' }, text: { en: 'Homes that age well, not trends that date.', ar: 'منازل تزداد جمالاً مع الوقت، لا صيحات عابرة.' } },
      { id: 'community', title: { en: 'Community', ar: 'المجتمع' }, text: { en: 'Places where neighbours know each other.', ar: 'أماكن يعرف فيها الجيران بعضهم بعضاً.' } },
      { id: 'family', title: { en: 'Family', ar: 'العائلة' }, text: { en: 'A family business that treats buyers the same way.', ar: 'شركة عائلية تعامل عملاءها بالروح نفسها.' } },
    ],
  },
  why: {
    title: { en: 'Why families choose us', ar: 'لماذا تختارنا العائلات' },
    items: [
      { id: 'years', title: { en: '70 years', ar: '70 عاماً' }, text: { en: 'Of building in Egypt, across generations of the same family.', ar: 'من البناء في مصر، عبر أجيال من العائلة نفسها.' } },
      { id: 'delivery', title: { en: 'On-time delivery', ar: 'التسليم في الموعد' }, text: { en: 'Construction progress shared per project, so buyers can check for themselves.', ar: 'نشارك تقدم الإنشاءات لكل مشروع، ليتحقق العملاء بأنفسهم.' } },
      { id: 'after', title: { en: 'After handover', ar: 'بعد التسليم' }, text: { en: 'Property management and service from within G Group.', ar: 'إدارة العقارات والخدمات من داخل مجموعة G.' } },
    ],
  },
};

/* ───────── Sustainability ───────── */

export const SUSTAINABILITY = {
  hero: {
    title: { en: 'Built to last,', ar: 'مبنية لتدوم،' },
    subtitle: { en: 'built to care.', ar: 'ومبنية بعناية.' },
    text: {
      en: 'How we protect the coastline, reduce waste, and invest in the people and places around our communities.',
      ar: 'كيف نحمي الساحل، ونقلل الهدر، ونستثمر في الناس والأماكن المحيطة بمجتمعاتنا.',
    },
  },
  pillars: {
    title: { en: 'Our four commitments', ar: 'التزاماتنا الأربعة' },
    subtitle: { en: 'Environment, community, people, governance.', ar: 'البيئة، المجتمع، الناس، الحوكمة.' },
    items: [
      { id: 'env', kicker: { en: 'Environment', ar: 'البيئة' }, title: { en: 'Protect the coast', ar: 'حماية الساحل' }, text: { en: 'Low-density masterplans, native planting and water-efficient landscaping.', ar: 'مخططات منخفضة الكثافة، ونباتات محلية، وتنسيق مواقع موفر للمياه.' } },
      { id: 'com', kicker: { en: 'Community', ar: 'المجتمع' }, title: { en: 'Local first', ar: 'المحلي أولاً' }, text: { en: 'Hiring and sourcing from the regions where we build.', ar: 'التوظيف والتوريد من المناطق التي نبني فيها.' } },
      { id: 'ppl', kicker: { en: 'People', ar: 'الناس' }, title: { en: 'Safe sites', ar: 'مواقع آمنة' }, text: { en: 'Health and safety standards for every worker on every site.', ar: 'معايير الصحة والسلامة لكل عامل في كل موقع.' } },
      { id: 'gov', kicker: { en: 'Governance', ar: 'الحوكمة' }, title: { en: 'Report openly', ar: 'الإفصاح بشفافية' }, text: { en: 'An annual account of what we achieved and what we missed.', ar: 'تقرير سنوي بما أنجزناه وما فاتنا.' } },
    ],
  },
  initiatives: {
    title: { en: 'Initiatives', ar: 'المبادرات' },
    items: [
      { id: 'beach', image: 'projects/gallery/01KJVZ3EH85BHQFXDAZ4Z4FEBF.webp', title: { en: 'Beach stewardship', ar: 'رعاية الشواطئ' }, text: { en: 'Year-round care for the beachfront across our coastal communities.', ar: 'عناية على مدار العام بالشواطئ في مجتمعاتنا الساحلية.' } },
      { id: 'native', image: 'projects/gallery/01KJVWVDXX2Y1GT5XH11KWWB33.webp', title: { en: 'Native landscaping', ar: 'تنسيق بنباتات محلية' }, text: { en: 'Drought-tolerant planting that needs less water through the summer.', ar: 'نباتات تتحمل الجفاف وتحتاج إلى مياه أقل خلال الصيف.' } },
      { id: 'skills', plate: 'fins', title: { en: 'Skills programme', ar: 'برنامج المهارات' }, text: { en: 'Construction trade training for young people near our sites.', ar: 'تدريب مهني في حرف البناء للشباب قرب مواقعنا.' } },
    ],
  },
};

/* ───────── Leadership ───────── */

const NAME_TBC = { en: 'Name to be announced', ar: 'الاسم يُعلن لاحقاً' };

/**
 * "Built on people": the chairman is the cornerstone, the board the columns, the executive team the floors.
 * TODO(client): names, photos (4:5, black & white), biographies, LinkedIn URLs and the chairman's message.
 * While `name` is NAME_TBC the page shows a G monogram instead of initials, and no quote.
 */
export const LEADERSHIP = {
  hero: {
    title: { en: 'Built on people.', ar: 'مبنية على الناس.' },
    subtitle: { en: 'The structure behind every home.', ar: 'الهيكل وراء كل منزل.' },
    text: {
      en: 'Like the buildings we deliver, the company stands on a cornerstone, is carried by its columns and comes alive floor by floor.',
      ar: 'مثل المباني التي نسلّمها، تقوم الشركة على حجر أساس، وتحملها أعمدتها، وتنبض بالحياة طابقاً بعد طابق.',
    },
  },
  levels: {
    cornerstone: {
      kicker: { en: 'Level 00 · The cornerstone', ar: 'المستوى 00 · حجر الأساس' },
      title: { en: 'Chairman', ar: 'رئيس مجلس الإدارة' },
      text: { en: 'Where the family’s standard of building begins.', ar: 'حيث يبدأ معيار العائلة في البناء.' },
    },
    board: {
      kicker: { en: 'The columns', ar: 'الأعمدة' },
      title: { en: 'Board of directors', ar: 'مجلس الإدارة' },
      text: { en: 'The board sets long-term strategy and oversees governance across G Developments.', ar: 'يضع مجلس الإدارة الاستراتيجية طويلة المدى ويشرف على الحوكمة في G Developments.' },
    },
    executive: {
      kicker: { en: 'The floors', ar: 'الطوابق' },
      title: { en: 'Executive team', ar: 'الفريق التنفيذي' },
      text: { en: 'The leaders responsible for design, delivery, sales and the experience after you move in.', ar: 'القادة المسؤولون عن التصميم والتنفيذ والمبيعات والتجربة بعد انتقالك.' },
    },
  },
  chairman: {
    id: 'chairman', name: NAME_TBC, photo: null, message: null, linkedin: null,
    role: { en: 'Chairman of the board', ar: 'رئيس مجلس الإدارة' },
    title: { en: 'Chairman, G Developments and G Group', ar: 'رئيس مجلس إدارة G Developments ومجموعة G' },
    engraving: { en: 'Building Egypt since 1955', ar: 'نبني في مصر منذ 1955' },
  },
  board: [
    { id: 'vice-chairman', role: { en: 'Vice chairman', ar: 'نائب رئيس مجلس الإدارة' } },
    { id: 'managing-director', role: { en: 'Managing director', ar: 'العضو المنتدب' } },
    { id: 'non-executive', role: { en: 'Non-executive director', ar: 'عضو غير تنفيذي' } },
    { id: 'independent-1', role: { en: 'Independent director', ar: 'عضو مستقل' } },
    { id: 'independent-2', role: { en: 'Independent director', ar: 'عضو مستقل' } },
    { id: 'secretary', role: { en: 'Board secretary', ar: 'أمين سر مجلس الإدارة' } },
  ].map((m) => ({ ...m, name: NAME_TBC, photo: null, linkedin: null })),
  /** Floors, bottom to top. */
  departments: [
    { id: 'lead', name: { en: 'Leadership', ar: 'القيادة' } },
    { id: 'dev', name: { en: 'Development', ar: 'التطوير' } },
    { id: 'sales', name: { en: 'Sales & marketing', ar: 'المبيعات والتسويق' } },
    { id: 'fin', name: { en: 'Finance', ar: 'المالية' } },
    { id: 'ops', name: { en: 'Operations', ar: 'العمليات' } },
  ],
  executive: [
    { id: 'ceo', dept: 'lead', role: { en: 'Chief executive officer', ar: 'الرئيس التنفيذي' } },
    { id: 'coo', dept: 'lead', role: { en: 'Chief operating officer', ar: 'رئيس العمليات' } },
    { id: 'counsel', dept: 'lead', role: { en: 'General counsel', ar: 'المستشار القانوني العام' } },
    { id: 'head-dev', dept: 'dev', role: { en: 'Head of development', ar: 'رئيس قطاع التطوير' } },
    { id: 'head-design', dept: 'dev', role: { en: 'Head of design', ar: 'رئيس قطاع التصميم' } },
    { id: 'head-projects', dept: 'dev', role: { en: 'Head of projects', ar: 'رئيس قطاع المشروعات' } },
    { id: 'cso', dept: 'sales', role: { en: 'Chief sales officer', ar: 'رئيس المبيعات' } },
    { id: 'head-marketing', dept: 'sales', role: { en: 'Head of marketing', ar: 'رئيس قطاع التسويق' } },
    { id: 'cfo', dept: 'fin', role: { en: 'Chief financial officer', ar: 'الرئيس المالي' } },
    { id: 'finance-director', dept: 'fin', role: { en: 'Finance director', ar: 'مدير الشؤون المالية' } },
    { id: 'head-cx', dept: 'ops', role: { en: 'Head of customer experience', ar: 'رئيس قطاع تجربة العملاء' } },
    { id: 'head-pm', dept: 'ops', role: { en: 'Head of property management', ar: 'رئيس قطاع إدارة العقارات' } },
  ].map((m) => ({ ...m, name: NAME_TBC, photo: null, linkedin: null })),
  bioPending: {
    en: 'Biography to be published. It will cover current responsibilities, previous experience and education.',
    ar: 'ستُنشر السيرة الذاتية قريباً، وتشمل المسؤوليات الحالية والخبرات السابقة والتعليم.',
  },
  careers: {
    title: { en: 'Build with us', ar: 'ابنِ معنا' },
    text: { en: 'We’re hiring across engineering, sales and customer service.', ar: 'نوظف في الهندسة والمبيعات وخدمة العملاء.' },
  },
};
export const isNamed = (person) => person?.name && person.name !== NAME_TBC;

/* ───────── G Group ───────── */

export const GROUP = {
  hero: {
    title: { en: 'One group.', ar: 'مجموعة واحدة.' },
    subtitle: { en: 'Eight companies, one standard.', ar: 'ثماني شركات، ومعيار واحد.' },
    text: {
      en: 'From investment and infrastructure to the hotels, clubs and communities people live in, every G Group company works to the same idea.',
      ar: 'من الاستثمار والبنية التحتية إلى الفنادق والأندية والمجتمعات التي يعيش فيها الناس، تعمل كل شركات مجموعة G وفق الفكرة نفسها.',
    },
  },
  sectors: [
    { id: 'all', name: { en: 'All companies', ar: 'كل الشركات' } },
    { id: 'dev', name: { en: 'Development & investment', ar: 'التطوير والاستثمار' } },
    { id: 'build', name: { en: 'Build & infrastructure', ar: 'البناء والبنية التحتية' } },
    { id: 'life', name: { en: 'Hospitality & lifestyle', ar: 'الضيافة ونمط الحياة' } },
  ],
  chain: {
    title: { en: 'How the group works together', ar: 'كيف تعمل المجموعة معاً' },
    subtitle: { en: 'One destination, eight companies.', ar: 'وجهة واحدة، ثماني شركات.' },
    steps: [
      { id: 'invest', step: { en: 'Invest', ar: 'الاستثمار' }, who: 'G Investments', text: { en: 'Secures land and capital.', ar: 'تؤمّن الأرض ورأس المال.' } },
      { id: 'build', step: { en: 'Build', ar: 'البناء' }, who: 'BuildDora', text: { en: 'Delivers on site.', ar: 'تنفّذ في الموقع.' } },
      { id: 'connect', step: { en: 'Connect', ar: 'الربط' }, who: 'G Utilities', text: { en: 'Water, power, infrastructure.', ar: 'المياه والطاقة والبنية التحتية.' } },
      { id: 'sell', step: { en: 'Sell', ar: 'البيع' }, who: 'G Developments', text: { en: 'Launches and sells homes.', ar: 'تطلق المنازل وتبيعها.' } },
      { id: 'live', step: { en: 'Live', ar: 'الحياة' }, who: 'Communities · Hotels · Clubs · Lifestyle', text: { en: 'Run the destination day to day.', ar: 'تدير الوجهة يوماً بيوم.' } },
    ],
  },
  partners: {
    title: { en: 'Working with G Group', ar: 'العمل مع مجموعة G' },
    subtitle: { en: 'Partners, suppliers, investors.', ar: 'شركاء وموردون ومستثمرون.' },
    text: { en: 'For partnerships, supplier registration or investor relations, contact the group office directly.', ar: 'للشراكات أو تسجيل الموردين أو علاقات المستثمرين، تواصل مع مكتب المجموعة مباشرة.' },
    cta: { en: 'Contact the group office', ar: 'تواصل مع مكتب المجموعة' },
  },
  entity: {
    sector: { en: 'Sector', ar: 'القطاع' },
    properties: { en: 'Properties', ar: 'الفنادق' },
    rooms: (n) => ({ en: `${n} rooms`, ar: `${n} غرفة` }),
    opening: { en: 'Opening', ar: 'الافتتاح' },
    visit: { en: 'Visit website', ar: 'زر الموقع' },
    pendingTitle: { en: 'Company profile to follow', ar: 'ملف الشركة قريباً' },
    pendingText: {
      en: 'This company has no published profile yet. Its history, capabilities and figures will be added once G Group supplies them — nothing here is estimated.',
      ar: 'لم يُنشر ملف هذه الشركة بعد. ستُضاف النبذة والخدمات والأرقام فور ورودها من المجموعة — ولا يوجد هنا أي تقدير.',
    },
    about: { en: 'About', ar: 'نبذة عن' },
    capabilities: { en: 'What we do', ar: 'ما نقدمه' },
    projects: { en: 'Selected projects', ar: 'مشروعات مختارة' },
    others: { en: 'Other G Group companies', ar: 'شركات أخرى في مجموعة G' },
    viewAll: { en: 'View all', ar: 'عرض الكل' },
    more: (n) => ({ en: `+${n} more companies`, ar: `+${n} شركات أخرى` }),
    contact: { en: 'Contact', ar: 'تواصل مع' },
  },
};

/* ───────── Residences: status, launches, units ───────── */

/** Build status per project (from the design board). IVY has no published status yet. */
export const PROJECT_STATUS = {
  'new-kairo': 'construction',
  seashell: 'ready',
  'playa-ghazala': 'ready',
  'seashell-rh': 'construction',
  'playa-rh': 'construction',
};

export const RESIDENCES = {
  tabs: { all: { en: 'All communities', ar: 'كل المجتمعات' }, launches: { en: 'Latest launches', ar: 'أحدث الإطلاقات' } },
  status: { en: 'Status', ar: 'الحالة' },
  statuses: {
    ready: { en: 'Ready to move', ar: 'جاهز للسكن' },
    construction: { en: 'Under construction', ar: 'قيد الإنشاء' },
  },
  lifestyle: { en: 'Lifestyle', ar: 'نمط الحياة' },
  lifestyles: { coastal: { en: 'Coastal', ar: 'ساحلي' }, urban: { en: 'City', ar: 'حضري' } },
  view: { grid: { en: 'Grid', ar: 'شبكة' }, map: { en: 'Map', ar: 'خريطة' } },
  clearAll: { en: 'Clear all', ar: 'مسح الكل' },
  remove: { en: 'Remove', ar: 'إزالة' },
  keybar: {
    location: { en: 'Location', ar: 'الموقع' },
    signature: { en: 'Signature', ar: 'العلامة المميزة' },
    types: { en: 'Unit types', ar: 'أنواع الوحدات' },
    status: { en: 'Status', ar: 'الحالة' },
    price: { en: 'Starting price', ar: 'سعر البداية' },
  },
  sections: {
    overview: { en: 'Overview', ar: 'نظرة عامة' },
    explore: { en: 'Gallery & plans', ar: 'الصور والمخططات' },
    units: { en: 'Units & prices', ar: 'الوحدات والأسعار' },
    location: { en: 'Location', ar: 'الموقع' },
  },
  callback: {
    title: (name) => ({ en: `Interested in ${name}?`, ar: `مهتم بـ ${name}؟` }),
    text: { en: 'A sales advisor will call you back within one working day.', ar: 'سيتصل بك مستشار مبيعات خلال يوم عمل واحد.' },
    submit: { en: 'Request a call', ar: 'اطلب مكالمة' },
    done: { en: 'Thank you. An advisor will call you shortly.', ar: 'شكراً لك. سيتصل بك مستشار قريباً.' },
  },
  locationText: { en: 'Pinned on the map of Egypt. Exact location on request.', ar: 'موضحة على خريطة مصر. الموقع الدقيق عند الطلب.' },
};

export const LAUNCH_PAGE = {
  newest: { en: 'Newest launch', ar: 'أحدث إطلاق' },
  all: { en: 'All recent launches', ar: 'كل الإطلاقات الأخيرة' },
  view: { en: 'View project', ar: 'عرض المشروع' },
  seeUnits: { en: 'Units & prices', ar: 'الوحدات والأسعار' },
  form: {
    title: { en: 'Be first to hear about the next launch', ar: 'كن أول من يعرف بالإطلاق القادم' },
    text: { en: 'Tell us what you’re looking for. A sales advisor will contact you within one working day.', ar: 'أخبرنا بما تبحث عنه، وسيتواصل معك مستشار مبيعات خلال يوم عمل واحد.' },
    email: { en: 'Email (optional)', ar: 'البريد الإلكتروني (اختياري)' },
    project: { en: 'Project', ar: 'المشروع' },
    anyLaunch: { en: 'Any upcoming launch', ar: 'أي إطلاق قادم' },
    budget: { en: 'Budget', ar: 'الميزانية' },
    budgets: [
      { id: 'unsure', label: { en: 'Not sure yet', ar: 'لم أحدد بعد' } },
      { id: 'lt10', label: { en: 'Up to EGP 10M', ar: 'حتى 10 مليون ج.م' } },
      { id: '10-20', label: { en: 'EGP 10–20M', ar: '10–20 مليون ج.م' } },
      { id: 'gt20', label: { en: 'EGP 20M+', ar: 'أكثر من 20 مليون ج.م' } },
    ],
    contactBy: { en: 'How should we contact you?', ar: 'كيف نتواصل معك؟' },
    channels: [
      { id: 'call', label: { en: 'Phone call', ar: 'مكالمة هاتفية' } },
      { id: 'whatsapp', label: { en: 'WhatsApp', ar: 'واتساب' } },
      { id: 'email', label: { en: 'Email', ar: 'البريد الإلكتروني' } },
    ],
    submit: { en: 'Register interest', ar: 'سجّل اهتمامك' },
    privacy: { en: 'We’ll only use your details to contact you about this enquiry.', ar: 'سنستخدم بياناتك فقط للتواصل معك بشأن هذا الطلب.' },
    done: (name) => ({ en: `Thanks, ${name}. An advisor will call you by tomorrow.`, ar: `شكراً ${name}. سيتصل بك مستشار بحلول الغد.` }),
  },
};

/**
 * Unit tables per project. Replace with the live Salesforce feed.
 * TODO(client): `sample: true` rows are the design board's sample figures, not real prices.
 */
export const UNIT_TABLES = {
  'seashell-rh': {
    sample: true,
    rows: [
      { id: 'c1', type: 'chalet', variant: { en: 'Ground floor with garden', ar: 'دور أرضي بحديقة' }, beds: 1, area: 85, outdoor: { en: 'Garden 40 m²', ar: 'حديقة 40 م²' }, price: 9.85, availability: 'available' },
      { id: 'c2', type: 'chalet', variant: { en: 'Typical floor', ar: 'دور متكرر' }, beds: 2, area: 120, outdoor: { en: 'Terrace 18 m²', ar: 'تراس 18 م²' }, price: 13.4, availability: 'available' },
      { id: 'l1', type: 'loft', variant: { en: 'Two levels', ar: 'مستويان' }, beds: 2, area: 140, outdoor: { en: 'Roof 60 m²', ar: 'روف 60 م²' }, price: 15.9, availability: 'few' },
      { id: 'p1', type: 'penthouse', variant: { en: 'Sea view', ar: 'إطلالة على البحر' }, beds: 3, area: 175, outdoor: { en: 'Roof 90 m²', ar: 'روف 90 م²' }, price: 21.3, availability: 'few' },
      { id: 'v1', type: 'villa', variant: { en: 'Twin house', ar: 'توين هاوس' }, beds: 3, area: 210, outdoor: { en: 'Garden 150 m²', ar: 'حديقة 150 م²' }, price: 29.75, availability: 'available' },
      { id: 'v2', type: 'villa', variant: { en: 'Standalone, lagoon front', ar: 'مستقلة على البحيرة' }, beds: 4, area: 320, outdoor: { en: 'Garden 280 m²', ar: 'حديقة 280 م²' }, price: 48.5, availability: 'sold' },
    ],
  },
};

/** Payment plans. NEWKAIRO's is from the Aug 2025 launch notes; the rest are the board's samples. */
export const PAYMENT_PLANS = {
  'new-kairo': { down: '5%', years: 7 },
  'seashell-rh': { down: '10%', years: 8, delivery: '2028', sample: true },
};

export const UNITS_PAGE = {
  title: { en: 'Units & prices', ar: 'الوحدات والأسعار' },
  lead: { en: 'Current availability and starting prices.', ar: 'التوافر الحالي وأسعار البداية.' },
  sample: { en: 'Indicative figures, subject to change. Request details for today’s price.', ar: 'أرقام استرشادية قابلة للتغيير. اطلب التفاصيل لمعرفة سعر اليوم.' },
  allTypes: { en: 'All types', ar: 'كل الأنواع' },
  types: { chalet: { en: 'Chalets', ar: 'شاليهات' }, loft: { en: 'Lofts', ar: 'لوفت' }, penthouse: { en: 'Penthouses', ar: 'بنتهاوس' }, villa: { en: 'Villas', ar: 'فيلات' } },
  typeOne: { chalet: { en: 'Chalet', ar: 'شاليه' }, loft: { en: 'Loft', ar: 'لوفت' }, penthouse: { en: 'Penthouse', ar: 'بنتهاوس' }, villa: { en: 'Villa', ar: 'فيلا' } },
  maxBudget: { en: 'Max budget', ar: 'أقصى ميزانية' },
  any: { en: 'Any', ar: 'الكل' },
  hideSold: { en: 'Hide sold out', ar: 'إخفاء المباع' },
  cols: {
    type: { en: 'Unit type', ar: 'نوع الوحدة' }, beds: { en: 'Bedrooms', ar: 'غرف النوم' }, area: { en: 'Built-up area', ar: 'المساحة المبنية' },
    outdoor: { en: 'Outdoor', ar: 'مساحة خارجية' }, price: { en: 'Starting price', ar: 'سعر البداية' }, availability: { en: 'Availability', ar: 'التوافر' },
  },
  availability: { available: { en: 'Available', ar: 'متاح' }, few: { en: 'Few left', ar: 'متبقٍ القليل' }, sold: { en: 'Sold out', ar: 'تم البيع' } },
  request: { en: 'Request details', ar: 'اطلب التفاصيل' },
  waitlist: { en: 'Join waitlist', ar: 'انضم لقائمة الانتظار' },
  count: (n) => ({ en: `${n} unit ${n === 1 ? 'type' : 'types'}`, ar: `${n} ${n === 1 ? 'نوع وحدة' : 'أنواع وحدات'}` }),
  none: { en: 'No units match. Raise the budget or show all types.', ar: 'لا توجد وحدات مطابقة. ارفع الميزانية أو اعرض كل الأنواع.' },
  note: { en: 'Starting prices in EGP, excluding maintenance and club fees. Final price depends on floor, view and payment plan.', ar: 'أسعار البداية بالجنيه المصري، ولا تشمل رسوم الصيانة والنادي. يعتمد السعر النهائي على الدور والإطلالة وخطة السداد.' },
  plan: { en: 'Payment plan', ar: 'خطة السداد' },
  down: { en: 'Down payment', ar: 'المقدم' },
  instalments: { en: 'Instalments', ar: 'الأقساط' },
  years: (n) => ({ en: `Up to ${n} years`, ar: `حتى ${n} سنوات` }),
  delivery: { en: 'Delivery', ar: 'التسليم' },
  from: (y) => ({ en: `From ${y}`, ar: `من ${y}` }),
  pending: {
    title: { en: 'Live prices are on their way', ar: 'الأسعار المباشرة قريباً' },
    text: { en: 'The unit list for this community isn’t published yet. Explore sample layouts below, or request details and an advisor will send today’s availability.', ar: 'لم تُنشر قائمة الوحدات لهذا المجتمع بعد. استكشف المساقط النموذجية أدناه، أو اطلب التفاصيل وسيرسل لك مستشار التوافر الحالي.' },
  },
  found: { en: 'Found the right unit?', ar: 'وجدت الوحدة المناسبة؟' },
  foundText: { en: 'Request details and a sales advisor will confirm availability and send a floor plan.', ar: 'اطلب التفاصيل وسيؤكد مستشار المبيعات التوافر ويرسل لك المسقط.' },
  brochure: { en: 'Download brochure', ar: 'حمّل الكتيّب' },
};


/**
 * Phases you can step through on a project page. `at` places a numbered marker on the plan
 * drawing; phases without it are still listed and selectable, they just have nowhere to point.
 * Prices are indicative starting figures from the launch material — confirm with Sales.
 */
/** Labels for the masterplan and phase browser, shared by every project. */
export const MASTERPLAN_UI = {
  masterplan: { en: 'The masterplan', ar: 'المخطط العام' },
  enlarge: { en: 'Enlarge the masterplan', ar: 'تكبير المخطط' },
    open: { en: 'Open full plan', ar: 'افتح المخطط كاملاً' },
    close: { en: 'Close plan', ar: 'إغلاق المخطط' },
    zoomIn: { en: 'Zoom in', ar: 'تكبير' },
    zoomOut: { en: 'Zoom out', ar: 'تصغير' },
    reset: { en: 'Reset view', ar: 'إعادة العرض' },
    zones: { en: 'Zones', ar: 'المناطق' },
    phases: { en: 'Phases', ar: 'المراحل' },
    pickPhase: { en: 'Choose a phase', ar: 'اختر مرحلة' },
    unitType: { en: 'Unit type', ar: 'نوع الوحدة' },
    area: { en: 'Area', ar: 'المساحة' },
    from: { en: 'Starting price', ar: 'سعر البداية' },
    terms: { en: 'Payment', ar: 'السداد' },
    indicative: { en: 'Indicative starting prices, subject to change.', ar: 'أسعار بداية استرشادية وقابلة للتغيير.' },
    pick: { en: 'Select a zone on the plan', ar: 'اختر منطقة على المخطط' },
    download: { en: 'Download the brochure', ar: 'حمّل الكتيّب' },
    note: { en: 'Masterplan drawing is indicative and subject to change.', ar: 'رسم المخطط استرشادي وقابل للتغيير.' },
};

export const PROJECT_PHASES = {
  'playa-ghazala': [
    {
      id: 'g-villas', at: { x: 22, y: 12 },
      name: { en: 'G Villas', ar: 'فيلات G' },
      status: { en: 'Ready to move', ar: 'جاهزة للاستلام' },
      text: {
        en: 'Standalone villas built directly on the beachfront and already finished, so there is no delivery wait.',
        ar: 'فيلات مستقلة على الشاطئ مباشرة ومكتملة البناء، بلا انتظار للتسليم.',
      },
      terms: { en: '25% down payment · 2 years', ar: '25% مقدم · سنتان' },
      units: [
        { type: { en: 'Standalone villa', ar: 'فيلا مستقلة' }, area: '262 m²', price: 'EGP 78M' },
      ],
    },
    {
      id: 'g-village', at: { x: 46, y: 64 },
      name: { en: 'G Village', ar: 'قرية G' },
      status: { en: 'Delivery in 3 years', ar: 'التسليم خلال 3 سنوات' },
      text: {
        en: 'The newest residential phase: dwellings buildings and twinhouses, fully finished.',
        ar: 'أحدث مرحلة سكنية: مبانٍ سكنية وتوين هاوس، كاملة التشطيب.',
      },
      terms: { en: '10% down payment · 6 years', ar: '10% مقدم · 6 سنوات' },
      units: [
        { type: { en: 'Dwellings', ar: 'وحدات سكنية' }, area: '—', price: 'From EGP 21.4M' },
        { type: { en: 'Twinhouse', ar: 'توين هاوس' }, area: '—', price: 'From EGP 31.4M' },
      ],
    },
  ],
  'seashell-rh': [
    {
      id: 'lagoon-views', at: { x: 66, y: 60 },
      name: { en: 'Lagoon Views · Phase 2', ar: 'لاجون فيوز · المرحلة الثانية' },
      status: { en: 'Selling', ar: 'متاحة للبيع' },
      text: {
        en: 'Duplexes and ground-floor homes set directly on the crystal lagoons.',
        ar: 'دوبلكس ووحدات أرضية مباشرة على البحيرات الكريستالية.',
      },
      terms: { en: '5% down payment · 8.5 years', ar: '5% مقدم · 8.5 سنوات' },
      units: [
        { type: { en: '2 bedrooms · duplex', ar: 'غرفتان · دوبلكس' }, area: '110 m² + 50 m² garden', price: 'EGP 16.1M' },
        { type: { en: '3 bedrooms · duplex', ar: '3 غرف · دوبلكس' }, area: '140 m² + 100 m² garden', price: 'EGP 20.5M' },
        { type: { en: '3 bedrooms · ground', ar: '3 غرف · أرضي' }, area: '193 m² + 550 m² garden', price: 'EGP 23.4M' },
        { type: { en: '4 bedrooms · upper', ar: '4 غرف · علوي' }, area: '235 m² + 155 m² roof', price: 'EGP 24.5M' },
      ],
    },
    {
      id: 'sea-front', at: { x: 45, y: 20 },
      name: { en: 'Sea Front villas', ar: 'فيلات الواجهة البحرية' },
      status: { en: 'Delivery 2029', ar: 'التسليم 2029' },
      text: {
        en: 'Ten standalone villa types across rows 1 to 8, every one with an unobstructed sea view and a private garden.',
        ar: 'عشرة أنواع من الفيلات المستقلة عبر الصفوف 1 إلى 8، جميعها بإطلالة بحرية مفتوحة وحديقة خاصة.',
      },
      units: [
        { type: { en: 'Row 8 · 4 bedrooms', ar: 'الصف 8 · 4 غرف' }, area: '—', price: 'From EGP 46.2M' },
        { type: { en: 'Row 5 · 4 bedrooms', ar: 'الصف 5 · 4 غرف' }, area: '—', price: 'From EGP 54.3M' },
        { type: { en: 'Row 2 · 5 bedrooms', ar: 'الصف 2 · 5 غرف' }, area: '—', price: 'From EGP 92.4M' },
        { type: { en: 'Row 1 · beachfront · 6 bedrooms', ar: 'الصف 1 · على الشاطئ · 6 غرف' }, area: '—', price: 'From EGP 202.1M' },
      ],
    },
  ],
  'playa-rh': [
    {
      id: 'phase-3',
      name: { en: 'Phase 3 · The G Serviced Chalets', ar: 'المرحلة الثالثة · شاليهات G المخدومة' },
      status: { en: 'Launched', ar: 'تم الإطلاق' },
      text: {
        en: 'Beach homes run day to day by G Hotels, from one-bedroom chalets up to penthouses.',
        ar: 'وحدات على البحر تديرها G Hotels يومياً، من شاليهات بغرفة واحدة حتى البنتهاوس.',
      },
      terms: { en: '5% down payment · 7 years', ar: '5% مقدم · 7 سنوات' },
      units: [
        { type: { en: '1 bedroom', ar: 'غرفة واحدة' }, area: '71 m²', price: 'From EGP 9.2M' },
        { type: { en: '2 bedrooms', ar: 'غرفتان' }, area: '118–127 m²', price: 'From EGP 15.3M' },
        { type: { en: '3 bedrooms', ar: '3 غرف' }, area: '167–174 m²', price: 'From EGP 21.7M' },
        { type: { en: 'Penthouse', ar: 'بنتهاوس' }, area: '180–218 m²', price: 'From EGP 24.3M' },
      ],
    },
  ],
  'new-kairo': [
    {
      id: 'townhouses',
      name: { en: 'Townhouses & villas', ar: 'تاون هاوس وفيلات' },
      status: { en: 'Limited release', ar: 'طرح محدود' },
      text: {
        en: 'Fully finished townhouses and semi-attached villas, middle and corner units, several with a penthouse floor.',
        ar: 'تاون هاوس وفيلات نصف منفصلة كاملة التشطيب، وحدات وسطية وركنية، وبعضها بدور بنتهاوس.',
      },
      terms: { en: '5% down payment · 7 years', ar: '5% مقدم · 7 سنوات' },
      units: [
        { type: { en: 'Townhouse middle · 3 bd', ar: 'تاون هاوس وسطي · 3 غرف' }, area: '180 m²', price: 'EGP 18.3M' },
        { type: { en: 'Townhouse + penthouse · 4 bd', ar: 'تاون هاوس + بنتهاوس · 4 غرف' }, area: '215 m²', price: 'EGP 21.9M' },
        { type: { en: 'Semi-attached villa · 4 bd', ar: 'فيلا نصف منفصلة · 4 غرف' }, area: '192 m²', price: 'EGP 19.9M' },
        { type: { en: 'Semi-attached + penthouse · 5 bd', ar: 'نصف منفصلة + بنتهاوس · 5 غرف' }, area: '230 m²', price: 'EGP 23.9M' },
        { type: { en: 'Standalone + penthouse · 5 bd', ar: 'مستقلة + بنتهاوس · 5 غرف' }, area: '260 m²', price: 'EGP 31.8M' },
      ],
    },
    {
      id: 'apartments',
      name: { en: 'Apartments', ar: 'شقق' },
      status: { en: 'Selling', ar: 'متاحة للبيع' },
      text: {
        en: 'One to four bedroom apartments, fully finished with air conditioning.',
        ar: 'شقق من غرفة إلى أربع غرف، كاملة التشطيب مع التكييف.',
      },
      terms: { en: '5% down payment · 8.5 years', ar: '5% مقدم · 8.5 سنوات' },
      units: [],
    },
    {
      id: 'neon-views',
      name: { en: 'Neon Views', ar: 'نيون فيوز' },
      status: { en: 'Launched', ar: 'تم الإطلاق' },
      text: {
        en: 'Villas and townhouses arranged around reflection lakes and garden walks.',
        ar: 'فيلات وتاون هاوس حول بحيرات عاكسة وممرات بين الحدائق.',
      },
      units: [],
    },
  ],
};

/* ───────── Masterplans ───────── */

/**
 * Interactive masterplans, keyed by project id. `hotspots` are percentages of the plan image
 * (x from the left, y from the top), so they move with it at any size.
 * Playa Ghazala: plan and zone renders from the G Developments sales site (Sep 2026).
 */
export const MASTERPLANS = {
  'playa-ghazala': {
    title: { en: 'The masterplan', ar: 'المخطط العام' },
    subtitle: { en: 'Three distinct experiences', ar: 'ثلاث تجارب متميزة' },
    intro: {
      en: 'The plan runs three zones together, from the private beach at the top down through the residential terraces. Pick a zone to see it.',
      ar: 'يجمع المخطط ثلاث مناطق، من الشاطئ الخاص في الأعلى إلى المدرجات السكنية. اختر منطقة لعرضها.',
    },
    planAlt: { en: 'Playa Ghazala masterplan drawing', ar: 'رسم المخطط العام لبلايا غزالة' },
    brochure: '/brochures/playa-ghazala.pdf',
    zones: [
      {
        id: 'promenade', image: 'promenade', at: { x: 30, y: 15 },
        name: { en: 'The Promenade', ar: 'البرومناد' },
        text: {
          en: 'Cycling, skating and jogging along the coastline, beside a sports club with pilates, yoga and fitness studios.',
          ar: 'مسارات للدراجات والتزلج والجري على امتداد الساحل، إلى جانب نادٍ رياضي باستوديوهات بيلاتس ويوجا ولياقة.',
        },
        tags: [
          { en: 'Sports club', ar: 'نادٍ رياضي' },
          { en: 'Cycling & jogging', ar: 'دراجات وجري' },
          { en: 'Pilates & yoga', ar: 'بيلاتس ويوجا' },
        ],
      },
      {
        id: 'downtown', image: 'downtown', at: { x: 66, y: 24 },
        name: { en: 'Cable Park & Downtown', ar: 'الكيبل بارك والداون تاون' },
        text: {
          en: 'A cable park for wakeboarding, next to the retail and dining district with shops, boutiques and restaurants by the sea.',
          ar: 'كيبل بارك للتزلج على الماء، بجوار منطقة المحلات والمطاعم على البحر.',
        },
        tags: [
          { en: 'Cable park', ar: 'كيبل بارك' },
          { en: 'Shops & boutiques', ar: 'محلات وبوتيكات' },
          { en: 'Dining by the sea', ar: 'مطاعم على البحر' },
        ],
      },
      {
        id: 'spine', image: 'spine', at: { x: 42, y: 58 },
        name: { en: 'Central Spine', ar: 'المحور المركزي' },
        text: {
          en: 'A green corridor linking the beach to the downtown, planted with parks and Mediterranean species suited to the North Coast.',
          ar: 'ممر أخضر يربط الشاطئ بالداون تاون، مزروع بالحدائق ونباتات متوسطية تناسب الساحل الشمالي.',
        },
        tags: [
          { en: 'Parks', ar: 'حدائق' },
          { en: 'Shaded walks', ar: 'ممشى مظلل' },
          { en: 'Beach to downtown', ar: 'من الشاطئ للداون تاون' },
        ],
      },
    ],
  },
};

/* ───────── Shared UI strings ───────── */


export const UI = {
  menu: {
    about: { en: 'About us', ar: 'من نحن' },
    group: { en: 'All companies', ar: 'كل الشركات' },
    residences: { en: 'All communities', ar: 'كل المجتمعات' },
  },
  readBio: { en: 'Read biography', ar: 'اقرأ السيرة الذاتية' },
  bio: { en: 'Biography', ar: 'السيرة الذاتية' },
  linkedin: { en: 'LinkedIn profile', ar: 'الملف على لينكدإن' },
  openRoles: { en: 'See open roles', ar: 'الوظائف المتاحة' },
  getInTouch: { en: 'Get in touch', ar: 'تواصل معنا' },
  viewCommunities: { en: 'View our communities', ar: 'شاهد مجتمعاتنا' },
  since: { en: 'Since', ar: 'منذ' },
  all: { en: 'All', ar: 'الكل' },
};
