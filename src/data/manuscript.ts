/** From Utero — manuscript booklet page scans (20 pages). */
export const manuscriptPages = Array.from({ length: 20 }, (_, index) => {
  const page = String(index + 1).padStart(4, "0");
  const filename = `From Utero - Booklet_pages-to-jpg-${page}.jpg`;
  return `/media/manuscript/${encodeURIComponent(filename)}`;
});

export const manuscriptMeta = {
  title: "From Utero",
  subtitle: "Manuscript booklet",
} as const;
