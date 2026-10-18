import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, projectRoot));
const svgTemplate = await read('public/og-image.svg');
const [instrument, instrumentItalic, dmSans] = await Promise.all([
  read('public/fonts/Instrument-Serif-400.woff2'),
  read('public/fonts/Instrument-Serif-400-Italic.woff2'),
  read('public/fonts/DM-Sans-400.woff2'),
]);

const centerX = 916;
const centerY = 322;
const baseRadius = 177;
const points = [];
for (let index = 0; index < 180; index += 1) {
  const angle = (Math.PI * 2 * index) / 180 - Math.PI / 2;
  const radius = baseRadius * (1 + 0.31 * Math.cos(6 * angle));
  const x = (centerX + Math.cos(angle) * radius).toFixed(2);
  const y = (centerY + Math.sin(angle) * radius * 0.83).toFixed(2);
  points.push(`${index === 0 ? 'M' : 'L'}${x},${y}`);
}
const flowerPath = `${points.join(' ')} Z`;

const svg = svgTemplate
  .toString()
  .replace('__INSTRUMENT_FONT__', instrument.toString('base64'))
  .replace('__INSTRUMENT_ITALIC_FONT__', instrumentItalic.toString('base64'))
  .replace('__DM_FONT__', dmSans.toString('base64'))
  .replace('__FLOWER_PATH__', flowerPath);

await writeFile(new URL('public/og-image.rendered.svg', projectRoot), svg);
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL('public/og-image.png', projectRoot)));
