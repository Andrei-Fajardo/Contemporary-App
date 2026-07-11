/**
 * Static JSON-LD builders (no CMS). Image fields are left empty pending client approval.
 * TODO(client-images): fill `image` / `thumbnailUrl` once final assets are approved.
 */
import {
  exhibitionEntries,
  magazineFeatures,
  pressLinks,
  publicationLinks,
  researchLinks,
  type ExhibitionEntry,
  type LinkItem,
} from './content';
import { manuscriptMeta, hasManuscriptCovers } from './manuscript';
import { absoluteUrl, SITE_PERSON, SITE_URL } from './site';
import type { Artwork } from './artworks';

/** Empty image slot — do not invent stock URLs. */
export const SCHEMA_IMAGE_PENDING = '' as const;

type JsonLd = Record<string, unknown>;

function linkItemToCreativeWork(item: LinkItem, extraType?: string): JsonLd | null {
  if (!item.title) return null;
  const node: JsonLd = {
    '@type': extraType ?? 'CreativeWork',
    name: item.title,
    ...(item.href ? { url: item.href } : {}),
    ...(item.year ? { datePublished: item.year } : {}),
    ...(item.platform
      ? {
          publisher: {
            '@type': 'Organization',
            name: item.platform,
            ...(item.platformHref ? { url: item.platformHref } : {}),
          },
        }
      : {}),
    // TODO(client-images): pending final image approval
    image: SCHEMA_IMAGE_PENDING,
  };
  return node;
}

function exhibitionToEvent(entry: ExhibitionEntry): JsonLd {
  /**
   * ExhibitionEvent ideally needs startDate (ISO). We only have a year string —
   * REQUIRED field missing precise date: flagged, not invented.
   * TODO(confirm-exhibition-dates): replace year-only with ISO startDate/endDate when known.
   */
  const missingStartDate = true;

  return {
    '@type': 'ExhibitionEvent',
    name: entry.title,
    ...(missingStartDate
      ? {
          // Google recommends startDate; year-only is insufficient — omit rather than invent day/month
          description: `${entry.year} · ${entry.gallery} · ${entry.place}`,
        }
      : {}),
    location: {
      '@type': 'Place',
      name: entry.gallery,
      address: entry.place,
    },
    organizer: {
      '@type': 'Organization',
      name: entry.gallery,
    },
    // TODO(client-images): pending final exhibition image approval — do not use placeholder paths in schema
    image: SCHEMA_IMAGE_PENDING,
    // Keep year as text metadata until precise dates exist
    about: entry.year,
  };
}

/** Person schema for Home / About. */
export function buildPersonSchema(includeContext = false): JsonLd {
  const node: JsonLd = {
    '@type': 'Person',
    name: SITE_PERSON.name,
    alternateName: SITE_PERSON.alternateName,
    jobTitle: SITE_PERSON.jobTitle,
    url: SITE_URL,
    email: SITE_PERSON.email,
    sameAs: SITE_PERSON.sameAs,
    homeLocation: {
      '@type': 'Place',
      name: `${SITE_PERSON.homeLocation.locality} / ${SITE_PERSON.homeLocation.alsoKnown}`,
    },
    // TODO(client-images): pending final portrait / headshot approval
    image: SCHEMA_IMAGE_PENDING,
  };
  if (includeContext) node['@context'] = 'https://schema.org';
  return node;
}

/** From Utero chapbook as Book. */
export function buildChapbookSchema(): JsonLd {
  return {
    '@type': 'Book',
    name: manuscriptMeta.title,
    author: {
      '@type': 'Person',
      name: SITE_PERSON.name,
      url: SITE_URL,
    },
    url: absoluteUrl('/#publications'),
    // TODO(client-images): pending final cover approval (front/back booklet scans exist but await client sign-off for OG/schema)
    image: SCHEMA_IMAGE_PENDING,
    ...(hasManuscriptCovers
      ? {
          // Covers exist in /media/manuscript — schema image still gated on client approval
        }
      : {}),
  };
}

/** CreativeWork / Article nodes from publications, press, research. */
export function buildPublicationSchemas(): JsonLd[] {
  const pubs = publicationLinks
    .map((item) => linkItemToCreativeWork(item, 'CreativeWork'))
    .filter(Boolean) as JsonLd[];

  const press = pressLinks
    .map((item) => linkItemToCreativeWork(item, 'Article'))
    .filter(Boolean) as JsonLd[];

  const research = researchLinks
    .filter((item) => item.platform) // skip empty-platform ambiguous rows
    .map((item) => linkItemToCreativeWork(item, 'Article'))
    .filter(Boolean) as JsonLd[];

  const magazines = magazineFeatures.map((mag) => ({
    '@type': 'CreativeWork',
    name: mag.title,
    ...(mag.href ? { url: mag.href } : {}),
    ...(mag.year ? { datePublished: mag.year } : {}),
    description: [mag.issue, mag.feature].filter(Boolean).join(' · '),
    // TODO(client-images): pending final magazine cover approval
    image: SCHEMA_IMAGE_PENDING,
  }));

  return [...pubs, ...press, ...research, ...magazines, buildChapbookSchema()];
}

export function buildExhibitionSchemas(): JsonLd[] {
  return exhibitionEntries.map(exhibitionToEvent);
}

/** Full @graph for locale home documents. */
export function buildHomeJsonLdGraph(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildPersonSchema(), ...buildPublicationSchemas(), ...buildExhibitionSchemas()],
  };
}

/** VisualArtwork for /art/[slug] detail pages. */
export function buildArtworkSchema(artwork: Artwork): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    artMedium: artwork.medium,
    // TODO(confirm-artwork-size): schema.org width/height expect QuantitativeValue — dimensions string kept as description for now
    description: artwork.aboutMobile || artwork.aboutParagraphs[0] || '',
    dateCreated: artwork.year,
    creator: {
      '@type': 'Person',
      name: SITE_PERSON.name,
      url: SITE_URL,
    },
    url: absoluteUrl(`/art/${artwork.slug}`),
    // TODO(client-images): pending final artwork image approval for schema/OG
    // Artwork file may exist at artwork.image — do not emit until client approves for SEO surfaces
    image: SCHEMA_IMAGE_PENDING,
  };
}

export function jsonLdScript(data: JsonLd): string {
  return JSON.stringify(data);
}
