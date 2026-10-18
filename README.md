# Pongnapat Portfolio — homepage review build

This is the first review stage of Pongnapat Arayangkul's portfolio. It contains the responsive homepage, its six editable featured-project summaries, self-hosted fonts and local Open Graph artwork, plus the Three.js hero sculpture. The Work archive, detailed project pages, full experience and achievement sections, About, Resume and Contact pages are later stages and are not included yet.

## Run locally

Requirements: Node.js 22 or newer and the pinned pnpm version in `package.json`.

```sh
pnpm install
pnpm dev
```

Astro serves the site on `http://localhost:3000`. The homepage and included visual assets run without a Manus account, backend, database or Manus Storage. `public/manus-routes.json` is an optional static route declaration and is not read by the website.

## Build a static site

```sh
pnpm run check
pnpm run build
```

The generated website is in `dist/`. The build renders `public/og-image.png` locally from the source artwork and local fonts. Set `siteUrl` in `content/site.json` only after choosing the real public site origin; origin-dependent canonical and sharing tags are intentionally omitted until then.

For a GitHub Pages project site hosted beneath a repository path, set the path prefix at build time, for example:

```sh
SITE_BASE=/my-portfolio pnpm run build
```

For root-domain hosting (including Vercel or Netlify), omit `SITE_BASE` or set it to `/`.

## Source repository

The included `pongnapat-homepage.bundle` is a Git bundle, not a ZIP of loose files. To clone this homepage snapshot and push it to a GitHub repository you own:

```sh
git clone --branch main pongnapat-homepage.bundle pongnapat
cd pongnapat
git remote set-url origin https://github.com/YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

The bundle reflects this homepage review stage. The final bundle should be refreshed after the remaining pages and content system are completed.

## Content and media status

The six featured-project summaries currently live in `content/projects/<slug>/index.md`; homepage identity, labels, contact links, project taxonomy and image/model settings are in `content/site.json` and `content/taxonomy.json`. Their visible cover/photo names are neutral placeholders because no project media has been supplied. The complete schema-driven project ingestion, image conversion pipeline, archive, related-content links and editing guide are planned for the next stages; add media automation only after that content model exists.
