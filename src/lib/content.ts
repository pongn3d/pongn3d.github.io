import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { AboutSchema, AchievementSchema, ExperienceSchema, ProjectSchema, type AboutProfile, type Achievement, type Experience, type Project } from './schemas';

const root = process.cwd();
const projectRoot = resolve(root, 'content', 'projects');
const experienceRoot = resolve(root, 'content', 'experience');
const achievementRoot = resolve(root, 'content', 'achievements');
const aboutFile = resolve(root, 'content', 'about.md');
const mediaManifestPath = resolve(root, 'public', 'generated-media', 'manifest.json');

export interface ProjectDocument { project: Project; body: string }
export interface MediaVariant { src: string; width: number; height: number }
export interface ResponsiveMedia { source: string; width: number; height: number; variants: MediaVariant[] }
interface MediaManifest { projects: Record<string, { images: Record<string, ResponsiveMedia>; videos: Record<string, string> }> }

function fileError(path: string, issues: { path: PropertyKey[]; message: string }[]): never {
  const details = issues.map((issue) => `  - ${issue.path.map(String).join('.') || 'frontmatter'}: ${issue.message}`).join('\n');
  throw new Error(`Invalid content in ${path}:\n${details}`);
}

function readCollection<T>(directory: string, schema: { safeParse: (input: unknown) => { success: true; data: T } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } } }, label: string): T[] {
  if (!existsSync(directory)) throw new Error(`Missing content directory: ${directory}`);
  const files = readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.md')).sort((a, b) => a.name.localeCompare(b.name));
  const records: T[] = [];
  for (const entry of files) {
    const path = resolve(directory, entry.name);
    const parsed = matter(readFileSync(path, 'utf8'));
    const checked = schema.safeParse(parsed.data);
    if (!checked.success) fileError(path, checked.error.issues);
    const record = checked.data as T & { slug: string };
    const expectedSlug = entry.name.replace(/\.md$/, '');
    if (record.slug !== expectedSlug) throw new Error(`Slug mismatch in ${path}: filename is "${expectedSlug}" but frontmatter slug is "${record.slug}".`);
    records.push(record);
  }
  if (records.length === 0) throw new Error(`No ${label} records found in ${directory}.`);
  const slugs = records.map((record) => (record as T & { slug: string }).slug);
  if (new Set(slugs).size !== slugs.length) throw new Error(`Duplicate ${label} slug in ${directory}.`);
  return records;
}

export function readProjects(): ProjectDocument[] {
  if (!existsSync(projectRoot)) throw new Error(`Missing projects directory: ${projectRoot}`);
  const directories = readdirSync(projectRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name !== '_template').sort((a, b) => a.name.localeCompare(b.name));
  const documents = directories.map((directory) => {
    const filePath = resolve(projectRoot, directory.name, 'index.md');
    if (!existsSync(filePath)) throw new Error(`Missing required project file: ${filePath}`);
    const parsed = matter(readFileSync(filePath, 'utf8'));
    const checked = ProjectSchema.safeParse(parsed.data);
    if (!checked.success) fileError(filePath, checked.error.issues);
    if (checked.data.slug !== directory.name) throw new Error(`Project slug mismatch in ${filePath}: folder is "${directory.name}" but frontmatter slug is "${checked.data.slug}".`);
    return { project: checked.data, body: parsed.content.trim() };
  });
  const slugs = new Set(documents.map(({ project }) => project.slug));
  if (slugs.size !== documents.length) throw new Error('Project slugs must be unique.');
  const featured = documents.filter(({ project }) => project.featured).map(({ project }) => project);
  if (featured.length !== 6) throw new Error(`Expected exactly 6 featured projects but found ${featured.length}. Set featured and featuredOrder in project frontmatter.`);
  const orders = featured.map(({ featuredOrder }) => featuredOrder);
  if (orders.some((order) => order === undefined) || new Set(orders).size !== orders.length) throw new Error('Every featured project needs a unique featuredOrder.');
  const experiences = readExperiences();
  const achievements = readAchievements();
  const experienceSlugs = new Set(experiences.map((entry) => entry.slug));
  const achievementSlugs = new Set(achievements.map((entry) => entry.slug));
  for (const { project } of documents) {
    if (project.experience && !experienceSlugs.has(project.experience)) throw new Error(`Project "${project.slug}" references missing experience slug "${project.experience}".`);
    if (project.achievement && !achievementSlugs.has(project.achievement)) throw new Error(`Project "${project.slug}" references missing achievement slug "${project.achievement}".`);
    for (const relatedSlug of project.relatedProjects) {
      if (relatedSlug === project.slug) throw new Error(`Project "${project.slug}" cannot relate to itself.`);
      if (!slugs.has(relatedSlug)) throw new Error(`Project "${project.slug}" references missing related project slug "${relatedSlug}".`);
    }
  }
  return documents;
}

export function readFeaturedProjects(): Project[] {
  return readProjects().map(({ project }) => project).filter((project) => project.featured).sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

function monthRank(value: string): number {
  if (value === 'present') return 999999;
  return Number(value.replace('-', ''));
}

export function sortProjectsNewest(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => monthRank(b.endDate) - monthRank(a.endDate) || monthRank(b.startDate) - monthRank(a.startDate) || a.title.localeCompare(b.title));
}

export function formatMonth(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDateRange(start: string, end: string): string {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

export function sortExperiencesNewest(experiences: Experience[]): Experience[] {
  return [...experiences].sort((a, b) => monthRank(b.endDate) - monthRank(a.endDate) || monthRank(b.startDate) - monthRank(a.startDate) || a.title.localeCompare(b.title));
}

export function readExperiences(): Experience[] {
  return readCollection(experienceRoot, ExperienceSchema, 'experience');
}

export function readAchievements(): Achievement[] {
  return readCollection(achievementRoot, AchievementSchema, 'achievement');
}

export function readAbout(): AboutProfile {
  if (!existsSync(aboutFile)) throw new Error(`Missing required About content file: ${aboutFile}`);
  const parsed = matter(readFileSync(aboutFile, 'utf8'));
  const checked = AboutSchema.safeParse(parsed.data);
  if (!checked.success) fileError(aboutFile, checked.error.issues);
  return checked.data;
}

export function projectsForExperience(slug: string): Project[] {
  return sortProjectsNewest(readProjects().map(({ project }) => project).filter((project) => project.experience === slug));
}

export function projectsForAchievement(slug: string): Project[] {
  return sortProjectsNewest(readProjects().map(({ project }) => project).filter((project) => project.achievement === slug));
}

function readMediaManifest(): MediaManifest {
  if (!existsSync(mediaManifestPath)) return { projects: {} };
  try { return JSON.parse(readFileSync(mediaManifestPath, 'utf8')) as MediaManifest; }
  catch (error) { throw new Error(`Could not read generated media manifest ${mediaManifestPath}: ${String(error)}`); }
}

export function getResponsiveMedia(slug: string, source: string): ResponsiveMedia | undefined {
  return readMediaManifest().projects[slug]?.images[source];
}

export function getProcessedVideo(slug: string, source: string): string | undefined {
  return readMediaManifest().projects[slug]?.videos[source];
}
