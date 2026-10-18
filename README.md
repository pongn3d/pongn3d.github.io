# Pongnapat Portfolio — engineering-style homepage review build

This is the revised homepage review stage. It keeps the warm ivory/brown/terracotta palette, spacious layout, factual content and interactive Three.js hero, with Space Grotesk, JetBrains Mono, subtle drafting details and Pongnapat's supplied P mark. It includes six featured-project summaries and a reusable CAD-style project title-block component. The Work archive, project detail pages, Experience, Competitions & Achievements, About, Resume and Contact routes remain for later stages.

## Run locally

Requirements: Node.js 22 or newer and the pinned pnpm version in `package.json`.

```sh
pnpm install
pnpm dev
```

Astro serves the site on `http://localhost:3000`. The dev command generates the favicon and social-image PNGs before serving. The homepage and local assets work without a Manus account, backend, database or Manus Storage. `public/manus-routes.json` is an optional static declaration and is not read by the website.

## Self-hosted fonts and logo assets

Space Grotesk weights 400 and 500 are used for headings and body copy. JetBrains Mono is used for labels, dates, categories, numbers and result specs. Both are self-hosted as Latin WOFF2 and include their SIL Open Font License notices in `public/fonts/`; see [`public/fonts/SOURCES.md`](public/fonts/SOURCES.md). The font-family CSS variables are near the top of `src/styles/global.css`.

`public/favicon.svg` and `public/logo-mark.svg` are the source artwork. Their paths are held in `content/site.json` under `assets`. Update those SVGs, preserve the logo mark's `p-mark` ID, then regenerate the 32px favicon, 180px Apple touch icon and Open Graph PNG with:

```sh
node scripts/generate-assets.mjs
```

Both `pnpm dev` and `pnpm build` run this script automatically. The generated files are local build outputs, not external dependencies.

## Build a static site

```sh
pnpm run check
pnpm run build
```

The generated website is in `dist/`. Set `siteUrl` in `content/site.json` only after choosing the real public site origin; canonical and absolute sharing tags are intentionally omitted until then.

For a GitHub Pages project site hosted beneath a repository path, set the path prefix at build time, for example:

```sh
SITE_BASE=/my-portfolio pnpm run build
```

For root-domain hosting (including Vercel or Netlify), omit `SITE_BASE` or set it to `/`.

## Source repository

The companion file `pongnapat-homepage.bundle` is a Git bundle, not a ZIP of loose files. To clone this homepage snapshot and push it to a GitHub repository you own:

```sh
git clone --branch main pongnapat-homepage.bundle pongnapat
cd pongnapat
git remote set-url origin https://github.com/YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

This bundle reflects the current homepage review stage. It should be refreshed after the remaining routes and content system are complete.

## Content and media status

The six featured-project summaries currently live in `content/projects/<slug>/index.md`; homepage identity, labels, contact links, project taxonomy and image/model settings are in `content/site.json` and `content/taxonomy.json`. Visible project covers are neutral filename placeholders because no project media has been supplied. The full schema-driven 16-project inventory, media conversion pipeline, archive and related-content links are planned for later stages. Project facts and result values must remain as supplied in the original brief.
