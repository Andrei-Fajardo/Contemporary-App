import fs from 'node:fs';
import path from 'node:path';

export type ExhibitionCategory = 'physical' | 'digital' | 'magazine';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Build a URL-safe /media/... path (encodes spaces and special chars). */
function mediaUrl(...segments: string[]): string {
  return `/media/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

function sortMediaFiles(a: string, b: string): number {
  const aMain = a.toLowerCase().includes('-main.');
  const bMain = b.toLowerCase().includes('-main.');
  if (aMain !== bMain) return aMain ? -1 : 1;
  return a.localeCompare(b, undefined, { numeric: true });
}

/** Read all images from a folder under public/media. */
function imagesFromMediaFolder(...folderSegments: string[]): string[] {
  const dir = path.join(process.cwd(), 'public', 'media', ...folderSegments);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort(sortMediaFiles)
    .map((file) => mediaUrl(...folderSegments, file));
}

/** Images in public/media/{folder} whose filenames start with {prefix}- or equal {prefix}. */
function imagesByPrefix(folder: string, prefix: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'media', folder);
  if (!fs.existsSync(dir)) return [];
  const p = prefix.toLowerCase();

  return fs
    .readdirSync(dir)
    .filter((file) => {
      if (!IMAGE_EXT.test(file)) return false;
      const base = file.toLowerCase();
      return base.startsWith(`${p}-`) || base.startsWith(`${p}.`) || base === p;
    })
    .sort(sortMediaFiles)
    .map((file) => mediaUrl(folder, file));
}

/** Virtual folder — match multiple filename prefixes (e.g. soul-gift + clover-anna). */
function imagesFromVirtual(...prefixes: string[]): string[] {
  const dir = path.join(process.cwd(), 'public', 'media', 'virtual');
  if (!fs.existsSync(dir)) return [];
  const lowered = prefixes.map((x) => x.toLowerCase());

  return fs
    .readdirSync(dir)
    .filter((file) => {
      if (!IMAGE_EXT.test(file)) return false;
      const base = file.toLowerCase();
      return lowered.some((p) => base.startsWith(`${p}-`) || base.startsWith(`${p}.`) || base === p);
    })
    .sort(sortMediaFiles)
    .map((file) => mediaUrl('virtual', file));
}

/** Magazine folder — prefer dedicated files; optional filename hint filter. */
function magazineImages(...hints: string[]): string[] {
  const fromFolder = imagesFromMediaFolder('magazine');
  if (!fromFolder.length) return [];
  if (!hints.length) return fromFolder;

  const lowered = hints.map((h) => h.toLowerCase());
  const matched = fromFolder.filter((url) => {
    const file = decodeURIComponent(url.split('/').pop() ?? '').toLowerCase();
    return lowered.some((h) => file.includes(h));
  });
  return matched.length ? matched : fromFolder;
}

const hechyeomoyeo14Images =
  imagesFromMediaFolder('Hechyeomoyeo 14').length > 0
    ? imagesFromMediaFolder('Hechyeomoyeo 14')
    : imagesByPrefix('exhibitions', 'hech').concat(
        imagesFromMediaFolder('exhibitions').filter((url) =>
          decodeURIComponent(url).toLowerCase().includes('hechyeomoyeo-nyc'),
        ),
      );

const hechyeomoyeoMexicoImages = imagesFromMediaFolder('Hechyeomoyeo Mexico');

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

/** Senses first, then alphabetical by title. */
export const exhibitionEntries: ExhibitionEntry[] = sortExhibitions([
  {
    id: 'senses',
    year: '2025',
    title: 'Senses International Art Fair',
    gallery: 'MUST Museum',
    place: 'Lecce, Italy',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'senses'),
  },
  {
    id: 'contemporary-venice',
    year: '2026',
    title: 'Contemporary Venice',
    gallery: 'Contemporary Venice',
    place: 'Venice, Italy',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'venice'),
  },
  {
    id: 'dimo',
    year: '2025',
    title: 'DIMO × Verger Gallery',
    gallery: 'Verger Gallery',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'dimo'),
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
    images: hechyeomoyeo14Images,
  },
  {
    id: 'hechyeomoyeo-mexico',
    year: '2025',
    title: 'Hechyeomoyeo Mexico',
    gallery: 'Tnumbra Gallery',
    place: 'Mexicali, Mexico',
    category: 'physical',
    images: hechyeomoyeoMexicoImages,
  },
  {
    id: 'im-insa',
    year: '2025',
    title: 'IM INSA',
    gallery: 'Insadong',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'im-insa'),
  },
  {
    id: 'itaewon-film-festival',
    year: '2025',
    title: 'Itaewon Film Festival',
    gallery: 'Bokwang Theater',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: imagesFromMediaFolder('feature'),
  },
  {
    id: 'kinship',
    year: '2025',
    title: 'KINSHIP × Hechyeomoyeo',
    gallery: 'Collaborative Exhibition',
    place: 'Seoul, South Korea',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'kinship'),
  },
  {
    id: 'luna',
    year: '2025',
    title: 'Luna Grande Art',
    gallery: 'Luna Grande Art',
    place: 'Istanbul, Turkey',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'luna'),
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
    images: imagesFromVirtual('soul-gift', 'clover-anna'),
  },
  {
    id: 'the-atrium',
    year: '2026',
    title: 'The Atrium',
    gallery: 'The Atrium',
    place: 'Virtual Exhibition',
    category: 'digital',
    images: imagesFromVirtual('the-atrium'),
  },
  {
    id: 'holy-london',
    year: '2025',
    title: 'The Holy Art — London',
    gallery: 'The Holy Art',
    place: 'London, UK',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'holy-london'),
  },
  {
    id: 'holy-paris',
    year: '2025',
    title: 'The Holy Art — Paris',
    gallery: 'The Holy Art',
    place: 'Paris, France',
    category: 'physical',
    images: imagesByPrefix('exhibitions', 'holy-paris'),
  },
  {
    id: 'astraea-zine',
    year: '2025',
    title: 'Astraea Zine — Dreamscape',
    gallery: 'Astraea Zine',
    place: 'Issue Eight',
    category: 'magazine',
    images: magazineImages('astraea', 'poster-1').length
      ? magazineImages('astraea', 'poster-1')
      : ['/media/posters/poster-1.jpg'],
  },
  {
    id: 'hush-magazine',
    year: '2025',
    title: 'Hush Magazine — LOST//FOUND',
    gallery: 'Hush Magazine',
    place: 'Issue 001',
    category: 'magazine',
    images: magazineImages('hush', 'nana-nyc').length
      ? magazineImages('hush', 'nana-nyc')
      : ['/media/posters/nana-nyc.jpg'],
  },
  {
    id: 'spellbinder',
    year: '2026',
    title: 'Spellbinder Magazine',
    gallery: 'Spellbinder Magazine',
    place: 'Spring 2026',
    category: 'magazine',
    images: magazineImages('spellbinder', 'paris').length
      ? magazineImages('spellbinder', 'paris')
      : ['/media/posters/paris-poster.png'],
  },
  {
    id: 'wildscape',
    year: '2025',
    title: 'Wildscape Literary Journal',
    gallery: 'Wildscape Literary Journal',
    place: 'Ongoing',
    category: 'magazine',
    images: magazineImages('wildscape', 'fish').length
      ? magazineImages('wildscape', 'fish')
      : ['/media/the-fish.png'],
  },
  {
    id: 'onart',
    year: '2025',
    title: 'Onart Magazine',
    gallery: 'Onart Magazine',
    place: 'Feature',
    category: 'magazine',
    images: magazineImages('onart', 'itaewon').length
      ? magazineImages('onart', 'itaewon')
      : ['/media/posters/itaewon-poster.png'],
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
  { year: '2025', title: 'Luna Grande Art', venue: 'Istanbul', city: 'Istanbul', country: 'Turkey' },
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
