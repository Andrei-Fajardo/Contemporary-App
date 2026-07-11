import type { ExhibitionEntry } from './content';

function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[×x]/g, 'x')
    .trim();
}

export interface ExhibitionDisplay {
  heading: string;
  subheading: string;
}

/** Venue-first labels with deduped exhibition titles in the subheading. */
export function formatExhibitionDisplay(entry: ExhibitionEntry): ExhibitionDisplay {
  if (entry.category === 'magazine') {
    return {
      heading: entry.title,
      subheading:
        entry.links?.issue ?? entry.links?.magazineLabel ?? entry.place,
    };
  }

  const heading = entry.gallery;
  const { title, gallery, place } = entry;

  const normalizedTitle = normalizeLabel(title);
  const normalizedGallery = normalizeLabel(gallery);
  const titleWithYear = normalizeLabel(`${gallery} ${entry.year}`);

  if (normalizedTitle === normalizedGallery || normalizedTitle === titleWithYear) {
    return { heading, subheading: place };
  }

  if (
    normalizedTitle.startsWith(`${normalizedGallery} —`) ||
    normalizedTitle.startsWith(`${normalizedGallery} -`)
  ) {
    return { heading, subheading: place };
  }

  return { heading, subheading: `${title} • ${place}` };
}

/** Sort key for reverse-chronological order (most recent first). Year used for sort only — not shown in UI. */
function exhibitionYearRank(year: string): number {
  if (/^ongoing$/i.test(year.trim())) return 9999;
  const n = Number.parseInt(year, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Reverse chronological; ties broken alphabetically by venue. */
export function sortExhibitionEntries(entries: ExhibitionEntry[]): ExhibitionEntry[] {
  return [...entries].sort((a, b) => {
    const yearDiff = exhibitionYearRank(b.year) - exhibitionYearRank(a.year);
    if (yearDiff !== 0) return yearDiff;
    return a.gallery.localeCompare(b.gallery, undefined, { sensitivity: 'base' });
  });
}
