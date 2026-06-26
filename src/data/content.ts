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
  images: string[];
  note?: string;
  links?: ExhibitionLinks;
}

/** Chronological exhibition list — posters & venue imagery only (no personal portraits). */
export const exhibitionEntries: ExhibitionEntry[] = [
  {
    id: 'senses',
    year: '2025',
    title: 'Senses International Art Fair',
    gallery: 'MUST Museum',
    place: 'Lecce, Italy',
    kind: 'museum',
    category: 'physical',
    images: ['/media/exhibitions/senses-main.jpg', '/media/exhibitions/senses-1.jpg', '/media/exhibitions/senses-2.jpg'],
    note: 'The only museum presentation in the exhibition record.',
  },
  {
    id: 'im-insa',
    year: '2025',
    title: 'IM INSA',
    gallery: 'Insadong',
    place: 'Seoul, South Korea',
    kind: 'solo',
    category: 'physical',
    images: ['/media/exhibitions/im-insa.jpg'],
  },
  {
    id: 'hechyeomoyeo-nyc',
    year: '2024–2025',
    title: 'Hechyeomoyeo 12 & 13',
    gallery: 'Hechyeomoyeo',
    place: 'New York, USA',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/hechyeomoyeo-nyc.png', '/media/exhibitions/hech-1.jpg', '/media/exhibitions/hech-2.jpg', '/media/exhibitions/hech-3.jpg', '/media/exhibitions/hech-4.jpg'],
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × Hechyeomoyeo',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/kinship-main.png', '/media/exhibitions/kinship-1.jpg', '/media/exhibitions/kinship-2.jpg', '/media/exhibitions/kinship-3.jpg'],
  },
  {
    id: 'dimo',
    year: '2025',
    title: 'DIMO × Verger Gallery',
    gallery: 'Verger Gallery',
    place: 'Seoul, South Korea',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/dimo-main.jpg', '/media/exhibitions/dimo-1.jpg', '/media/exhibitions/dimo-2.jpg'],
  },
  {
    id: 'holy-paris',
    year: '2025',
    title: 'The Holy Art — Paris',
    gallery: 'The Holy Art',
    place: 'Paris, France',
    kind: 'group',
    category: 'physical',
    images: ['/media/posters/paris-poster.png', '/media/exhibitions/holy-paris-main.jpg', '/media/exhibitions/holy-paris-1.webp'],
  },
  {
    id: 'holy-london',
    year: '2025',
    title: 'The Holy Art — London',
    gallery: 'The Holy Art',
    place: 'London, UK',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-london-1.jpg', '/media/exhibitions/holy-london-2.jpg'],
    note: 'Exhibition documentation & promotional materials.',
  },
  {
    id: 'luna',
    year: '2025',
    title: 'Luna Grande Art',
    gallery: 'Luna Grande Art',
    place: 'Online',
    kind: 'group',
    category: 'digital',
    images: ['/media/exhibitions/luna-main.jpg', '/media/exhibitions/luna-1.jpg', '/media/exhibitions/luna-2.jpg'],
  },
  {
    id: 'venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/venice-1.jpg', '/media/exhibitions/venice-2.jpg', '/media/exhibitions/venice-3.jpg', '/media/exhibitions/venice-4.jpg', '/media/exhibitions/venice-5.jpg'],
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
    note: 'Virtual exhibition at Clover Gallery — digital and material realities.',
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
    note: 'A virtual space exploring architectural memory and digital presence.',
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
    images: ['/media/posters/poster-1.jpg'],
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
    images: ['/media/posters/nana-nyc.jpg'],
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
    images: ['/media/posters/paris-poster.png'],
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
  { title: 'Astraeazine', issue: 'Issue Eight — Dreamscape', feature: 'The Fish and Souls of Leavings', image: '/media/posters/poster-1.jpg' },
  { title: 'Hush Magazine', issue: 'Issue 001 — LOST//FOUND', feature: 'Souls of Leavings', image: '/media/posters/nana-nyc.jpg' },
  { title: 'Spellbinder Magazine', issue: 'Spring 2026', feature: 'Souls of Leavings', image: '/media/posters/paris-poster.png' },
];

export const iiif = (id: string) => `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;

export const exhibitions = [
  { image: "/media/exhibitions/senses-main.jpg", title: "Senses International Art Fair", year: "2025", location: "MUST MUSEUM, LECCE, ITALY", subtitle: "3RD EDITION – INTERNATIONAL ART FAIR" },
  { image: "/media/exhibitions/venice-1.jpg", title: "Contemporary Venice", year: "2026", location: "VENICE, ITALY", subtitle: "CONTEMPORARY VENICE 2026" },
  { image: "/media/exhibitions/hechyeomoyeo-nyc.png", title: "Hechyeomoyeo 12 & 13", year: "2024–2025", location: "NEW YORK, USA", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/kinship-main.png", title: "KINSHIP × Hechyeomoyeo", year: "2025", location: "SEOUL, SOUTH KOREA", subtitle: "COLLABORATIVE EXHIBITION" },
  { image: "/media/exhibitions/dimo-main.jpg", title: "DIMO × Verger Gallery", year: "2025", location: "5TH EXHIBITION", subtitle: "VERGER GALLERY COLLABORATION" },
  { image: "/media/exhibitions/holy-london-1.jpg", title: "The Holy Art – London", year: "2025", location: "LONDON, UK", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: "/media/exhibitions/holy-paris-main.jpg", title: "The Holy Art – Paris", year: "2025", location: "PARIS, FRANCE", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: "/media/exhibitions/luna-main.jpg", title: "Luna Grande Art", year: "2025", location: "ONLINE", subtitle: "FEATURED ARTIST SHOWCASE" },
  { image: "/media/exhibitions/im-insa.jpg", title: "IM INSA", year: "2025", location: "INSADONG, SEOUL", subtitle: "SOLO EXHIBITION" },
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
  { year: "2024–2025", title: "Hechyeomoyeo 12 & 13", venue: "New York", city: "New York", country: "USA" },
  { year: "2025", title: "KINSHIP × Hechyeomoyeo", venue: "Seoul", city: "Seoul", country: "South Korea" },
  { year: "2025", title: "The Holy Art — London", venue: "London", city: "London", country: "UK" },
  { year: "2025", title: "The Holy Art — Paris", venue: "Paris", city: "Paris", country: "France" },
  { year: "2025", title: "DIMO × Verger Gallery", venue: "Verger Gallery", city: "Seoul", country: "South Korea" },
  { year: "2025", title: "Luna Grande Art", venue: "Online", city: "", country: "" },
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

/** External press coverage and exhibition listings. */
export const pressLinks: LinkItem[] = [
  {
    title: 'Hechyeomoyeo — In the Press',
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

export interface ResearchItem {
  title: string;
  journal?: string;
  year: string;
}

export const researchPapers: ResearchItem[] = [];

export const grantsAndFellowships: { title: string; year: string; description: string }[] = [];

export const residencies: { title: string; location: string; year: string }[] = [];
