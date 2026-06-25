export type ExhibitionCategory = 'physical' | 'digital' | 'magazine';

export interface ExhibitionEntry {
  id: string;
  year: string;
  title: string;
  gallery: string;
  place: string;
  category: ExhibitionCategory;
  images: string[];
}

export interface LinkItem {
  title: string;
  href: string;
  year?: string;
}

/** Senses first, then alphabetical by title. No 2024-dated exhibitions. */
export const exhibitionEntries: ExhibitionEntry[] = sortExhibitions([
  {
    id: 'senses',
    year: '2025',
    title: 'Senses International Art Fair',
    gallery: 'MUST Museum',
    place: 'Lecce, Italy',
    category: 'physical',
    images: ['/media/exhibitions/senses-main.jpg', '/media/exhibitions/senses-1.jpg', '/media/exhibitions/senses-2.jpg'],
  },
  {
    id: 'contemporary-venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    category: 'physical',
    images: ['/media/exhibitions/venice-1.jpg', '/media/exhibitions/venice-2.jpg', '/media/exhibitions/venice-3.jpg', '/media/exhibitions/venice-4.jpg', '/media/exhibitions/venice-5.jpg'],
  },
  {
    id: 'dimo',
    year: '2025',
    title: 'DIMO × Verger Gallery',
    gallery: 'Verger Gallery',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: ['/media/press/light-that-remains.jpg', '/media/exhibitions/dimo-main.jpg', '/media/exhibitions/dimo-1.jpg', '/media/exhibitions/dimo-2.jpg'],
  },
  {
    id: 'hechyeomoyeo-13',
    year: '2025',
    title: 'Hechyeomoyeo 13',
    gallery: 'The Living Gallery',
    place: 'New York, USA',
    category: 'physical',
    images: ['/media/press/nyc-hcmy.jpg'],
  },
  {
    id: 'hechyeomoyeo-14',
    year: '2026',
    title: 'Hechyeomoyeo 14',
    gallery: 'Chinatown Garden',
    place: 'Washington, DC, USA',
    category: 'physical',
    images: [
      '/media/exhibitions/hech-1.jpg',
      '/media/exhibitions/hech-2.jpg',
      '/media/exhibitions/hech-3.jpg',
      '/media/exhibitions/hech-4.jpg',
      '/media/exhibitions/hechyeomoyeo-nyc.png',
    ],
  },
  {
    id: 'hechyeomoyeo-mexico',
    year: '2025',
    title: 'Hechyeomoyeo Mexico',
    gallery: 'Tnumbra Gallery',
    place: 'Mexicali, Mexico',
    category: 'physical',
    images: [
      '/media/exhibitions/hech-mexico-1.jpg',
      '/media/exhibitions/hech-mexico-2.jpg',
      '/media/exhibitions/hech-mexico-3.jpg',
      '/media/exhibitions/hech-mexico-4.jpg',
      '/media/exhibitions/hech-mexico-5.jpg',
    ],
  },
  {
    id: 'im-insa',
    year: '2025',
    title: 'IM INSA',
    gallery: 'Insadong',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: ['/media/press/with-iam-insa.jpg', '/media/exhibitions/im-insa.jpg'],
  },
  {
    id: 'itaewon-film-festival',
    year: '2025',
    title: 'Itaewon Film Festival',
    gallery: 'Bokwang Theater',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: ['/media/press/itaewon-film-festival.png', '/media/feature/itaewon-film-fest.jpg', '/media/feature/itaewon-1.jpg', '/media/feature/itaewon-2.jpg'],
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × Hechyeomoyeo',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: ['/media/exhibitions/kinship-main.png', '/media/exhibitions/kinship-1.jpg', '/media/exhibitions/kinship-2.jpg', '/media/exhibitions/kinship-3.jpg'],
  },
  {
    id: 'luna',
    year: '2025',
    title: 'Luna Grande Art',
    gallery: 'Luna Grande Art',
    place: 'Istanbul, Turkey',
    category: 'digital',
    images: ['/media/press/istanbul-art-show.jpg', '/media/exhibitions/luna-main.jpg', '/media/exhibitions/luna-1.jpg', '/media/exhibitions/luna-2.jpg'],
  },
  {
    id: 'petit-masterpiece',
    year: '2025',
    title: 'PETIT Masterpiece',
    gallery: 'Ahmad Shariff Art Gallery',
    place: 'Claremont, California, USA',
    category: 'physical',
    images: ['/media/press/petit-masterpiece.jpg'],
  },
  {
    id: 'soul-gift',
    year: '2026',
    title: 'Soul Gift',
    gallery: 'Clover Gallery',
    place: 'Virtual Exhibition',
    category: 'digital',
    images: ['/media/virtual/clover-anna.jpg', '/media/virtual/soul-gift.jpg', '/media/virtual/soul-gift-poster.png'],
  },
  {
    id: 'the-atrium',
    year: '2026',
    title: 'The Atrium',
    gallery: 'The Atrium',
    place: 'Virtual Exhibition',
    category: 'digital',
    images: ['/media/virtual/the-atrium.jpg'],
  },
  {
    id: 'holy-london',
    year: '2025',
    title: 'The Holy Art — London',
    gallery: 'The Holy Art',
    place: 'London, UK',
    category: 'physical',
    images: ['/media/press/vandals-edge-of-now.jpg', '/media/exhibitions/holy-london-1.jpg', '/media/exhibitions/holy-london-2.jpg'],
  },
  {
    id: 'holy-paris',
    year: '2025',
    title: 'The Holy Art — Paris',
    gallery: 'The Holy Art',
    place: 'Paris, France',
    category: 'physical',
    images: ['/media/press/paris-vandals.png', '/media/posters/paris-poster.png', '/media/exhibitions/holy-paris-main.jpg', '/media/exhibitions/holy-paris-1.webp'],
  },
  {
    id: 'astraea-zine',
    year: '2025',
    title: 'Astraea Zine — Dreamscape',
    gallery: 'Astraea Zine',
    place: 'Issue Eight',
    category: 'magazine',
    images: ['/media/posters/poster-1.jpg'],
  },
  {
    id: 'hush-magazine',
    year: '2025',
    title: 'Hush Magazine — LOST//FOUND',
    gallery: 'Hush Magazine',
    place: 'Issue 001',
    category: 'magazine',
    images: ['/media/posters/nana-nyc.jpg'],
  },
  {
    id: 'spellbinder',
    year: '2026',
    title: 'Spellbinder Magazine',
    gallery: 'Spellbinder Magazine',
    place: 'Spring 2026',
    category: 'magazine',
    images: ['/media/posters/paris-poster.png'],
  },
  {
    id: 'wildscape',
    year: '2025',
    title: 'Wildscape Literary Journal',
    gallery: 'Wildscape Literary Journal',
    place: 'Ongoing',
    category: 'magazine',
    images: ['/media/the-fish.png'],
  },
  {
    id: 'onart',
    year: '2025',
    title: 'Onart Magazine',
    gallery: 'Onart Magazine',
    place: 'Feature',
    category: 'magazine',
    images: ['/media/posters/itaewon-poster.png'],
  },
]);

