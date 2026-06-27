/**
 * Curated Unsplash backgrounds for visceral gothic / dark feminine routes.
 * Each keyword maps to a distinct asset (grayscale + multiply applied in CSS).
 */
const UNSPLASH_BACKGROUNDS: Record<string, string> = {
  anatomy:
    'https://images.unsplash.com/photo-1576086213369-97a270d7d8b1?auto=format&fit=crop&w=1920&q=80',
  botany:
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1920&q=80',
  botanical:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
  decay:
    'https://images.unsplash.com/photo-1597848212624-e530dba4378c?auto=format&fit=crop&w=1920&q=80',
  womb:
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1920&q=80',
  uterus:
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1920&q=80',
  blood:
    'https://images.unsplash.com/photo-1576086213369-97a270d7d8b1?auto=format&fit=crop&w=1920&q=80',
  body:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80',
  horror:
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1920&q=80',
  chapbook:
    'https://images.unsplash.com/photo-1516979187450-637abb4f9353?auto=format&fit=crop&w=1920&q=80',
  art:
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1920&q=80',
  default:
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1920&q=80',
};

export function getUnsplashBg(keyword: string): string {
  const key = keyword.toLowerCase().trim().replace(/\s+/g, '-');
  return UNSPLASH_BACKGROUNDS[key] ?? UNSPLASH_BACKGROUNDS.default;
}
