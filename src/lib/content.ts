import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { ProjectSchema, type Project } from './schemas';

const projectsDirectory = resolve(process.cwd(), 'content', 'projects');

export interface ProjectDocument {
  project: Project;
  body: string;
}

export function readProjects(): ProjectDocument[] {
  if (!existsSync(projectsDirectory)) return [];

  const directories = readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '_template')
    .sort((left, right) => left.name.localeCompare(right.name));

  return directories.flatMap((directory) => {
    const filePath = resolve(projectsDirectory, directory.name, 'index.md');
    if (!existsSync(filePath)) return [];

    const parsed = matter(readFileSync(filePath, 'utf8'));
    const result = ProjectSchema.safeParse(parsed.data);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `  - ${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
        .join('\n');
      throw new Error(`Invalid project frontmatter in ${filePath}:\n${details}`);
    }
    if (result.data.slug !== directory.name) {
      throw new Error(`Project slug mismatch in ${filePath}: folder is "${directory.name}" but frontmatter slug is "${result.data.slug}".`);
    }

    return [{ project: result.data, body: parsed.content.trim() }];
  });
}

export function readFeaturedProjects(): Project[] {
  return readProjects()
    .map(({ project }) => project)
    .filter((project) => project.featured)
    .sort((left, right) => (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (right.featuredOrder ?? Number.MAX_SAFE_INTEGER));
}
