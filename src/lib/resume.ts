import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { site } from './schemas';
import { assetUrl } from './url';

export interface ResumeFile { href: string; size: string; label: string }

/** The resume PDF named in content/site.json (pages.resume.file), or undefined when none is set or the file is missing. */
export function getResume(): ResumeFile | undefined {
  const file = site.pages.resume.file;
  if (!file) return undefined;
  const path = resolve(process.cwd(), 'content', file);
  if (!existsSync(path)) return undefined;
  return {
    href: assetUrl(`/generated-media/files/${encodeURIComponent(file)}`),
    size: `${Math.max(1, Math.round(statSync(path).size / 1024))} KB`,
    label: site.pages.resume.downloadLabel,
  };
}
