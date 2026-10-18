import { z } from 'zod';
import siteSource from '../../content/site.json';
import taxonomySource from '../../content/taxonomy.json';

export const SiteSchema = z.object({
  name: z.string().min(1),
  wordmark: z.string().min(1),
  tagline: z.string().min(1),
  siteUrl: z.union([z.literal(''), z.url()]),
  hero: z.object({
    eyebrow: z.string().min(1),
    headlineLineOne: z.string().min(1),
    headlineLineTwo: z.string().min(1),
    headlineAccent: z.string().min(1),
    intro: z.string().min(1),
    currentlyLabel: z.string().min(1),
    currentlyRole: z.string().min(1),
    modelPath: z.string(),
    canvasLabel: z.string().min(1),
    spinButtonLabel: z.string().min(1),
    dragHintLabel: z.string().min(1),
    scrollLabel: z.string().min(1),
  }),
  credentials: z.array(z.string().min(1)),
  navigation: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })),
  homepage: z.object({
    credentialsLabel: z.string().min(1),
    featuredEyebrow: z.string().min(1),
    featuredHeading: z.string().min(1),
    featuredLink: z.string().min(1),
    featuredLinkHref: z.string().min(1),
    imagePlaceholderPrefix: z.string().min(1),
    imagePlaceholderAlt: z.string().min(1),
  }),
  contact: z.object({
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
  }),
  footer: z.object({
    manifesto: z.string().min(1),
    copyrightName: z.string().min(1),
    backToTopLabel: z.string().min(1),
    socialLabels: z.object({
      email: z.string().min(1),
      linkedin: z.string().min(1),
      github: z.string().min(1),
    }),
  }),
  labels: z.object({
    skipToContent: z.string().min(1),
    primaryNavigation: z.string().min(1),
    footerNavigation: z.string().min(1),
    socialLinks: z.string().min(1),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    openGraphImage: z.string().min(1),
    keywords: z.array(z.string().min(1)).min(3).max(8),
    openGraphImageAlt: z.string().min(1),
  }),
});

export const TaxonomySchema = z.object({
  categories: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1),
});

export const site = SiteSchema.parse(siteSource);
export const taxonomy = TaxonomySchema.parse(taxonomySource);

export const PhotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const VideoSchema = z.object({
  src: z.string().min(1).refine(
    (src) =>
      /\.mp4(?:$|\?)/i.test(src) ||
      /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com)\//i.test(src),
    'Expected a local MP4 file or a YouTube/Vimeo URL',
  ),
  poster: z.string().optional(),
  alt: z.string().optional(),
});

const CategorySchema = z.enum(taxonomy.categories as [string, ...string[]]);
const TagSet = new Set(taxonomy.tags);

export const ProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase hyphenated slug'),
  category: CategorySchema,
  tags: z.array(z.string()).refine(
    (tags) => tags.every((tag) => TagSet.has(tag)),
    'Every tag must exist in content/taxonomy.json',
  ),
  startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM'),
  endDate: z.string().regex(/^(present|\d{4}-(0[1-9]|1[0-2]))$/, 'Use YYYY-MM or present'),
  role: z.string().min(1),
  context: z.string().min(1),
  featured: z.boolean(),
  featuredOrder: z.number().int().positive().optional(),
  summary: z.string().min(1),
  results: z.array(z.union([z.string(), z.number()])),
  cover: z.string().min(1),
  photos: z.array(PhotoSchema),
  videos: z.array(VideoSchema),
  experience: z.string().optional(),
  achievement: z.string().optional(),
});

export type SiteSettings = z.infer<typeof SiteSchema>;
export type Taxonomy = z.infer<typeof TaxonomySchema>;
export type Project = z.infer<typeof ProjectSchema>;
