/**
 * Generates the social share image (public/og.png) and PNG favicons from SVG.
 * Run with:  npm run og
 * Re-run after changing your name or role. Output files are committed, so
 * this never runs during the Cloudflare build.
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = (p) => `${root}public/${p}`;

const NAME_1 = 'Daniyal';
const NAME_2 = 'Ahmed Khan.';
const ROLE = 'SOFTWARE &amp; CLOUD ENGINEER';
const LINE = 'Full-stack products and the containerized cloud they run on.';
const FONT = "Segoe UI, 'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

const pods = [
  [930, 170, '#f6f5f1', -18],
  [700, 330, '#2b3dff', 24],
  [1080, 360, '#11141c', 12],
  [790, 165, '#f6f5f1', 38],
  [960, 500, '#ff5a1f', -30],
];

const grid = Array.from({ length: 18 }, (_, i) => `<line x1="${i * 72}" y1="0" x2="${i * 72}" y2="630" />`).join('') +
  Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 72}" x2="1200" y2="${i * 72}" />`).join('');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="k" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4a5163"/><stop offset=".45" stop-color="#11141c"/><stop offset="1" stop-color="#2a3040"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#2b3dff" stop-opacity=".18"/><stop offset="1" stop-color="#2b3dff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#f2f0eb"/>
  <g stroke="#0c0e13" stroke-opacity=".06">${grid}</g>
  <circle cx="900" cy="330" r="300" fill="url(#glow)"/>

  <g transform="translate(900 330)">
    <ellipse rx="230" ry="80" transform="rotate(-16)" fill="none" stroke="#0c0e13" stroke-opacity=".16"/>
    <ellipse rx="285" ry="48" transform="rotate(22)" fill="none" stroke="#0c0e13" stroke-opacity=".16" stroke-dasharray="4 6"/>
    ${pods.map(([x, y]) => `<line x1="0" y1="0" x2="${x - 900}" y2="${y - 330}" stroke="#2b3dff" stroke-opacity=".25"/>`).join('')}
    <circle r="150" fill="none" stroke="#2b3dff" stroke-opacity=".8" stroke-width="1.5"/>
    <path d="M 126 -82 A 150 150 0 0 1 150 6" fill="none" stroke="#ff5a1f" stroke-width="4" stroke-linecap="round"/>
    <polygon points="0,-122 106,-61 106,61 0,122 -106,61 -106,-61" fill="none" stroke="#2b3dff" stroke-opacity=".55"/>
    <polygon points="0,-84 73,-42 73,42 0,84 -73,42 -73,-42" fill="url(#k)"/>
    <polygon points="0,-84 73,-42 0,0 -73,-42" fill="#fff" opacity=".18"/>
  </g>
  ${pods
    .map(
      ([x, y, fill, r]) =>
        `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-30" y="-20" width="60" height="40" rx="9" fill="${fill}" stroke="#0c0e13" stroke-opacity="${fill === '#f6f5f1' ? 0.2 : 0}"/></g>`,
    )
    .join('')}

  <text x="72" y="104" font-family="${MONO}" font-size="20" letter-spacing="3" fill="#2b3dff">${ROLE}</text>
  <text x="66" y="262" font-family="${FONT}" font-size="128" font-weight="800" letter-spacing="-6" fill="#0c0e13">${NAME_1}</text>
  <text x="66" y="386" font-family="${FONT}" font-size="104" font-weight="800" letter-spacing="-5" fill="#0c0e13">${NAME_2}</text>
  <text x="72" y="470" font-family="${FONT}" font-size="28" fill="#3a3f4a">${LINE}</text>
  <rect x="72" y="530" width="12" height="12" rx="3" fill="#0b8a5f"/>
  <text x="96" y="542" font-family="${MONO}" font-size="18" letter-spacing="2" fill="#5c616c">KARACHI, PK · NEXT.JS · DOCKER · KUBERNETES · AWS</text>
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(pub('og.png'));

const favicon = await readFile(pub('favicon.svg'));
await sharp(favicon, { density: 384 }).resize(32, 32).png().toFile(pub('favicon-32.png'));
// Apple touch icon: solid background with padding.
const touch = await sharp(favicon, { density: 512 }).resize(150, 150).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0c0e13' } })
  .composite([{ input: touch, top: 15, left: 15 }])
  .png()
  .toFile(pub('apple-touch-icon.png'));

// favicon.ico (browsers request it automatically): ICO container holding 16/32/48px PNGs.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(favicon, { density: 384 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e); // width
  header.writeUInt8(s, e + 1); // height
  header.writeUInt8(0, e + 2); // palette
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile(pub('favicon.ico'), Buffer.concat([header, ...pngs]));

console.log('Generated og.png, favicon.ico, favicon-32.png and apple-touch-icon.png in /public');
