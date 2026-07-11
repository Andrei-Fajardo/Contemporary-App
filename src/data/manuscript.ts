/** From Utero — manuscript booklet page scans (20 pages). Kept for possible future use; Publishings CTA no longer opens the full reader. */
export const manuscriptPages = Array.from({ length: 20 }, (_, index) => {
  const page = String(index + 1).padStart(4, "0");
  const filename = `From Utero - Booklet_pages-to-jpg-${page}.jpg`;
  return `/media/manuscript/${encodeURIComponent(filename)}`;
});

export const manuscriptMeta = {
  title: "From Utero",
  subtitle: "Manuscript booklet",
} as const;

/**
 * Front/back cover assets for the covers-only viewer.
 * Using booklet scan first/last pages as front (0001) and back (0020) covers.
 * TODO(chapbook-purchase-url): add purchaseHref when client provides a real purchase/read URL.
 */
export const manuscriptCovers: {
  front?: string;
  back?: string;
  purchaseHref?: string;
} = {
  front: `/media/manuscript/${encodeURIComponent('From Utero - Booklet_pages-to-jpg-0001.jpg')}`,
  back: `/media/manuscript/${encodeURIComponent('From Utero - Booklet_pages-to-jpg-0020.jpg')}`,
  // purchaseHref: undefined,
};

export const hasManuscriptCovers = Boolean(manuscriptCovers.front && manuscriptCovers.back);

/** Pages shown in the Publishings CTA book modal — covers only (not the full 20-page booklet). */
export const manuscriptViewerPages: string[] = hasManuscriptCovers
  ? [manuscriptCovers.front!, manuscriptCovers.back!]
  : [];
