export type ExhibitionCategory = 'physical' | 'digital' | 'magazine';

export interface ExhibitionLinks {
  website?: string;
  magazine?: string;
  magazineLabel?: string;
  issue?: string;
  artwork?: string;
}

export interface ExhibitionEntry {
  id: string;
  year: string;
  title: string;
  gallery: string;
  place: string;
  category: ExhibitionCategory;
  kind?: 'solo' | 'group' | 'museum';
  /** Thumbnail images shown in the accordion strip (max 4 displayed). */
  images: string[];
  /**
   * Extra images shown ONLY in the "View all" full-screen gallery.
   * Drop files into /public/media/exhibitions/<id>/gallery/ and list paths here.
   * These are appended after `images` when the overlay opens.
   */
  galleryImages?: string[];
  links?: ExhibitionLinks;
}

/** Holy Paris Myth-Busting journal scans (filenames use U+2011 / U+2013 dashes). */
export const holyParisJournal = (n: 1 | 3 | 5 | 12) =>
  `/media/exhibitions/holy-paris/Myth\u2011Busting The Holy Art Gallery \u2013 The Holy Art Journal (${n}).jpeg`;

export const exhibitionPoster = (filename: string) =>
  `/media/posters/${encodeURIComponent(filename)}`;

/** Path to an extra file in /public/media/exhibitions/<id>/gallery/ */
const exGallery = (id: string, filename: string) =>
  `/media/exhibitions/${id}/gallery/${encodeURIComponent(filename)}`;

/** Path to a file directly under /public/media/exhibitions/<id>/ */
const exMedia = (id: string, filename: string) =>
  `/media/exhibitions/${id}/${encodeURIComponent(filename)}`;

const holyParisGalleryJournal = (n?: number) =>
  n == null
    ? `/media/exhibitions/holy-paris/gallery/Myth\u2011Busting The Holy Art Gallery \u2013 The Holy Art Journal.jpeg`
    : `/media/exhibitions/holy-paris/gallery/Myth\u2011Busting The Holy Art Gallery \u2013 The Holy Art Journal (${n}).jpeg`;

const holyLondonGalleryJournal = (n: number) =>
  `/media/exhibitions/holy-london/gallery/Myth\u2011Busting The Holy Art Gallery \u2013 The Holy Art Journal (${n}).jpeg`;

const HOLY_PARIS_IMAGES = [
  '/media/posters/paris-poster.png',
  holyParisJournal(1),
  holyParisJournal(3),
  holyParisJournal(5),
  holyParisJournal(12),
] as const;

