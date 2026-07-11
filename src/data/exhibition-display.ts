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

/** Reverse chronological by year (most recent first). No year labels in UI — sort only. */
export function sortExhibitionEntries(entries: ExhibitionEntry[]): ExhibitionEntry[] {
  return [...entries].sort((a, b) => {
    const ya = Number.parseInt(a.year, 10);
    const yb = Number.parseInt(b.year, 10);
    const aOk = Number.isFinite(ya);
    const bOk = Number.isFinite(yb);
    if (aOk && bOk && ya !== yb) return yb - ya;
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return a.gallery.localeCompare(b.gallery, undefined, { sensitivity: 'base' });
  });
}
