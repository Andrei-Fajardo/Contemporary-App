export interface Artwork {
  slug: string;
  title: string;
  dimensions: string;
  medium: string;
  year: string;
  image: string;
  contain: boolean;
  /** Wall-label About copy — one or more paragraphs */
  aboutParagraphs: string[];
}

export const artworks: Artwork[] = [
  {
    slug: "the-fish",
    title: "The Fish",
    dimensions: "90cm × 60cm",
    medium: "OIL ON CANVAS",
    year: "2024",
    image: "/media/the-fish.png",
    contain: true,
    aboutParagraphs: [
      "The Fish is a melancholic depiction of a woman suspended between sensuality and symbolism. Elements of Pisces allude to intuition and fluid identity, while the black fur — a symbol of death in Kazakh culture — wraps her in a calm, inevitable stillness. The poppy flower appears as an opiate symbol, suggesting a slow, warm, engulfing death and a deep regression into the womb.",
      "The sensation mirrors sinking into deep water, into sleep — that quiet drowning where warmth, oblivion, and a return to origin converge. The work portrays feminine interpretation held within the quiet inevitability of death, folding regression, return to the womb, and the pull toward a warm, friendly death into one unified moment.",
    ],
  },
  {
    slug: "the-souls-of-leavings",
    title: "Souls & Leavings",
    dimensions: "90cm × 60cm",
    medium: "MIXED MEDIA ON CANVAS",
    year: "2025",
    image: "/media/souls-and-leavings.jpg",
    contain: true,
    aboutParagraphs: [
      "This painting first emerged from the artist witnessing the devastation of abandonment and the quiet violence of loss in her childhood friend's life. The painting reflects the universal moment when love and attachment leave a woman alone with its aftermath: the sensation of carrying something that may never be born, the suspended state between hope, emptiness, and departure. The female figure appears caught between these states, as though waiting for something to leave her — or return.",
      "Created while the artist was in chronic physical pain and managing life-threatening gynecological health issues herself, she often walked through her days feeling as if she were having multiple abortions every day — a constant, hollow ache and a persistent emptiness in the lower abdomen and feeling of bodily disfigurement.",
      "Its imagery draws from two contrasting internal truths: the feeling of womanhood as never-ending perpetual pregnancy, and the feeling of womanhood as never-ending perpetual miscarriage.",
      "The act of creation became a form of fictional countertransference. By letting the art suffer as dark as possible instead of the female body, the work becomes a vessel for shared grief and existential anxiety for both women.",
    ],
  },
];