/** Chronological exhibition list — posters & venue imagery only (no personal portraits). */
export const exhibitionEntries: ExhibitionEntry[] = [
  {
    id: 'venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/venice/venice-1.jpg',
      '/media/exhibitions/venice/venice-2.jpg',
      '/media/exhibitions/venice/venice-3.jpg',
      '/media/exhibitions/venice/venice-5.jpg',
    ],
    galleryImages: [
      exGallery('venice', '648918206_1383772560462828_3767331331641185718_n.jpg'),
      exGallery('venice', '648927189_1383778160462268_449361638300043152_n.jpg'),
      exGallery('venice', '648937250_1383776017129149_1338640970781817569_n.jpg'),
      exGallery('venice', '649193839_1383776833795734_84500885255901354_n.jpg'),
      exGallery('venice', '649799305_1383775067129244_8500890639962005552_n.jpg'),
      exGallery('venice', '649904384_1383775150462569_1383897816535690786_n.jpg'),
      exGallery('venice', '649989713_1383776813795736_4609840621063356518_n.jpg'),
      exGallery('venice', '650129293_1383777807128970_5333815825146644245_n.jpg'),
      exGallery('venice', '651198882_1383776300462454_8223465552476024227_n.jpg'),
    ],
  },
  {
    id: 'senses',
    year: '2025',
    title: 'Senses International Art Fair',
    gallery: 'MUST Museum',
    place: 'Lecce, Italy',
    kind: 'museum',
    category: 'physical',
    images: [
      '/media/exhibitions/senses/senses-main.jpg',
      '/media/exhibitions/senses/senses-1.jpg',
      '/media/exhibitions/senses/senses-2.jpg',
      '/media/exhibitions/senses/senses-placeholder-4.jpg',
    ],
    galleryImages: [
      exGallery('senses', '600498341_1325565339616884_5953681650824118580_n.jpg'),
      exGallery('senses', '605117074_1325562712950480_120582964007890023_n.jpg'),
      exGallery('senses', '605237721_1325564542950297_7107043999578019759_n.jpg'),
      exGallery('senses', '605537738_1325561569617261_2951130361631858173_n.jpg'),
      exGallery('senses', '605710631_1325563999617018_503610719837108647_n.jpg'),
      exGallery('senses', '605945269_1325565766283508_3939212514806002408_n.jpg'),
      exGallery('senses', '606452544_1325564489616969_9169987387974060894_n.jpg'),
      exGallery('senses', '606644304_1325564262950325_2978085870174958552_n.jpg'),
      exGallery('senses', '607470750_1325564126283672_3269575574160197472_n.jpg'),
    ],
  },
  {
    id: 'im-insa',
    year: '2025',
    title: 'IM INSA',
    gallery: 'Insadong',
    place: 'Seoul, South Korea',
    kind: 'solo',
    category: 'physical',
    images: [
      exhibitionPoster('im insa.jpg'),
      '/media/exhibitions/im-insa/im-insa.jpg',
    ],
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × HCMY',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/kinship/kinship-main.png',
      '/media/exhibitions/kinship/kinship-1.jpg',
      '/media/exhibitions/kinship/kinship-2.jpg',
      '/media/exhibitions/kinship/kinship-3.jpg',
    ],
    galleryImages: [
      exGallery('kinship', 'IMG_9196.jpg'),
      exGallery('kinship', 'IMG_9199.JPG'),
      exGallery('kinship', 'IMG_9200.jpg'),
      exGallery('kinship', 'IMG_9222.jpg'),
      exGallery('kinship', 'IMG_9224.jpg'),
      exGallery('kinship', 'IMG_9240.JPG'),
      exGallery('kinship', 'IMG_9261.JPG'),
      exGallery('kinship', 'IMG_9289.jpg'),
      exGallery('kinship', 'IMG_9814.JPG'),
    ],
  },
  {
    id: 'dimo',
    year: '2025',
    title: 'DIMO × Verger Gallery',
    gallery: 'Verger Gallery',
    place: 'Seoul, South Korea',
    kind: 'group',
    category: 'physical',
    images: [
      exhibitionPoster('Vergr Gallery.jpg'),
      '/media/exhibitions/dimo/dimo-main.jpg',
      '/media/exhibitions/dimo/dimo-1.jpg',
      '/media/exhibitions/dimo/dimo-2.jpg',
      '/media/exhibitions/dimo/dimo-placeholder-4.jpg',
    ],
    galleryImages: [
      exGallery('dimo', '627694813_17908333197339918_3303511495045958106_n.jpg'),
      exGallery('dimo', '627753295_17908333200339918_598721757060089469_n.jpg'),
      exGallery('dimo', '629753598_17908333182339918_5341498475658114308_n.jpg'),
      exGallery('dimo', 'AQNXoUOYLgxJ0hzAtS0rGcPR-06fRYShLT2KqYXYUJxOtphig2x51avg2K7vJ6rXFs20hKz_5phbwQuOzfDgw7mnCRMTbtAWkHa658k.mp4'),
    ],
  },
  {
    id: 'holy-paris',
    year: '2026',
    title: 'The Holy Art — Paris',
    gallery: 'The Holy Art',
    place: 'Paris, France',
    kind: 'group',
    category: 'physical',
    images: [...HOLY_PARIS_IMAGES],
    galleryImages: [
      holyParisGalleryJournal(),
      holyParisGalleryJournal(2),
      holyParisGalleryJournal(4),
      holyParisGalleryJournal(6),
      holyParisGalleryJournal(7),
      holyParisGalleryJournal(8),
      holyParisGalleryJournal(9),
    ],
  },
  {
    id: 'holy-london',
    year: '2026',
    title: 'The Holy Art — London',
    gallery: 'The Holy Art',
    place: 'London, UK',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/holy-london/holy-london-1.jpg',
      '/media/exhibitions/holy-london/holy-london-2.jpg',
      '/media/exhibitions/holy-london/holy-london-placeholder-3.jpg',
      '/media/exhibitions/holy-london/holy-london-placeholder-4.jpg',
    ],
    galleryImages: [
      holyLondonGalleryJournal(14),
      holyLondonGalleryJournal(17),
      holyLondonGalleryJournal(19),
      holyLondonGalleryJournal(20),
      holyLondonGalleryJournal(21),
      holyLondonGalleryJournal(22),
      holyLondonGalleryJournal(25),
      holyLondonGalleryJournal(26),
      holyLondonGalleryJournal(27),
    ],
  },
  {
    id: 'luna',
    year: '2025',
    title: 'Luna Grande Art',
    gallery: 'Luna Grande Art',
    place: 'Istanbul, Turkey',
    kind: 'group',
    category: 'physical',
    images: [
      exhibitionPoster('Istanbul Art Show.jpg'),
      '/media/exhibitions/luna/luna-main.jpg',
      '/media/exhibitions/luna/luna-1.jpg',
      '/media/exhibitions/luna/luna-2.jpg',
      '/media/exhibitions/luna/luna-placeholder-4.jpg',
    ],
    galleryImages: [
      exGallery('luna', '612055407_17906287035300192_5021257629024911006_n.webp'),
      exGallery('luna', '612472749_17906730204300192_3385564492688447115_n.jpg'),
      exGallery('luna', '613657185_17906730201300192_8900950335141590506_n.jpg'),
      exGallery('luna', '614901475_17906730159300192_6536720511991204364_n.jpg'),
      exGallery('luna', '615016919_17906730213300192_4583022350825479870_n.jpg'),
      exGallery('luna', '615381305_17906730168300192_8600490978590841302_n.jpg'),
    ],
  },
  {
    id: 'ahmad-shariff',
    year: '2025',
    title: 'Ahmad Shariff Gallery',
    gallery: 'Ahmad Shariff Gallery',
    place: 'Claremont, California',
    kind: 'group',
    category: 'physical',
    images: [
      exhibitionPoster('Ahmad Shariff.jpg'),
      '/media/exhibitions/ahmad-shariff/ahmad-shariff-placeholder-1.jpg',
      '/media/exhibitions/ahmad-shariff/ahmad-shariff-placeholder-2.jpg',
      '/media/exhibitions/ahmad-shariff/ahmad-shariff-placeholder-3.jpg',
      '/media/exhibitions/ahmad-shariff/ahmad-shariff-placeholder-4.jpg',
    ],
    links: {
      website: 'https://www.ahmadshariffgallery.com/',
    },
    galleryImages: [
      exGallery('ahmad-shariff', 'unnamed.jpg'),
      exGallery('ahmad-shariff', 'unnamed (1).jpg'),
      exGallery('ahmad-shariff', 'unnamed (3).jpg'),
      exGallery('ahmad-shariff', 'unnamed (6).jpg'),
      exGallery('ahmad-shariff', 'unnamed (8).jpg'),
      exGallery('ahmad-shariff', 'unnamed (10).jpg'),
      exGallery('ahmad-shariff', 'unnamed (11).jpg'),
    ],
  },
  {
    id: 'hechyeomoyeo-13',
    year: '2025',
    title: 'HCMY 13',
    gallery: 'HCMY',
    place: 'New York, USA',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/hechyeomoyeo-13/hech-3.jpg',
      '/media/exhibitions/hechyeomoyeo-13/hech-4.jpg',
      '/media/exhibitions/hechyeomoyeo-13/hechyeomoyeo-13-placeholder-3.jpg',
      '/media/exhibitions/hechyeomoyeo-13/hechyeomoyeo-13-placeholder-4.jpg',
    ],
    galleryImages: [
      exMedia('hechyeomoyeo-13', '622425943_18551201602044854_3078568027569955925_n.jpg'),
      exMedia('hechyeomoyeo-13', 'AQOsWP1wuB76-TWuCjUihIpYn713e2pOgy4KJ0Y-4YPyePpVNxeANIRgBHMpsrPeNqAFF3o0Guo1SU6-WYtMm4lc.mp4'),
      exMedia('hechyeomoyeo-13', 'AQP3Ly0b7GkGZF_GFXdR1cwJ5PbDKyhKzlUg-rfwO3HFXyalZNuztaMVQcmsi7eZARbB3cWYdsQhzZ4y4OIeqAZFcZAzFjLJmXj8UHM.mp4'),
      exMedia('hechyeomoyeo-13', 'AQP3sqdHKENiUrMFWBIzYYdpLWDBvQTI7fs6QHrFyE9MnFeGyU1jRvCsfvjvXJ0iwtCptkZuhOYPx3OblbjOjkyfib81LRvX8X3NBk4.mp4'),
      exMedia('hechyeomoyeo-13', 'AQPXIkXG8iGoCVNJsH5bUhYymTp6lpQ4jzTFUceIV8qHsfCW-hxCqcnWsWRnFpaOeHPoXp-lorKZRHCeomLVpg6Ht4cEhbiXIlxnrAo.mp4'),
    ],
  },
  {
    id: 'hechyeomoyeo-12',
    year: '2025',
    title: 'HCMY 12',
    gallery: 'Living Gallery',
    place: 'Brooklyn, New York, USA',
    kind: 'group',
    category: 'physical',
    images: [
      exhibitionPoster('HCMY 12.jpg'),
      '/media/exhibitions/hechyeomoyeo-12/hechyeomoyeo-nyc.JPG',
      '/media/exhibitions/hechyeomoyeo-12/hech-1.jpg',
      '/media/exhibitions/hechyeomoyeo-12/hech-2.jpg',
      '/media/exhibitions/hechyeomoyeo-12/hechyeomoyeo-12-placeholder-4.jpg',
    ],
    galleryImages: [
      exGallery('hechyeomoyeo-12', 'IMG_0298.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0625.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0639.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0685.jpg'),
      exGallery('hechyeomoyeo-12', 'IMG_0700.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0710.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0730 (1).JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_0743.jpg'),
      exGallery('hechyeomoyeo-12', 'IMG_9965.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_9968.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_9979.JPG'),
      exGallery('hechyeomoyeo-12', 'IMG_9993.JPG'),
    ],
  },
  {
    id: 'soul-gift',
    year: '2026',
    title: 'Soul Gift',
    gallery: 'Clover Gallery',
    place: 'Virtual Exhibition',
    kind: 'group',
    category: 'digital',
    images: ['/media/virtual/clover-anna.jpg', '/media/virtual/soul-gift.jpg', '/media/virtual/soul-gift-poster.png'],
  },
  {
    id: 'the-atrium',
    year: '2026',
    title: 'The Atrium',
    gallery: 'The Atrium',
    place: 'Virtual Exhibition',
    kind: 'group',
    category: 'digital',
    images: ['/media/virtual/the-atrium.jpg'],
  },
  {
    id: 'wildscape',
    year: 'Ongoing',
    title: 'Wildscape Literary Journal',
    gallery: 'Wildscape Literary Journal',
    place: 'Ongoing',
    category: 'magazine',
    images: ['/media/the-fish.png'],
    links: {
      website: 'https://wildscapelit.com/',
      magazineLabel: 'Ongoing',
      artwork: 'The Fish',
    },
  },
  {
    id: 'astraeazine',
    year: '2025',
    title: 'Astraeazine',
    gallery: 'Issue Eight — Dreamscape',
    place: 'Astraea Zine',
    category: 'magazine',
    images: ['/media/the-fish.png', '/media/souls-and-leavings.jpg'],
    links: {
      website: 'https://www.instagram.com/astraeazine/',
      magazine: 'https://www.astraeazine.com/issue-eight',
      issue: 'Issue Eight — Dreamscape',
      artwork: 'The Fish and Souls of Leavings',
    },
  },
  {
    id: 'hush-magazine',
    year: '2025',
    title: 'Hush Magazine',
    gallery: 'Hush Magazine',
    place: 'Issue 001 — LOST//FOUND',
    category: 'magazine',
    images: ['/media/souls-and-leavings.jpg'],
    links: {
      website: 'https://hushmag.co.uk/',
      magazine: 'https://hushmag.co.uk/collections/all',
      issue: 'ISSUE 001 LOST//FOUND SUBMISSION',
      artwork: 'Souls of Leavings',
    },
  },
  {
    id: 'spellbinder',
    year: '2026',
    title: 'Spellbinder Magazine',
    gallery: 'Spellbinder Magazine',
    place: 'Spring 2026',
    category: 'magazine',
    images: ['/media/souls-and-leavings.jpg'],
    links: {
      website: 'https://www.spellbindermag.com/',
      magazine: 'https://www.spellbindermag.com/issues/spring-2026/',
      issue: 'Spring Issue',
      artwork: 'Souls of Leavings',
    },
  },
];

