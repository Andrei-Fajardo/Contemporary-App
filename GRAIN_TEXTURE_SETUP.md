# GRAIN TEXTURE SETUP INSTRUCTIONS

## Required Asset: `grain.gif`

The refactored global.css implements a sophisticated dual-layer film grain effect that requires a grain texture file.

### Location
Place your grain texture at: **`public/grain.gif`**

### Specifications
- **Format**: Animated GIF (seamlessly looping)
- **Recommended Size**: 512×512px to 1024×1024px
- **Pattern**: Monochromatic noise/grain texture
- **Loop**: Seamless tiling (no visible seams when repeated)
- **Opacity**: The texture can be at full opacity in the source file; CSS controls the final opacity via dual-layer blending

### Quick Generation Options

#### Option 1: Using Online Tools
1. Visit a noise generator like [NoiseTexture Generator](https://www.noisetexturegenerator.com/)
2. Generate a black/white grain pattern
3. Export as GIF with seamless tiling enabled

#### Option 2: Using Photoshop/GIMP
1. Create a new 512×512px document
2. Apply Filter → Noise → Add Noise (Monochromatic, Gaussian)
3. Use Filter → Other → Offset (256px horizontal/vertical) to test seamless tiling
4. Export as GIF

#### Option 3: Stock Resources
- Search for "film grain texture seamless" on texture libraries
- Ensure the pattern tiles seamlessly

### How It Works
The CSS applies the grain texture using two pseudo-elements:
- **`::before`**: Uses `mix-blend-mode: multiply` at 3% opacity for dark ink grit
- **`::after`**: Uses `mix-blend-mode: overlay` at 2% opacity for highlight balance

This creates an expensive, tactile art paper effect without graying out the page content.

### Testing
After placing the file:
1. Start your dev server: `npm run dev`
2. The grain should be barely perceptible but add tactile quality
3. If too heavy, adjust opacity values in `global.css` (lines 40 & 52)
4. If too light, increase opacity by 0.01 increments

### Fallback
If you cannot source a grain.gif immediately, the site will function normally without it. The grain overlay simply won't render until the asset is added.
