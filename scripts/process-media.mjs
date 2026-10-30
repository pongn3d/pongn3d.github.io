import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsRoot = path.join(root, 'content', 'projects');
const achievementsRoot = path.join(root, 'content', 'achievements');
const aboutPath = path.join(root, 'content', 'about.md');
const generatedRoot = path.join(root, 'public', 'generated-media');
const manifest = { projects: {} };
const imageNamePattern = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.(?:jpe?g|png|webp)$/i;
const videoNamePattern = /^[A-Za-z0-9][A-Za-z0-9._ -]*\.mp4$/i;
const maxImageWidth = 2000;
let imageCount = 0;
let videoCount = 0;

function assertLocalFilename(value, pathHint, pattern) {
  if (typeof value !== 'string' || !pattern.test(value) || path.basename(value) !== value) {
    throw new Error(`Invalid local media filename in ${pathHint}: ${String(value)}. Use a filename without folders.`);
  }
}

async function processImage(slug, sourceName, sourcePath) {
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Could not read image dimensions for ${sourcePath}.`);
  // Originals can be huge (4000px+ camera photos), so the largest web copy is capped to keep the site light.
  const largestWidth = Math.min(metadata.width, maxImageWidth);
  const requestedWidths = [480, 960, 1440].filter((width) => width < largestWidth);
  const widths = [...new Set([...requestedWidths, largestWidth])].sort((a, b) => a - b);
  const variants = [];
  const destinationFolder = path.join(generatedRoot, slug);
  await mkdir(destinationFolder, { recursive: true });
  const stem = path.parse(sourceName).name.replace(/[^A-Za-z0-9._-]+/g, '-');
  for (const targetWidth of widths) {
    const destinationName = `${stem}-${targetWidth}.webp`;
    const destinationPath = path.join(destinationFolder, destinationName);
    await sharp(sourcePath)
      .rotate()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(destinationPath);
    const outputMetadata = await sharp(destinationPath).metadata();
    variants.push({
      src: `/generated-media/${slug}/${destinationName}`,
      width: outputMetadata.width ?? targetWidth,
      height: outputMetadata.height ?? Math.round((metadata.height * targetWidth) / metadata.width),
    });
  }
  imageCount += 1;
  return {
    source: sourceName,
    width: variants.at(-1)?.width ?? metadata.width,
    height: variants.at(-1)?.height ?? metadata.height,
    variants,
  };
}

async function processProject(slug, folder, markdownPath) {
  const { data } = matter(await readFile(markdownPath, 'utf8'));
  const entry = { images: {}, videos: {} };
  const imageNames = new Set([data.cover, ...(Array.isArray(data.photos) ? data.photos.map((photo) => photo?.src) : []), ...(Array.isArray(data.videos) ? data.videos.map((video) => video?.poster).filter(Boolean) : [])]);
  for (const name of imageNames) {
    if (typeof name !== 'string') continue;
    assertLocalFilename(name, markdownPath, imageNamePattern);
    const sourcePath = path.join(folder, name);
    if (!existsSync(sourcePath)) continue;
    entry.images[name] = await processImage(slug, name, sourcePath);
  }
  for (const video of Array.isArray(data.videos) ? data.videos : []) {
    if (typeof video?.src !== 'string' || /^https?:\/\//i.test(video.src)) continue;
    assertLocalFilename(video.src, markdownPath, videoNamePattern);
    const sourcePath = path.join(folder, video.src);
    if (!existsSync(sourcePath)) continue;
    if (!video.poster) throw new Error(`Local MP4 ${video.src} in ${markdownPath} requires a poster image filename.`);
    assertLocalFilename(video.poster, markdownPath, imageNamePattern);
    if (!existsSync(path.join(folder, video.poster))) throw new Error(`Local MP4 ${video.src} in ${markdownPath} requires poster file ${video.poster} beside index.md.`);
    const destinationFolder = path.join(generatedRoot, slug);
    await mkdir(destinationFolder, { recursive: true });
    await copyFile(sourcePath, path.join(destinationFolder, video.src));
    entry.videos[video.src] = `/generated-media/${slug}/${video.src}`;
    videoCount += 1;
  }
  manifest.projects[slug] = entry;
}

await rm(generatedRoot, { recursive: true, force: true });
await mkdir(generatedRoot, { recursive: true });
const projectFolders = (await readdir(projectsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name !== '_template')
  .sort((a, b) => a.name.localeCompare(b.name));
for (const entry of projectFolders) {
  const folder = path.join(projectsRoot, entry.name);
  const markdownPath = path.join(folder, 'index.md');
  if (!existsSync(markdownPath)) throw new Error(`Missing required project content: ${markdownPath}`);
  await processProject(entry.name, folder, markdownPath);
}

if (existsSync(aboutPath)) {
  const { data } = matter(await readFile(aboutPath, 'utf8'));
  const photoName = data.profilePhoto?.src;
  const entry = { images: {}, videos: {} };
  if (typeof photoName === 'string') {
    assertLocalFilename(photoName, aboutPath, imageNamePattern);
    const sourcePath = path.join(root, 'content', photoName);
    if (existsSync(sourcePath)) entry.images[photoName] = await processImage('about', photoName, sourcePath);
  }
  manifest.projects.about = entry;
}

// Achievement photos sit beside their .md file and are keyed as `achievement-<slug>`.
if (existsSync(achievementsRoot)) {
  for (const file of (await readdir(achievementsRoot)).filter((name) => name.endsWith('.md')).sort()) {
    const markdownPath = path.join(achievementsRoot, file);
    const { data } = matter(await readFile(markdownPath, 'utf8'));
    const photoName = data.photo?.src;
    if (typeof photoName !== 'string') continue;
    assertLocalFilename(photoName, markdownPath, imageNamePattern);
    const sourcePath = path.join(achievementsRoot, photoName);
    if (!existsSync(sourcePath)) continue;
    const key = `achievement-${file.replace(/\.md$/, '')}`;
    manifest.projects[key] = { images: { [photoName]: await processImage(key, photoName, sourcePath) }, videos: {} };
  }
}

// A resume PDF named in content/site.json (pages.resume.file) is copied beside the generated media.
const siteSettings = JSON.parse(await readFile(path.join(root, 'content', 'site.json'), 'utf8'));
const resumeFile = siteSettings.pages?.resume?.file;
if (typeof resumeFile === 'string' && resumeFile.trim()) {
  assertLocalFilename(resumeFile, 'content/site.json (pages.resume.file)', /^[A-Za-z0-9][A-Za-z0-9._ -]*\.pdf$/i);
  const resumeSource = path.join(root, 'content', resumeFile);
  if (existsSync(resumeSource)) {
    await mkdir(path.join(generatedRoot, 'files'), { recursive: true });
    await copyFile(resumeSource, path.join(generatedRoot, 'files', resumeFile));
  }
}

const manifestPath = path.join(generatedRoot, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Prepared local media: ${imageCount} image(s), ${videoCount} MP4 video(s).`);
