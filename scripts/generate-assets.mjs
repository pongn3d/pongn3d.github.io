import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = new URL('../', import.meta.url);
const readProjectFile = (path) => readFile(new URL(path, projectRoot));
const readPublicAsset = (path) => readProjectFile(`public/${path.replace(/^\/+/, '')}`);
const writePublicAsset = (path, data) => writeFile(new URL(`public/${path.replace(/^\/+/, '')}`, projectRoot), data);
const site = JSON.parse((await readProjectFile('content/site.json')).toString());

const [faviconSvg, logoMarkSvg, spaceRegular, spaceMedium, monoRegular, monoMedium, ogTemplate] = await Promise.all([
  readPublicAsset(site.assets.faviconSvg),
  readPublicAsset(site.assets.logoMark),
  readPublicAsset('/fonts/Space-Grotesk-400.woff2'),
  readPublicAsset('/fonts/Space-Grotesk-500.woff2'),
  readPublicAsset('/fonts/JetBrains-Mono-400.woff2'),
  readPublicAsset('/fonts/JetBrains-Mono-500.woff2'),
  readPublicAsset('/og-image.svg'),
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

const svg = ogTemplate
  .toString()
  .replace('__SPACE_REGULAR_FONT__', spaceRegular.toString('base64'))
  .replace('__SPACE_MEDIUM_FONT__', spaceMedium.toString('base64'))
  .replace('__MONO_REGULAR_FONT__', monoRegular.toString('base64'))
  .replace('__MONO_MEDIUM_FONT__', monoMedium.toString('base64'))
  .replace('__FLOWER_PATH__', flowerPath);

await writePublicAsset('/og-image.rendered.svg', svg);

const logoForRaster = Buffer.from(logoMarkSvg.toString().replaceAll('currentColor', '#542f28'));
const logoPng = await sharp(logoForRaster)
  .resize(54, 54, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const ogPng = await sharp(Buffer.from(svg))
  .png()
  .toBuffer();
await sharp(ogPng)
  .composite([{ input: logoPng, left: 94, top: 70 }])
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL(`public/${site.seo.openGraphImage.replace(/^\/+/, '')}`, projectRoot)));

await sharp(faviconSvg)
  .resize(32, 32, { fit: 'contain' })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL(`public/${site.assets.faviconPng.replace(/^\/+/, '')}`, projectRoot)));
await sharp(faviconSvg)
  .resize(180, 180, { fit: 'contain' })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL(`public/${site.assets.appleTouchIcon.replace(/^\/+/, '')}`, projectRoot)));
