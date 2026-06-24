export interface ExhibitionEntry {
  id: string;
  year: string;
  title: string;
  gallery: string;
  place: string;
  kind: 'solo' | 'group' | 'museum';
  images: string[];
  note?: string;
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
    images: ['/media/exhibitions/im-insa.jpg'],
  },
  {
    id: 'hechyeomoyeo-nyc',
    year: '2024–2025',
    title: 'Hechyeomoyeo 12 & 13',
    gallery: 'Hechyeomoyeo',
    place: 'New York, USA',
    kind: 'group',
    images: ['/media/exhibitions/hechyeomoyeo-nyc.png', '/media/exhibitions/hech-1.jpg', '/media/exhibitions/hech-2.jpg', '/media/exhibitions/hech-3.jpg', '/media/exhibitions/hech-4.jpg'],
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × Hechyeomoyeo',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    kind: 'group',
    images: ['/media/exhibitions/kinship-main.png', '/media/exhibitions/kinship-1.jpg', '/media/exhibitions/kinship-2.jpg', '/media/exhibitions/kinship-3.jpg'],
  },
  {
    id: 'dimo',
    year: '2025',
    title: 'DIMO × Verger Gallery',
    gallery: 'Verger Gallery',
    place: 'Seoul, South Korea',
    kind: 'group',
    images: ['/media/exhibitions/dimo-main.jpg', '/media/exhibitions/dimo-1.jpg', '/media/exhibitions/dimo-2.jpg'],
  },
  {
    id: 'holy-paris',
    year: '2025',
    title: 'The Holy Art — Paris',
    gallery: 'The Holy Art',
    place: 'Paris, France',
    kind: 'group',
    images: ['/media/posters/paris-poster.png', '/media/exhibitions/holy-paris-main.jpg', '/media/exhibitions/holy-paris-1.webp'],
  },
  {
    id: 'holy-london',
    year: '2025',
    title: 'The Holy Art — London',
    gallery: 'The Holy Art',
    place: 'London, UK',
    kind: 'group',
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
    images: ['/media/exhibitions/luna-main.jpg', '/media/exhibitions/luna-1.jpg', '/media/exhibitions/luna-2.jpg'],
  },
  {
    id: 'venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    kind: 'group',
    images: ['/media/exhibitions/venice-1.jpg', '/media/exhibitions/venice-2.jpg', '/media/exhibitions/venice-3.jpg', '/media/exhibitions/venice-4.jpg', '/media/exhibitions/venice-5.jpg'],
  },
  {
    id: 'soul-gift',
    year: '2026',
    title: 'Soul Gift',
    gallery: 'Clover Gallery',
    place: 'Virtual Exhibition',
    kind: 'group',
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
    images: ['/media/virtual/the-atrium.jpg'],
    note: 'A virtual space exploring architectural memory and digital presence.',
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

export interface PressItem {
  id: string;
  title: string;
  venue: string;
  place: string;
  date: string;
  image: string;
}

/** Exhibition press & promotional posters — one image per entry, no duplicates. */
export const pressItems: PressItem[] = [
  {
    id: 'with-iam-insa',
    title: 'With IAM Insa — The Fish',
    venue: 'Annyeong Insa-dong',
    place: 'Seoul, South Korea',
    date: 'September 11–14, 2024',
    image: '/media/posters/poster-1.jpg',
  },
  {
    id: 'itaewon-film-festival',
    title: 'Itaewon Film Festival 2025',
    venue: 'Bokwang Theater',
    place: 'Seoul, South Korea',
    date: 'November 13–16, 2025',
    image: '/media/posters/itaewon-poster.png',
  },
  {
    id: 'nyc-hcmy',
    title: 'New York Art Exhibition — HCMY #12',
    venue: 'The Living Gallery',
    place: 'Bushwick, Brooklyn, New York, USA',
    date: 'October 11–26, 2025',
    image: '/media/posters/nana-nyc.jpg',
  },
  {
    id: 'paris-vandals',
    title: 'Paris Art Exhibition 2025 — The Vandals',
    venue: 'Of Nazareth Gallery',
    place: 'Le Marais, Paris, France',
    date: 'October 17–20, 2025',
    image: '/media/posters/paris-poster.png',
  },
  {
    id: 'vandals-edge-of-now',
    title: 'The Vandals — Edge of Now',
    venue: 'The Koppel Project',
    place: 'Camden Town, London, UK',
    date: 'October 23–26, 2025',
    image: '/media/press/vandals-edge-of-now.jpg',
  },
  {
    id: 'istanbul-art-show',
    title: 'Istanbul Art Show',
    venue: 'Luna Grande Art',
    place: 'Kadıköy, Istanbul, Turkey',
    date: 'November 15–21, 2025',
    image: '/media/press/istanbul-art-show.jpg',
  },
  {
    id: 'light-that-remains',
    title: 'Light that Remains',
    venue: 'D.I.M.O × Verger Gallery',
    place: 'Yeonnam-dong, Seoul, South Korea',
    date: 'December 14, 2025 – January 10, 2026',
    image: '/media/press/light-that-remains.jpg',
  },
  {
    id: 'petit-masterpiece',
    title: 'PETIT Masterpiece',
    venue: 'Ahmad Shariff Art Gallery',
    place: 'Claremont, California, USA',
    date: 'December 6, 2025',
    image: '/media/press/petit-masterpiece.jpg',
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
