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
    id: 'venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/venice-1.jpg',
      '/media/exhibitions/venice-2.jpg',
      '/media/exhibitions/venice-3.jpg',
      '/media/exhibitions/venice-4.jpg',
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
      '/media/exhibitions/senses-main.jpg',
      '/media/exhibitions/senses-1.jpg',
      '/media/exhibitions/senses-2.jpg',
      '/media/exhibitions/senses-placeholder-4.jpg',
    ],
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
    images: [
      '/media/exhibitions/im-insa.jpg',
      '/media/exhibitions/im-insa-placeholder-2.jpg',
      '/media/exhibitions/im-insa-placeholder-3.jpg',
      '/media/exhibitions/im-insa-placeholder-4.jpg',
    ],
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × Hechyeomoyeo',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/kinship-main.png',
      '/media/exhibitions/kinship-1.jpg',
      '/media/exhibitions/kinship-2.jpg',
      '/media/exhibitions/kinship-3.jpg',
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
      '/media/exhibitions/dimo-main.jpg',
      '/media/exhibitions/dimo-1.jpg',
      '/media/exhibitions/dimo-2.jpg',
      '/media/exhibitions/dimo-placeholder-4.jpg',
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
    images: [
      '/media/posters/paris-poster.png',
      '/media/exhibitions/holy-paris-main.jpg',
      '/media/exhibitions/holy-paris-1.webp',
      '/media/exhibitions/holy-paris-placeholder-4.jpg',
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
      '/media/exhibitions/holy-london-1.jpg',
      '/media/exhibitions/holy-london-2.jpg',
      '/media/exhibitions/holy-london-placeholder-3.jpg',
      '/media/exhibitions/holy-london-placeholder-4.jpg',
    ],
    note: 'Exhibition documentation & promotional materials.',
  },
  {
    id: 'london-contemporary-art-fair-2026',
    year: '2026',
    title: 'London Contemporary Art Fair 2026 — 16th Edition',
    gallery: 'London Contemporary Art Fair',
    place: 'London, UK',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-london-1.jpg'],
  },
  {
    id: 'holy-milan',
    year: '2026',
    title: 'The Holy Art — Milan',
    gallery: 'The Holy Art',
    place: 'Milan, Italy',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-paris-placeholder-4.jpg'],
  },
  {
    id: 'holy-tokyo',
    year: '2026',
    title: 'The Holy Art — Tokyo',
    gallery: 'The Holy Art',
    place: 'Tokyo, Japan',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-paris-placeholder-4.jpg'],
  },
  {
    id: 'holy-athens',
    year: '2026',
    title: 'The Holy Art — Athens',
    gallery: 'The Holy Art',
    place: 'Athens, Greece',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-paris-placeholder-4.jpg'],
  },
  {
    id: 'holy-amsterdam',
    year: '2026',
    title: 'The Holy Art — Amsterdam',
    gallery: 'The Holy Art',
    place: 'Amsterdam, Netherlands',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/holy-paris-placeholder-4.jpg'],
  },
  {
    id: 'arrival-osaka-2026',
    year: '2026',
    title: 'ARRIVAL Gallery × Osaka 2026',
    gallery: 'ARRIVAL Gallery',
    place: 'Osaka, Japan',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/venice-1.jpg'],
  },
  {
    id: 'arrival-brighton-2026',
    year: '2026',
    title: 'ARRIVAL Gallery × Brington 2026',
    gallery: 'ARRIVAL Gallery',
    place: 'Brighton, UK',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/venice-2.jpg'],
  },
  {
    id: 'lumiere-2026',
    year: '2026',
    title: 'LUMIÈRE',
    gallery: 'LUMIÈRE',
    place: 'International',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/luna-placeholder-4.jpg'],
  },
  {
    id: 'select-art-fair-2026',
    year: '2026',
    title: 'Select Art — International Art & Antique Fair',
    gallery: 'Select Art',
    place: 'International',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/senses-placeholder-4.jpg'],
  },
  {
    id: 'hechyeomoyeo-mexico-2026',
    year: '2026',
    title: 'Mexico Hechyeomoyeo! Art Festival',
    gallery: 'Hechyeomoyeo',
    place: 'Mexico',
    kind: 'group',
    category: 'physical',
    images: ['/media/exhibitions/hechyeomoyeo-nyc.png'],
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
      '/media/exhibitions/luna-main.jpg',
      '/media/exhibitions/luna-1.jpg',
      '/media/exhibitions/luna-2.jpg',
      '/media/exhibitions/luna-placeholder-4.jpg',
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
      '/media/exhibitions/ahmad-shariff-placeholder-1.jpg',
      '/media/exhibitions/ahmad-shariff-placeholder-2.jpg',
      '/media/exhibitions/ahmad-shariff-placeholder-3.jpg',
      '/media/exhibitions/ahmad-shariff-placeholder-4.jpg',
    ],
    links: {
      website: 'https://www.ahmadshariffgallery.com/',
    },
  },
  {
    id: 'hechyeomoyeo-13',
    year: '2025',
    title: 'Hechyeomoyeo 13',
    gallery: 'Hechyeomoyeo',
    place: 'New York, USA',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/hech-3.jpg',
      '/media/exhibitions/hech-4.jpg',
      '/media/exhibitions/hechyeomoyeo-13-placeholder-3.jpg',
      '/media/exhibitions/hechyeomoyeo-13-placeholder-4.jpg',
    ],
  },
  {
    id: 'hechyeomoyeo-12',
    year: '2024',
    title: 'Hechyeomoyeo 12',
    gallery: 'Hechyeomoyeo',
    place: 'New York, USA',
    kind: 'group',
    category: 'physical',
    images: [
      '/media/exhibitions/hechyeomoyeo-nyc.png',
      '/media/exhibitions/hech-1.jpg',
      '/media/exhibitions/hech-2.jpg',
      '/media/exhibitions/hechyeomoyeo-12-placeholder-4.jpg',
    ],
  },
  {
    id: 'virtual-intl-fine-arts-fair-2026',
    year: '2026',
    title: 'Virtual International Fine Arts Fair 2026',
    gallery: 'Virtual International Fine Arts Fair',
    place: 'Virtual Exhibition',
    kind: 'group',
    category: 'digital',
    images: ['/media/virtual/the-atrium.jpg'],
    note: '04/10/2026 — 04/30/2026',
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
  { image: "/media/exhibitions/hechyeomoyeo-nyc.png", title: "Hechyeomoyeo 12", year: "2024", location: "NEW YORK, USA", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/hech-3.jpg", title: "Hechyeomoyeo 13", year: "2025", location: "NEW YORK, USA", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/ahmad-shariff-placeholder-1.jpg", title: "Ahmad Shariff Gallery", year: "2025", location: "CLAREMONT, CALIFORNIA", subtitle: "GROUP EXHIBITION" },
  { image: "/media/exhibitions/kinship-main.png", title: "KINSHIP × Hechyeomoyeo", year: "2025", location: "SEOUL, SOUTH KOREA", subtitle: "COLLABORATIVE EXHIBITION" },
  { image: "/media/exhibitions/dimo-main.jpg", title: "DIMO × Verger Gallery", year: "2025", location: "5TH EXHIBITION", subtitle: "VERGER GALLERY COLLABORATION" },
  { image: "/media/exhibitions/holy-london-1.jpg", title: "The Holy Art – London", year: "2026", location: "LONDON, UK", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: "/media/exhibitions/holy-paris-main.jpg", title: "The Holy Art – Paris", year: "2026", location: "PARIS, FRANCE", subtitle: "INTERNATIONAL GROUP SHOW" },
  { image: "/media/exhibitions/luna-main.jpg", title: "Luna Grande Art", year: "2025", location: "ISTANBUL, TURKEY", subtitle: "FEATURED ARTIST SHOWCASE" },
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
  { year: "2025", title: "Hechyeomoyeo 13", venue: "New York", city: "New York", country: "USA" },
  { year: "2024", title: "Hechyeomoyeo 12", venue: "New York", city: "New York", country: "USA" },
  { year: "2025", title: "Ahmad Shariff Gallery", venue: "Ahmad Shariff Gallery", city: "Claremont", country: "USA" },
  { year: "2025", title: "KINSHIP × Hechyeomoyeo", venue: "Seoul", city: "Seoul", country: "South Korea" },
  { year: "2026", title: "The Holy Art — London", venue: "London", city: "London", country: "UK" },
  { year: "2026", title: "The Holy Art — Paris", venue: "Paris", city: "Paris", country: "France" },
  { year: "2026", title: "London Contemporary Art Fair 2026 — 16th Edition", venue: "London Contemporary Art Fair", city: "London", country: "UK" },
  { year: "2026", title: "The Holy Art — Milan", venue: "Milan", city: "Milan", country: "Italy" },
  { year: "2026", title: "The Holy Art — Tokyo", venue: "Tokyo", city: "Tokyo", country: "Japan" },
  { year: "2026", title: "The Holy Art — Athens", venue: "Athens", city: "Athens", country: "Greece" },
  { year: "2026", title: "The Holy Art — Amsterdam", venue: "Amsterdam", city: "Amsterdam", country: "Netherlands" },
  { year: "2026", title: "ARRIVAL Gallery × Osaka 2026", venue: "Osaka", city: "Osaka", country: "Japan" },
  { year: "2026", title: "ARRIVAL Gallery × Brington 2026", venue: "Brighton", city: "Brighton", country: "UK" },
  { year: "2026", title: "LUMIÈRE", venue: "LUMIÈRE", city: "International", country: "" },
  { year: "2026", title: "Select Art — International Art & Antique Fair", venue: "Select Art", city: "International", country: "" },
  { year: "2026", title: "Mexico Hechyeomoyeo! Art Festival", venue: "Mexico", city: "Mexico", country: "" },
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
    year: '2026',
  },
];

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
