/**
 * Génère toutes les icônes Respire à partir d'un SVG.
 * Usage: node scripts/generate-icon.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Design SVG ─────────────────────────────────────────────────────────────
// Fond sombre, trois arcs de souffle en violet, lettre R stylisée
const svg = /* xml */`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#1e1535"/>
      <stop offset="100%" stop-color="#0f0c18"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="arc1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="arc2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
    <linearGradient id="arc3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#4c1d95" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- Fond -->
  <rect width="1024" height="1024" fill="url(#bg)" rx="0"/>

  <!-- Halo central -->
  <ellipse cx="512" cy="480" rx="320" ry="300" fill="url(#glow)"/>

  <!-- Arc extérieur (le plus grand, le plus transparent) -->
  <path
    d="M 210 620
       C 210 350, 340 240, 512 240
       C 684 240, 814 350, 814 620"
    fill="none"
    stroke="url(#arc3)"
    stroke-width="52"
    stroke-linecap="round"
  />

  <!-- Arc intermédiaire -->
  <path
    d="M 280 620
       C 280 400, 380 300, 512 300
       C 644 300, 744 400, 744 620"
    fill="none"
    stroke="url(#arc2)"
    stroke-width="48"
    stroke-linecap="round"
  />

  <!-- Arc intérieur (le plus lumineux) -->
  <path
    d="M 355 620
       C 355 455, 425 368, 512 368
       C 599 368, 669 455, 669 620"
    fill="none"
    stroke="url(#arc1)"
    stroke-width="44"
    stroke-linecap="round"
  />

  <!-- Ligne de base horizontale -->
  <rect x="200" y="620" width="624" height="36" rx="18" fill="#a78bfa" opacity="0.25"/>

  <!-- Point lumineux central en bas -->
  <circle cx="512" cy="638" r="28" fill="#c4b5fd" opacity="0.9"/>
  <circle cx="512" cy="638" r="14" fill="#fff" opacity="0.95"/>

  <!-- Petit arc de respiration au-dessus du point -->
  <path
    d="M 466 590 Q 512 548 558 590"
    fill="none"
    stroke="#fff"
    stroke-width="16"
    stroke-linecap="round"
    opacity="0.7"
  />
</svg>`;

// ─── Exports ────────────────────────────────────────────────────────────────
const EXPORTS = [
  // iOS / App Store
  { out: 'assets/icon.png',                   size: 1024 },
  { out: 'assets/splash-icon.png',            size: 512  },
  // Android adaptive foreground (fond transparent)
  { out: 'assets/android-icon-foreground.png', size: 1024, transparent: true },
];

const svgBuffer = Buffer.from(svg);

for (const { out, size, transparent } of EXPORTS) {
  const outPath = join(ROOT, out);
  let pipeline = sharp(svgBuffer, { density: Math.ceil((size / 1024) * 300) }).resize(size, size);
  if (!transparent) {
    // fond uni pour icônes plates
    pipeline = pipeline.flatten({ background: '#0f0c18' });
  }
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`✔ ${out} (${size}×${size})`);
}

// Android monochrome (formes blanches sur fond transparent)
const monoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <path d="M 210 620 C 210 350, 340 240, 512 240 C 684 240, 814 350, 814 620"
    fill="none" stroke="#ffffff" stroke-width="52" stroke-linecap="round" opacity="0.4"/>
  <path d="M 280 620 C 280 400, 380 300, 512 300 C 644 300, 744 400, 744 620"
    fill="none" stroke="#ffffff" stroke-width="48" stroke-linecap="round" opacity="0.65"/>
  <path d="M 355 620 C 355 455, 425 368, 512 368 C 599 368, 669 455, 669 620"
    fill="none" stroke="#ffffff" stroke-width="44" stroke-linecap="round"/>
  <rect x="200" y="620" width="624" height="36" rx="18" fill="#ffffff" opacity="0.25"/>
  <circle cx="512" cy="638" r="28" fill="#ffffff" opacity="0.9"/>
  <circle cx="512" cy="638" r="14" fill="#ffffff"/>
  <path d="M 466 590 Q 512 548 558 590" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" opacity="0.7"/>
</svg>`;

await sharp(Buffer.from(monoSvg))
  .resize(1024, 1024)
  .png()
  .toFile(join(ROOT, 'assets/android-icon-monochrome.png'));
console.log('✔ assets/android-icon-monochrome.png (1024×1024)');

// Android background (couleur unie)
await sharp({
  create: { width: 1024, height: 1024, channels: 3, background: '#0f0c18' },
}).png().toFile(join(ROOT, 'assets/android-icon-background.png'));
console.log('✔ assets/android-icon-background.png (1024×1024)');

console.log('\n🎉 Toutes les icônes générées dans assets/');