function sortExhibitions(entries: ExhibitionEntry[]): ExhibitionEntry[] {
  const senses = entries.filter((e) => e.id === 'senses');
  const rest = entries
    .filter((e) => e.id !== 'senses')
    .sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
  return [...senses, ...rest];
}

export const publicationsList: LinkItem[] = [];

export const researchList: LinkItem[] = [];

/** Press coverage — hyperlinked list (posters live under Exhibition History). */
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

export const magazines = [
  { title: 'Astraea Zine', issue: 'Issue Eight — Dreamscape', feature: 'The Fish & Souls of Leavings', image: '/media/posters/poster-1.jpg' },
  { title: 'Hush Magazine', issue: 'Issue 001 — LOST//FOUND', feature: 'Souls of Leavings', image: '/media/posters/nana-nyc.jpg' },
  { title: 'Spellbinder Magazine', issue: 'Spring 2026', feature: 'Souls of Leavings', image: '/media/posters/paris-poster.png' },
  { title: 'Wildsape Literary Journal', issue: 'Ongoing', feature: 'The Fish', image: '/media/the-fish.png' },
  { title: 'Onart Magazine', issue: 'TBD', feature: 'Featured', image: '/media/posters/itaewon-poster.png' },
];

export const iiif = (id: string) => `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;

export interface ExhibitionItem {
  year: string;
  title: string;
  venue: string;
  city: string;
  country: string;
}

export const soloExhibitions: ExhibitionItem[] = [
  { year: '2025', title: 'IM INSA', venue: 'Insadong', city: 'Seoul', country: 'South Korea' },
];

export const groupExhibitions: ExhibitionItem[] = [
  { year: '2026', title: 'Contemporary Venice', venue: 'Venice', city: 'Venice', country: 'Italy' },
  { year: '2025', title: 'Senses International Art Fair', venue: 'Must Museum', city: 'Lecce', country: 'Italy' },
  { year: '2025', title: 'Hechyeomoyeo 13', venue: 'The Living Gallery', city: 'New York', country: 'USA' },
  { year: '2026', title: 'Hechyeomoyeo 14', venue: 'Chinatown Garden', city: 'Washington, DC', country: 'USA' },
  { year: '2025', title: 'Hechyeomoyeo Mexico', venue: 'Tnumbra Gallery', city: 'Mexicali', country: 'Mexico' },
  { year: '2025', title: 'KINSHIP × Hechyeomoyeo', venue: 'Seoul', city: 'Seoul', country: 'South Korea' },
  { year: '2025', title: 'The Holy Art — London', venue: 'London', city: 'London', country: 'UK' },
  { year: '2025', title: 'The Holy Art — Paris', venue: 'Paris', city: 'Paris', country: 'France' },
  { year: '2025', title: 'DIMO × Verger Gallery', venue: 'Verger Gallery', city: 'Seoul', country: 'South Korea' },
  { year: '2025', title: 'Luna Grande Art', venue: 'Online', city: 'Istanbul', country: 'Turkey' },
];

export interface PublicationItem {
  type: 'book' | 'essay';
  author: string;
  title: string;
  publisher: string;
  year: string;
}

export const publications: PublicationItem[] = [];

export interface ResearchItem {
  title: string;
  journal?: string;
  year: string;
}

export const researchPapers: ResearchItem[] = [];

export const grantsAndFellowships: { title: string; year: string; description: string }[] = [];

export const residencies: { title: string; location: string; year: string }[] = [];
