import { z } from 'zod';
import siteSource from '../../content/site.json';
import taxonomySource from '../../content/taxonomy.json';

const WorkPageSchema = z.object({
  title: z.string().min(1), description: z.string().min(1), eyebrow: z.string().min(1), heading: z.string().min(1), intro: z.string().min(1),
  gridLabel: z.string().min(1), archiveLabel: z.string().min(1), viewToggleLabel: z.string().min(1), clearFiltersLabel: z.string().min(1), categoryLabel: z.string().min(1), allCategoriesLabel: z.string().min(1),
  tagSummaryLabel: z.string().min(1), tagMatchHint: z.string().min(1), resultPrefix: z.string().min(1), projectSingular: z.string().min(1), projectPlural: z.string().min(1), emptyMessage: z.string().min(1),
  archiveDateLabel: z.string().min(1), archiveTitleLabel: z.string().min(1), archiveCategoryLabel: z.string().min(1), archiveTagsLabel: z.string().min(1),
});
const ProjectPageSchema = z.object({
  titleSuffix: z.string().min(1), contextLabel: z.string().min(1), overviewHeading: z.string().min(1), whatIDidHeading: z.string().min(1), processHeading: z.string().min(1),
  resultsHeading: z.string().min(1), learningHeading: z.string().min(1), galleryHeading: z.string().min(1), projectNumberLabel: z.string().min(1), roleLabel: z.string().min(1),
  toolsLabel: z.string().min(1), toolsPlaceholder: z.string().min(1), datesLabel: z.string().min(1), coverPlaceholder: z.string().min(1), photoPlaceholder: z.string().min(1), videoPlaceholder: z.string().min(1),
  previousLabel: z.string().min(1), nextLabel: z.string().min(1), allWorkLabel: z.string().min(1), noResultsLabel: z.string().min(1), relatedProjectsLabel: z.string().min(1),
});
const GeneralPageSchema = z.object({
  title: z.string().min(1), description: z.string().min(1), eyebrow: z.string().min(1), heading: z.string().min(1), intro: z.string().optional(),
  relatedProjectsLabel: z.string().optional(), relatedProjectLabel: z.string().optional(),
});

export const SiteSchema = z.object({
  name: z.string().min(1), wordmark: z.string().min(1), tagline: z.string().min(1), siteUrl: z.union([z.literal(''), z.url()]),
  assets: z.object({ logoMark: z.string().startsWith('/'), faviconSvg: z.string().startsWith('/'), faviconPng: z.string().startsWith('/'), appleTouchIcon: z.string().startsWith('/') }),
  hero: z.object({
    eyebrow: z.string().min(1), headlineLineOne: z.string().min(1), headlineLineTwo: z.string().min(1), headlineAccent: z.string().min(1), intro: z.string().min(1),
    currentlyLabel: z.string().min(1), currentlyRole: z.string().min(1), modelPath: z.string(), canvasLabel: z.string().min(1), spinButtonLabel: z.string().min(1), dragHintLabel: z.string().min(1), scrollLabel: z.string().min(1),
  }),
  credentials: z.array(z.string().min(1)),
  navigation: z.array(z.object({ label: z.string().min(1), href: z.string().min(1), variant: z.enum(['contact']).optional() })).min(1),
  homepage: z.object({ credentialsLabel: z.string().min(1), featuredEyebrow: z.string().min(1), featuredHeading: z.string().min(1), featuredLink: z.string().min(1), featuredLinkHref: z.string().min(1), imagePlaceholderPrefix: z.string().min(1), imagePlaceholderAlt: z.string().min(1) }),
  pages: z.object({
    work: WorkPageSchema, project: ProjectPageSchema,
    experience: GeneralPageSchema, achievements: GeneralPageSchema,
    about: GeneralPageSchema.extend({ educationHeading: z.string().min(1), courseworkHeading: z.string().min(1), skillsHeading: z.string().min(1), languagesHeading: z.string().min(1), scoresHeading: z.string().min(1), profilePlaceholder: z.string().min(1), gpaLabel: z.string().min(1), cumulativeGpaLabel: z.string().min(1), ieltsLabel: z.string().min(1), toeicLabel: z.string().min(1), overallLabel: z.string().min(1), listeningLabel: z.string().min(1), readingLabel: z.string().min(1), writingLabel: z.string().min(1), speakingLabel: z.string().min(1) }),
    resume: GeneralPageSchema.extend({ downloadPlaceholder: z.string().min(1), contactLabel: z.string().min(1) }),
    contact: GeneralPageSchema.extend({ emailLabel: z.string().min(1), linkedinLabel: z.string().min(1), githubLabel: z.string().min(1) }),
    notFound: GeneralPageSchema.extend({ homeLabel: z.string().min(1), workLabel: z.string().min(1) }),
  }),
  contact: z.object({ email: z.email(), linkedin: z.url(), github: z.url() }),
  footer: z.object({ manifesto: z.string().min(1), copyrightName: z.string().min(1), backToTopLabel: z.string().min(1), socialLabels: z.object({ email: z.string().min(1), linkedin: z.string().min(1), github: z.string().min(1) }) }),
  labels: z.object({ skipToContent: z.string().min(1), primaryNavigation: z.string().min(1), footerNavigation: z.string().min(1), socialLinks: z.string().min(1), menuButton: z.string().min(1), openMenu: z.string().min(1), closeMenu: z.string().min(1) }),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1), titleContext: z.string().min(1), openGraphImage: z.string().min(1), keywords: z.array(z.string().min(1)).min(3).max(8), openGraphImageAlt: z.string().min(1) }),
});

