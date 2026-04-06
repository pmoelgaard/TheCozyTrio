// Rasterize public/og-image.svg → public/og-image.png at 1200x630.
//
// Why this exists:
// Twitter/X's card validator rejects SVG Open Graph images (security —
// SVG can embed <script> and external refs), so we ship a PNG for
// maximum crawler compatibility. Facebook and LinkedIn accept either,
// but they render PNG more consistently than SVG too.
//
// We keep the SVG as the authoring source so future tweaks stay editable
// in any vector tool, and this script re-rasterizes on demand. Run it
// manually whenever og-image.svg changes:
//
//   node scripts/rasterize-og.mjs
//
// Uses @resvg/resvg-js (pure Rust, prebuilt binaries) — no Cairo, no
// ImageMagick, no headless browser.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const svgPath = resolve(projectRoot, 'public/og-image.svg');
const pngPath = resolve(projectRoot, 'public/og-image.png');

const svg = await readFile(svgPath, 'utf8');

const resvg = new Resvg(svg, {
  // Fit the rendered bitmap to the SVG's natural viewBox (1200×630) so
  // dimensions exactly match the og:image:width / og:image:height meta
  // tags in src/index.html.
  fitTo: { mode: 'width', value: 1200 },
  // Map font-family names in the SVG to system fallbacks. Baloo 2 and
  // Nunito aren't guaranteed present on this machine, so we let resvg
  // substitute — the OG image is decorative, not pixel-perfect typography.
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Helvetica',
  },
  background: 'rgba(255, 245, 249, 1)',
});

const png = resvg.render().asPng();
await writeFile(pngPath, png);

console.log(`✓ Wrote ${pngPath} (${png.byteLength.toLocaleString()} bytes)`);