export const magazines = [
  { title: 'Wildscape Literary Journal', issue: 'Ongoing', feature: 'The Fish', image: '/media/the-fish.png' },
  { title: 'Astraeazine', issue: 'Issue Eight — Dreamscape', feature: 'The Fish and Souls of Leavings', image: '/media/the-fish.png' },
  { title: 'Hush Magazine', issue: 'Issue 001 — LOST//FOUND', feature: 'Souls of Leavings', image: '/media/souls-and-leavings.jpg' },
  { title: 'Spellbinder Magazine', issue: 'Spring 2026', feature: 'Souls of Leavings', image: '/media/souls-and-leavings.jpg' },
];

export const iiif = (id: string) => `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;

export const exhibitions = [
  { image: "/media/exhibitions/senses/senses-main.jpg", title: "Senses International Art Fair", year: "2025", location: "MUST MUSEUM, LECCE, ITALY", subtitle: "3RD EDITION – INTERNATIONAL ART FAIR" },
  { image: "/media/exhibitions/venice/venice-1.jpg", title: "Contemporary Venice", year: "2026", location: "VENICE, ITALY", subtitle: "CONTEMPORARY VENICE 2026" },
  { image: exhibitionPoster('HCMY 12.jpg'), title: "HCMY 12", year: "2025", location: "LIVING GALLERY, BROOKLYN, NEW YORK", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/hechyeomoyeo-13/hech-3.jpg", title: "HCMY 13", year: "2025", location: "NEW YORK, USA", subtitle: "GROUP EXHIBITION" },
  { image: exhibitionPoster('Ahmad Shariff.jpg'), title: "Ahmad Shariff Gallery", year: "2025", location: "CLAREMONT, CALIFORNIA", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/kinship/kinship-main.png", title: "KINSHIP × HCMY", year: "2025", location: "SEOUL, SOUTH KOREA", subtitle: "COLLABORATIVE EXHIBITION" },
  { image: exhibitionPoster('Vergr Gallery.jpg'), title: "DIMO × Verger Gallery", year: "2025", location: "5TH EXHIBITION", subtitle: "VERGER GALLERY COLLABORATION" },
  { image: "/media/exhibitions/holy-london/holy-london-1.jpg", title: "The Holy Art – London", year: "2026", location: "LONDON, UK", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: holyParisJournal(1), title: "The Holy Art – Paris", year: "2026", location: "PARIS, FRANCE", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: exhibitionPoster('Istanbul Art Show.jpg'), title: "Luna Grande Art", year: "2025", location: "ISTANBUL, TURKEY", subtitle: "FEATURED ARTIST SHOWCASE" },
  { image: exhibitionPoster('im insa.jpg'), title: "IM INSA", year: "2025", location: "INSADONG, SEOUL", subtitle: "SOLO EXHIBITION" },
];

export interface ExhibitionItem {
  year: string;
  title: string;
  venue: string;
  city: string;
  country: string;
}

export const soloExhibitions: ExhibitionItem[] = [
  { year: "2025", title: "IM INSA", venue: "Insadong", city: "Seoul", country: "South Korea" },
];

export const groupExhibitions: ExhibitionItem[] = [
  { year: "2026", title: "Contemporary Venice", venue: "Venice", city: "Venice", country: "Italy" },
  { year: "2025", title: "Senses International Art Fair", venue: "Must Museum", city: "Lecce", country: "Italy" },
  { year: "2025", title: "HCMY 13", venue: "New York", city: "New York", country: "USA" },
  { year: "2025", title: "HCMY 12", venue: "Living Gallery", city: "Brooklyn", country: "USA" },
  { year: "2025", title: "Ahmad Shariff Gallery", venue: "Ahmad Shariff Gallery", city: "Claremont", country: "USA" },
  { year: "2025", title: "KINSHIP × HCMY", venue: "Seoul", city: "Seoul", country: "South Korea" },
  { year: "2026", title: "The Holy Art — Paris", venue: "Paris", city: "Paris", country: "France" },
  { year: "2026", title: "The Holy Art — London", venue: "London", city: "London", country: "UK" },
  { year: "2025", title: "DIMO × Verger Gallery", venue: "Verger Gallery", city: "Seoul", country: "South Korea" },
  { year: "2025", title: "Luna Grande Art", venue: "Luna Grande Art", city: "Istanbul", country: "Turkey" },
];

export interface PublicationItem {
  type: 'book' | 'essay';
  author: string;
  title: string;
  publisher: string;
  year: string;
}

export const publications: PublicationItem[] = [];

export interface LinkItem {
  title: string;
  href: string;
  year?: string;
}

/** Publications & writing — external links. */
export const publicationLinks: LinkItem[] = [
  {
    title: 'Aetherium Literary Blog — Magazine',
    href: 'https://www.instagram.com/aetheriumliterary/',
  },
  {
    title: 'Seventeenth Edition of Otherwise Engaged Literature and Arts Journal',
    href: 'https://www.marziadessi.com/otherwise-engaged',
  },
];

/** External press coverage and exhibition listings. */
export const pressLinks: LinkItem[] = [
  {
    title: 'HCMY — In the Press',
    href: 'https://www.hcmy.org/press',
    year: '2025',
  },
  {
    title: 'Light that Remains — Verger Gallery',
    href: 'https://www.vergerartgallery.com/25/?bmode=view&idx=163639384',
    year: '2025',
  },
  {
    title: 'Itaewon Film Festival Challenges Boundaries That Define, Divide Us — The Korea Times',
    href: 'https://www.koreatimes.co.kr/southkorea/globalcommunity/20251031/itaewon-film-festival-challenges-boundaries-that-define-divide-us',
    year: '2025',
  },
];

/** Published articles and commentary — PR & academic research links. */
export const researchLinks: LinkItem[] = [
  {
    title: 'Micro-Influencer Marketing Guide: Benefits and Steps — Influencer Marketing Hub',
    href: 'https://influencermarketinghub.com/micro-influencer-marketing-guide/#toc-6',
    year: '2024',
  },
  {
    title: 'How do you incorporate storytelling into your advertising strategies, and why do you believe it is important for connecting with customers? Share an example of a successful storytelling campaign. — Grit Daily',
    href: 'https://gritdaily.com/the-role-of-storytelling-in-advertising/',
    year: '2024',
  },
  {
    title: 'What is one trend in B2C e-commerce marketing that has really taken off recently, and what can marketers do to leverage this? — FC',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2024/10/01/10-emerging-trends-in-b2c-e-commerce-marketers-can-leverage/',
    year: '2024',
  },
  {
    title: 'Influencer Marketing Trends Predictions Through The End Of 2024 — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2024/09/17/influencer-marketing-trends-predictions-through-the-end-of-2024/',
    year: '2024',
  },
  {
    title: 'De-Influencing Trends: How Brands Can Maintain Consumer Trust — Net Influencer',
    href: 'https://www.netinfluencer.com/the-rise-of-de-influencing-how-brands-can-maintain-consumer-trust/',
    year: '2024',
  },
  {
    title: 'What Tools or Platforms Are Indispensable for PR and Communications? — Forbes',
    href: 'https://prthrive.com/qa/what-tools-or-platforms-are-indispensable-for-pr-and-communications/',
    year: '2024',
  },
  {
    title: 'What To Know About Generation Alpha And Influencer Marketing — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2024/06/17/what-to-know-about-generation-alpha-and-influencer-marketing/',
    year: '2024',
  },
  {
    title: 'How To Successfully Enter A New Market With Influencer Marketing — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2024/04/22/how-to-successfully-enter-a-new-market-with-influencer-marketing/',
    year: '2024',
  },
  {
    title: 'The Power Of Influencer Marketing: Your Strategic Investment For Success — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2024/01/05/the-power-of-influencer-marketing-your-strategic-investment-for-success/',
    year: '2024',
  },
  {
    title: 'The Power Of Livestream Social Commerce — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2023/07/14/the-power-of-livestream-social-commerce/',
    year: '2023',
  },
  {
    title: 'Social Responsibility And Ethics In Influencer Marketing — Forbes',
    href: 'https://www.forbes.com/councils/forbesagencycouncil/2023/01/30/social-responsibility-and-ethics-in-influencer-marketing/',
    year: '2023',
  },
  {
    title: 'The Hype Factory And Breakthrough Innovations: This Week In Tech History — Forbes',
    href: 'https://www.forbes.com/sites/gilpress/2016/07/24/the-hype-factory-and-breakthrough-innovations-this-week-in-tech-history/?ctpv=searchpage',
    year: '2016',
  },
];

export interface ResearchItem {
  title: string;
  journal?: string;
  year: string;
}

export const researchPapers: ResearchItem[] = [];

export const grantsAndFellowships: { title: string; year: string; description: string }[] = [];

export const residencies: { title: string; location: string; year: string }[] = [];

export const igamingLinks: LinkItem[] = [
  { title: 'Betting Basics: History and Theory of Sports Betting For Beginners', href: 'https://docs.google.com/document/d/1lX8PlTWeCRW1mXVMHVvkxxXFwTrU4TcU5JPrIECcf1M/edit?usp=sharing', year: 'SEO' },
  { title: 'Promo Codes from Betting Brokerages: How to Get Free Money?', href: 'https://docs.google.com/document/d/1s71koJKWq0a__3JTJqUG9LsEPRIap_PNZl2ZJNm3Lpw/edit?usp=sharing', year: 'Promo' },
  { title: 'How To Use Sportcashback', href: 'https://docs.google.com/document/d/1Zi61E_JhREK7-DDiGQpzCDa2Xn5TYDSfZqSN771ZTdc/edit?usp=sharing', year: 'Cashback' },
  { title: 'Choosing the Best Bookmaker: Analysis and Benefits of Comparison Table', href: 'https://docs.google.com/document/d/1_sQCEh6cIEaP_kPl6ILQ2UVGhgGvekeE246hXlGezXI/edit?usp=sharing', year: 'Tools' },
  { title: 'MyBookie Vs. BetOBet: Who Has the Top Sports Betting Odds and Casino?', href: 'https://docs.google.com/document/d/1JVgunzzBYBhWnOC6kL3EBh9LVRDJuTddMLub05n-NTs/edit?usp=sharing', year: 'Tools' },
  { title: 'Basketball NBA HG — Best Stat Lines from NBA 2022 Summer League', href: 'https://docs.google.com/document/d/1q4EHhQuHNMChzfx_hjsUTnMKhOb94Bur9uwzDRIFv68/edit?usp=sharing', year: 'HG' },
  { title: "Basketball NBA HG — Net's Best Free-Agent Signings in the NBA", href: 'https://docs.google.com/document/d/1af0S2XxW_cvl9shVUntWB55WLiEmb-7uZjcyVxN3ffo/edit?usp=sharing', year: 'HG' },
  { title: 'The NFL Lists the Big Events for 2022 Game Season', href: 'https://docs.google.com/document/d/1sSMm8hp_oT7KV0KA2biBPxWJsHk5yNRnEyTWXlA9crw/edit?usp=sharing', year: 'HG' },
  { title: 'REVIEW: Savaspin Casino Login — Play At Sava Spin Casino Website', href: 'https://docs.google.com/document/d/1zgsVYiKp5V_d1BApWaUJSL0FjEBYEJPyJZtxpuqLJDc/edit?usp=sharing', year: 'Review' },
  { title: 'Oscarspin Casino — The Best Online Casino in IT', href: 'https://docs.google.com/document/d/17e3fVwwZ8C8IUNllF7OlDbclYBoT9gR93fD4hO3vaCk/edit?usp=sharing', year: 'Review' },
  { title: 'Bet365: Your Ultimate Destination for Online Betting', href: 'https://docs.google.com/document/d/17e3fVwwZ8C8IUNllF7OlDbclYBoT9gR93fD4hO3vaCk/edit?usp=sharing', year: 'Review' },
  { title: 'Review of the SportyBet', href: 'https://docs.google.com/document/d/1-ES3clhGMYXupBIdOxCEfCzM7d8qFlNlHx2HnuqU7PQ/edit?usp=sharing', year: 'Review' },
  { title: 'Bet365 vs 1xbet', href: 'https://docs.google.com/document/d/1qf9mrZveax5ddn8GQmWhUQuYI6tupqwpIRgsOreyykQ/edit?usp=sharing', year: 'Review' },
];

export const uplatformLinks: LinkItem[] = [
  { title: 'The Gen Z Effect: The Fall of Traditional iGaming Funnels', href: 'https://uplatform.com/news/the-gen-z-effect-the-fall-of-traditional-igaming-funnels', year: 'Blog' },
  { title: 'Mastering Esports Betting: Crafting Your Winning Website', href: 'https://uplatform.com/news/mastering-esports-betting-crafting-your-winning-website', year: 'Blog' },
  { title: 'Stop Guessing, Start Mapping: Customer Journey Map (CJM) is the Key', href: 'https://uplatform.com/news/stop-guessing-start-mapping-customer-journey-map-cjm-is-the-key', year: 'Blog' },
  { title: "Level Up in Romania: The Operator's Ultimate Market Entry Guide", href: 'https://uplatform.com/news/igaming-business-in-romania-the-operator-s-ultimate-market-entry-guide', year: 'Blog' },
  { title: 'Mastering Customer Journey Mapping: 4 Pitfalls to Avoid', href: 'https://uplatform.com/news/mastering-customer-journey-mapping-4-pitfalls-to-avoid', year: 'Blog' },
  { title: 'The Future of Personalization: Crafting Player-Centric Experiences in iGaming', href: 'https://uplatform.com/news/the-future-of-personalization-player-centric-experiences-in-igaming', year: 'Blog' },
  { title: 'How Seamless Onboarding Can Turbocharge Your Conversion Rates', href: 'https://uplatform.com/news/how-seamless-onboarding-can-turbocharge-your-conversion-rates', year: 'Blog' },
  { title: "Swipe Right on Profits: Why Operators Shouldn't Ignore Valentine's Day", href: 'https://uplatform.com/news/swipe-right-on-profits-why-operators-shouldn-t-ignore-valentine-s-day', year: 'Blog' },
  { title: "Unleash Data's Power: The Smart Operator's Guide", href: 'https://uplatform.com/news/unleash-data-s-power-the-smart-operator-s-guide', year: 'Blog' },
  { title: 'The Impact of Music in Casino Games: Shaping the Player Experience', href: 'https://uplatform.com/news/the-impact-of-music-in-casino-games-shaping-the-player-experience', year: 'Blog' },
  { title: 'Nostalgia in Marketing: Why Retro Appeals Work in iGaming', href: 'https://uplatform.com/news/nostalgia-in-marketing-why-retro-appeals-work-in-igaming', year: 'Blog' },
  { title: 'The Thrill of the Game: The Growing Value of In-Play (Live) Betting', href: 'https://uplatform.com/news/the-growing-value-of-in-play-betting', year: 'Blog' },
  { title: "Lunar New Year Marketing Secrets: Unlocking the Snake's Power", href: 'https://uplatform.com/news/lunar-new-year-marketing-secrets-unlocking-the-snake-s-power', year: 'Blog' },
  { title: "The Uplatform Gift Guide: Ho-Ho-Holiday Bonuses and Promotions Galore!", href: 'https://uplatform.com/news/ho-ho-holiday-bonuses-and-promotions-galore', year: 'Blog' },
  { title: "Love is in the Reels: The Top Valentine's Day Slots to Fall For", href: 'https://uplatform.com/news/love-is-in-the-reels-the-top-valentine-s-day-slots-to-fall-for', year: 'Blog' },
  { title: 'iGaming Assemble: Mastering the Infinity Quest of Hyper-Localization', href: 'https://uplatform.com/news/igaming-localization-assemble-your-powers-for-the-infinity-quest', year: 'Blog' },
  { title: 'How to Cross-Sell Successfully: Sportsbook in Casino Operations', href: 'https://uplatform.com/news/how-to-cross-sell-successfully-sportsbook-in-casino-operations', year: 'Blog' },
  { title: "Santa's Workshop Secrets: Unwrapping Uplatform's Team Magic", href: 'https://uplatform.com/news/santas-workshop-secrets', year: 'Blog' },
  { title: 'The Ultimate iGaming Playlist for B2B Success', href: 'https://uplatform.com/news/the-ultimate-igaming-playlist-for-b2b-success', year: 'Blog' },
  { title: "Cracking the Code: A Guide to Understanding Sports Betting Views", href: 'https://uplatform.com/news/cracking-the-code-a-guide-to-understanding-sports-betting-views', year: 'Blog' },
  { title: "SMS & Telegram Betting: iGaming's Hidden Goldmine", href: 'https://uplatform.com/news/sms-telegram-betting-igaming-s-hidden-goldmine', year: 'Blog' },
  { title: 'Ready for a Blooming Surprise at ICE Barcelona 2026?', href: 'https://uplatform.com/news/ready-for-a-blooming-surprise-at-ice-barcelona-2026', year: 'Press' },
  { title: 'Celebrate the Season with Us!', href: 'https://uplatform.com/news/celebrate-the-season-with-us', year: 'Press' },
  { title: "Find Your Inner Football Star: Kick Off with Uplatform's UEFA 2024 Quiz!", href: 'https://uplatform.com/news/find-your-inner-football-star-kick-off-2024-quiz', year: 'Press' },
  { title: 'Unlocking the Thrills: U_Lead Our Odyssey at SiGMA Asia 2024', href: 'https://uplatform.com/news/unlocking-the-thrills-ulead-our-odyssey-at-sigma-asia-2024', year: 'Press' },
  { title: 'U_Lead the Game! Uplatform Takes Center Stage at SiGMA Asia 2024', href: 'https://uplatform.com/news/ulead-the-game-uplatform-takes-center-stage-at-sigma-asia-2024', year: 'Press' },
  { title: "Let's Make U_Shine with Uplatform at SiGMA Europe 2024", href: 'https://docs.google.com/document/d/1AvI5mOsgNWE6rW_MMw3geSuofXXNfyxuVIqq0tmqr1Q/edit?usp=sharing', year: 'Press' },
  { title: "Uplatform's Latvian iGaming License Acquisition Journey", href: 'https://docs.google.com/document/d/1Mkz1IGtHvCaG7JpigsymQOAFbXLEa1lSQ4A0wrpn_Nk/edit?usp=sharing', year: 'Press' },
  { title: 'U_Rule with Uplatform at iGB L!VE 2024', href: 'https://docs.google.com/document/d/1-sFDsVcayzcRtTanr89GCwClbH7mSe27MWKEHzoywdo/edit?usp=sharing', year: 'Press' },
  { title: 'Join Uplatform at G2E Asia 2024 to See How U_Profit in Asia!', href: 'https://docs.google.com/document/d/1KjKtRPW8lNQA3ZpeReSSwF1fFNwytM8MpclbpGzi8so/edit?usp=sharing', year: 'Press' },
  { title: 'Supercharge Your Gains: Discover How U_Profit with Uplatform at G2E Asia 2024!', href: 'https://docs.google.com/document/d/1dYRkAj9DkvezhGhfQbPDDPOuM_VELM3TqRLLXickuc8/edit?usp=sharing', year: 'Press' },
];