function parseStatic<T>(schema: z.ZodType<T>, input: unknown, file: string): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`).join('\n');
    throw new Error(`Invalid ${file}:\n${issues}`);
  }
  return parsed.data;
}

export const site = parseStatic(SiteSchema, siteSource, 'content/site.json');
export const TaxonomySchema = z.object({
  categories: z.array(z.string().min(1)).min(1).refine((values) => new Set(values).size === values.length, 'Categories must be unique'),
  tags: z.array(z.string().min(1)).min(1).refine((values) => new Set(values).size === values.length, 'Tags must be unique'),
});
export const taxonomy = parseStatic(TaxonomySchema, taxonomySource, 'content/taxonomy.json');

const CategorySchema = z.enum(taxonomy.categories as [string, ...string[]]);
const tagSet = new Set(taxonomy.tags);
const safeImageFilename = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._ -]*\.(?:jpe?g|png|webp)$/i, 'Use a local JPG, PNG or WebP image filename without folders');
const safeVideoFilename = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._ -]*\.mp4$/i, 'Use a local MP4 video filename without folders');

export const PhotoSchema = z.object({ src: safeImageFilename, alt: z.string().min(1) });
export const VideoSchema = z.object({
  src: z.union([safeVideoFilename, z.url().refine((src) => /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com)\//i.test(src), 'Use a YouTube or Vimeo URL')]),
  poster: safeImageFilename.optional(), alt: z.string().min(1),
}).superRefine((video, ctx) => {
  if (!/^https?:\/\//i.test(video.src) && !video.poster) {
    ctx.addIssue({ code: 'custom', path: ['poster'], message: 'A local MP4 requires a poster image filename.' });
  }
});

export const ProjectSchema = z.object({
  title: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase hyphenated slug'), category: CategorySchema,
  tags: z.array(z.string()).refine((tags) => tags.every((tag) => tagSet.has(tag)), 'Every tag must exist in content/taxonomy.json'),
  startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM'), endDate: z.string().regex(/^(present|\d{4}-(0[1-9]|1[0-2]))$/, 'Use YYYY-MM or present'),
  role: z.string().min(1), context: z.string().min(1), featured: z.boolean(), featuredOrder: z.number().int().positive().optional(), summary: z.string().min(1),
  results: z.array(z.string()), spec: z.string().min(1), tools: z.array(z.string()), cover: safeImageFilename, coverAlt: z.string().min(1), photos: z.array(PhotoSchema).default([]), videos: z.array(VideoSchema).default([]),
  overview: z.string().min(1), whatIDid: z.array(z.string()).min(1), process: z.array(z.string()).min(1), learning: z.string().min(1),
  experience: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), achievement: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  relatedProjects: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
});

export const ExperienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().min(1), organization: z.string().min(1), location: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), endDate: z.string().regex(/^(present|\d{4}-(0[1-9]|1[0-2]))$/), summary: z.string().min(1),
  contributions: z.array(z.string()).min(1), metrics: z.array(z.string()), recognition: z.array(z.string()).default([]),
});
export const AchievementSchema = z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().min(1), date: z.string().min(1), event: z.string().min(1), result: z.string().optional(), summary: z.string().min(1), photo: z.object({ src: z.string().min(1), alt: z.string().min(1) }).optional() });
const SkillGroupSchema = z.object({ name: z.string().min(1), items: z.array(z.string().min(1)).min(1) });
export const AboutSchema = z.object({
  bio: z.string().min(1), profilePhoto: z.object({ src: safeImageFilename, alt: z.string().min(1) }), degree: z.string().min(1), institution: z.string().min(1), educationDates: z.string().min(1),
  gpa: z.string().min(1), cumulativeGpa: z.string().min(1), coursework: z.array(z.string().min(1)), skills: z.array(SkillGroupSchema).min(1), languages: z.array(z.object({ name: z.string().min(1), level: z.string().min(1) })).min(1),
  ielts: z.object({ overall: z.string().min(1), listening: z.string().min(1), reading: z.string().min(1), writing: z.string().min(1), speaking: z.string().min(1) }), toeic: z.string().min(1),
});

export type SiteSettings = z.infer<typeof SiteSchema>;
export type Taxonomy = z.infer<typeof TaxonomySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type AboutProfile = z.infer<typeof AboutSchema>;
