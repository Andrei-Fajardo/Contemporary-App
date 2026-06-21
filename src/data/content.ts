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

export const publications: PublicationItem[] = [
  { type: 'book', author: 'Anna Dauyl Rockswell', title: 'The Fish and Other Departures', publisher: 'Void Press', year: '2025' },
  { type: 'essay', author: 'Anna Dauyl Rockswell', title: 'Threshold Spaces: Liminality in Contemporary Sculpture', publisher: 'Sculpture Journal', year: '2024' },
  { type: 'essay', author: 'Anna Dauyl Rockswell', title: 'Archival Memory in Post-Digital Installation', publisher: 'Journal of Visual Art Practice', year: '2025' },
  { type: 'essay', author: 'Anna Dauyl Rockswell', title: 'The Visceral Feminine: Dark Expressionism and the Body', publisher: 'Contemporary Art Review', year: '2025' },
];

export interface PressItem {
  author: string;
  title: string;
  outlet: string;
  date: string;
}

export const pressItems: PressItem[] = [
  { author: 'Astraea Zine', title: 'The Fish and Souls of Leavings — Issue Eight Feature', outlet: 'Astraea Zine', date: '2025' },
  { author: 'Hush Magazine', title: 'Souls of Leavings — Issue 001 LOST//FOUND', outlet: 'Hush Magazine', date: '2025' },
  { author: 'Spellbinder Magazine', title: 'Souls of Leavings — Spring 2026 Issue', outlet: 'Spellbinder Magazine', date: '2026' },
  { author: 'Wildsape Literary Journal', title: 'The Fish — Featured Artwork', outlet: 'Wildsape Literary Journal', date: '2025' },
  { author: 'Itaewon Film Festival', title: 'Featured Filmmaker / Artist', outlet: 'Itaewon Film Festival', date: '2025' },
];

export interface ResearchItem {
  title: string;
  journal?: string;
  year: string;
}

export const researchPapers: ResearchItem[] = [
  { title: 'Archival Memory in Post-Digital Installation', journal: 'Journal of Visual Art Practice', year: '2025' },
  { title: 'Threshold Spaces: Liminality in Contemporary Sculpture', journal: 'Sculpture Journal', year: '2024' },
];

export const grantsAndFellowships = [
  { title: 'Andy Warhol Foundation Grant', year: '2024', description: 'Arts Writing and Criticism' },
  { title: 'NEA Fellowship', year: '2023', description: 'Visual Arts' },
  { title: 'ARKO Arts Council Grant', year: '2025', description: 'International Exhibition Support' },
];

export const residencies = [
  { title: 'Hechyeomoyeo International Artist Residency', location: 'New York, USA', year: '2024' },
  { title: 'Verger Gallery Studio Residency', location: 'Seoul, South Korea', year: '2025' },
];
