# Pongnapat — Robotics & Automation portfolio

A static Astro portfolio for Pongnapat Arayangkul, built from editable Markdown and JSON content. It has no app server, database, Manus API, Manus Storage or runtime Manus hosting dependency: page HTML, fonts, icons, images, videos and the Three.js hero assets are served as static/local files. The `app.config.ts` logo URL is separate WebDev dashboard branding metadata; the website does not request it.

## Run locally

Requirements: Node.js 22 or newer and pnpm 11.25.0 (the exact package-manager version is pinned in `package.json`). With pnpm available:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Astro serves the site at `http://localhost:3000`. Before serving, the dev command generates responsive WebP media and local favicon/Open Graph PNGs from the committed source files.

Run diagnostics and create the production site with:

```sh
pnpm run check
pnpm run build
```

The build is fully static and writes to `dist/`. `pnpm preview` serves that build locally on port 3000. The checked-in `public/manus-routes.json` is an optional static route declaration for preview tooling only; website code never reads it.

## Edit the site settings and taxonomy

- `content/site.json` contains the name, wordmark, tagline, homepage copy, credentials, navigation, page headings/labels, footer, contact URLs, SEO defaults, canonical site origin and logo/icon paths. Update this file to change visible labels or links instead of editing UI components.
- Set `siteUrl` in `content/site.json` only after selecting the real public origin (for example, `https://portfolio.example`). Until then, the site intentionally omits canonical URLs and absolute sharing-image URLs rather than inventing a domain.
- `content/taxonomy.json` is the source of allowed project categories and tags. Each project has exactly one category from the five listed categories and any supported tags. A misspelled or unknown category/tag fails validation with a file-specific message.
- `content/about.md` contains the editable biography, profile photo, education, coursework, grouped skills, languages and test scores.

## Add or edit a project

1. Copy `content/projects/_template/` to `content/projects/<lowercase-hyphenated-slug>/`.
2. Rename/edit `index.md`. The frontmatter template documents the required fields: title, slug, category, tags, `startDate`, `endDate` (`YYYY-MM` or `present`), role, context, featured flag/order, one-line summary, factual result/spec, tools, cover filename/alt text, photo/video entries and narrative sections. Optional `experience`, `achievement` and `relatedProjects` fields point to existing entry/project slugs. Do not invent a role, measurement, tool, result or personal statement when one has not been supplied; retain a visible `[TODO: ...]` placeholder instead.
3. Put original JPG, JPEG, PNG or WebP files beside that project’s `index.md`, using the filenames in its frontmatter (for example, `cover.jpg`, `photo-1.jpg`, `photo-2.jpg`, `video-1-poster.jpg`). Add accurate alt text to every referenced image. No manual image resizing is needed: the pre-build media script creates responsive WebP variants at appropriate widths in `public/generated-media/<slug>/`.
4. Short local MP4s may be added beside `index.md` and referenced as `video-1.mp4`. Each local MP4 requires the poster image named in its `poster` field (for example, `video-1-poster.jpg`); the media preparation step fails with a file-specific message if that poster is missing. MP4s are copied into the generated public media folder and presented muted, looping and playsinline. Longer YouTube/Vimeo URLs are embedded lazily. Videos never autoplay with sound.
5. Set `featured: true` and a unique `featuredOrder` to include a record in the homepage’s six-item featured section. The Work grid/archive and category/tag filters include all records automatically; do not edit a page component to add a project.

The source images/videos are project files and should be committed with the content. `public/generated-media/` is generated and ignored by Git; regenerate it with `pnpm run prepare:media` (also run automatically by `dev`, `check` and `build`). The About profile image, if supplied, lives at `content/profile.jpg` or another image filename set in `content/about.md`.

## Edit Experience and Achievements

- Add one `content/experience/<slug>.md` per role. Use the fields documented in the existing records: role/title, organization, `startDate`, `endDate`, summary, contributions, optional recognition/metrics and related project slugs. Projects that point to that experience slug populate its related-project list automatically.
- Add one `content/achievements/<slug>.md` per award or competition entry. Point it at the related project slug; the corresponding project’s relationship is validated and linked automatically. Robocon, the NTU Hackathon and Jinpao records are achievements/experience, not extra project records.
- To show a photo on the right of an achievement, put the image beside its `.md` file (for example `content/achievements/ntu-hackathon-2026.jpg`) and add `photo:` with `src` and `alt` to its frontmatter. Entries without a photo are unchanged. The build resizes the image automatically.

Zod schemas and cross-link checks live in `src/lib/schemas.ts` and `src/lib/content.ts`. The `_template` folder is excluded from the 16-project count and from generated routes. Invalid required fields, duplicate slugs and broken project/experience/achievement relationships stop the build with a clear error.

## Logo, icons and fonts

- The single transparent P mark is `public/logo-mark.svg`; the dark-backed favicon source is `public/favicon.svg`. Their paths are configurable in `content/site.json`. Keep the existing `p-mark` SVG fragment identifier when editing the logo source; the shared wordmark references it.
- Regenerate the 32px favicon, 180px Apple touch icon and 1200×630 Open Graph PNG after a logo change with `node scripts/generate-assets.mjs` (also run automatically before `dev`, `check` and `build`). The OG asset script reads the configured logo and font paths; the source SVG files are kept in Git.
- Space Grotesk 400/500 and JetBrains Mono 400/500 are self-hosted as local Latin WOFF2 assets in `src/fonts/`. Vite fingerprints them in the static build. Their SIL Open Font License notices and source provenance are in `public/fonts/`.

## Deploy as a static site


Deploy the generated `dist/` directory to GitHub Pages, Netlify, Vercel or another static host. No server-side service needs to be provisioned. For a root domain, omit `SITE_BASE` (or set it to `/`). For a GitHub Pages project site under a repository path, set the path during the build, e.g.:

```sh
SITE_BASE=/my-portfolio pnpm run build
```

Use the same path value, without a trailing slash, as the repository path. Configure the real public origin separately in `content/site.json` → `siteUrl` when ready; that enables canonical and absolute Open Graph URLs. The app’s local routes and generated assets respect Astro’s base path.

## Git source bundle

The handoff includes `pongnapat-source.bundle`, a real Git bundle with the project’s `main` history—not an archive of loose files. To clone the source and push it to a GitHub repository you own:

```sh
git clone --branch main pongnapat-source.bundle pongnapat
cd pongnapat
git remote set-url origin https://github.com/YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

The bundle is a companion download and is not tracked inside the project. Replace the example GitHub URL with your own repository; no GitHub credentials or repository were supplied for an Agent-side push.
