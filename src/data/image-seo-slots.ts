/**
 * Image-dependent SEO / a11y slots.
 * Fill values only after client approves final images — no stock photography.
 *
 * TODO(client-images): pending final image approval — every field below.
 */
export const imageSeoSlots = {
  /** Default Open Graph / Twitter share image (absolute URL once approved). */
  defaultOgImage: '' as string,

  /** Person / About portrait for schema.org Person.image */
  personImage: '' as string,

  /** From Utero front cover for Book.image + OG when sharing publishings */
  chapbookCoverFront: '' as string,

  /** From Utero back cover (optional secondary) */
  chapbookCoverBack: '' as string,

  /**
   * Per-artwork alt text + OG overrides keyed by slug.
   * Leave empty until client provides approved alt copy / crop.
   */
  artworks: {
    'the-fish': {
      alt: '',
      ogImage: '',
      schemaImage: '',
    },
    'the-souls-of-leavings': {
      alt: '',
      ogImage: '',
      schemaImage: '',
    },
  } as Record<string, { alt: string; ogImage: string; schemaImage: string }>,
} as const;
