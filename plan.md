# Pongnapat portfolio implementation plan

## Scope and build sequence

Follow `/home/ubuntu/upload/portfolio-prompt.md` as the factual source of truth. The project inventory is **exactly 16 projects**, six featured, five experience roles and four competition/achievement entries. Robocon, hackathon and Jinpao appearances are achievement/experience entries that link to existing projects, not separate project records. No additional project should be invented. Missing personal text, resume PDF and all project media remain visible, filename-specific TODO placeholders. Never display a phone number.

The current user-approved stage is to revise the homepage's design and details, prepare a reusable CAD-style title-block component, and show fresh desktop and 390px-wide mobile previews. Stop at those previews and do not build other pages until the user reviews them. The larger site scope remains Work grid/archive with category/tag filters, all 16 project details, Experience timeline, Competitions & Achievements, About, Resume and Contact. The existing first-stage data contains only the six featured records; later pages remain unbuilt.

## Implementation approach

Use **Astro, TypeScript and plain CSS**, with a small dynamically imported Three.js module for the hero. Generate content-bearing static HTML; no server or database is required. Keep the configured development service on `0.0.0.0:3000`; production output is `dist/`. The site must not call Manus APIs or require Manus storage/hosting.

Self-host **Space Grotesk** weights 400 and 500 for headings and body, plus **JetBrains Mono** for labels, dates, categories, numbers, tags and engineering specs. Include each font's license. Keep family choices in CSS custom properties. The warm ivory/brown/terracotta palette, layout, facts and hero sculpture remain; make “life.” upright and terracotta. Add restrained numbered mono labels, thin project-image crop marks, a very faint dot grid behind the hero only, and mono result-spec lines from supplied numeric results. Prepare a reusable title-block component for project pages with role, tools, dates and project number.

Replace the spark with Pongnapat's supplied P mark. Store the transparent mark and favicon as standalone SVG files; reference their paths from `content/site.json`, and use the mark file from the shared wordmark and image generator instead of duplicating SVG path data in components. A local asset-generation script reads those sources and creates `favicon-32.png`, a 180px Apple touch icon and the Open Graph PNG. Document regeneration in README. Use only the logo SVG supplied in the attachment; don't replace it with generated or stock artwork.

Use Markdown plus frontmatter for projects, experience, achievements and About; JSON for site settings and taxonomy. A central Zod-validated loader reads content, checks required fields, categories/tags and slug relationships, excludes `_template`, and drives featured ordering, archive sorting and related-project lists automatically. Site settings hold editable copy, navigation, assets/contact, and the hero model path. Existing project data remains factual; result specs show only provided measurements (for example `44.2 mm · 0.57 N` and `0.2 mm · 0.5° · 600 mm/s`).

Install/update the pinned local font packages before copying their WOFF2 assets to `public/fonts/`; retain upstream OFL licenses and source attribution. Use the existing `sharp` dependency to generate icons and OG artwork in a deterministic script invoked during dev start and static build. Uploaded future project photos remain local content; media conversion, archive and related-content behavior belong to later phases.

Keep route-specific titles/descriptions, the existing route manifest and locally generated OG image. Do not guess a canonical origin; expose `siteUrl` in settings and omit origin-dependent metadata until configured. Keep source portable to Vercel, Netlify and GitHub Pages. The Git repository and bundle remain pushable to a GitHub repository chosen by the user; do not push to an unprovided GitHub account/repository.

## Project structure

- `content/site.json`: identity, editable interface copy, font-independent site settings, asset paths, hero copy/model path, credentials, navigation, footer and contact details.
- `content/taxonomy.json`: primary categories and supported tags.
- `content/projects/<slug>/index.md`: project frontmatter/narrative and media; `_template/index.md` is documented and excluded.
- `content/experience/<slug>.md`, `content/achievements/<slug>.md`, `content/about.md`: schema-checked roles, awards and profile material in later phases.
- `src/lib/content.ts` and `src/lib/schemas.ts`: validation, sorting, relationships and content helpers.
- `src/layouts/BaseLayout.astro`: semantic page shell, metadata and shared navigation/footer.
- `src/components/`: shared wordmark, hero, featured cards, neutral placeholders and reusable `ProjectTitleBlock.astro`.
- `src/scripts/sculpture.ts`: lazy Three.js sculpture or configured GLB model, pointer/spin controls and reduced-motion behavior.
- `src/pages/`: homepage now; later Work, 16 static project routes, Experience, Achievements, About, Resume, Contact and 404.
- `src/styles/global.css`: CSS design tokens, responsive layouts, CAD-like details and accessible interaction states.
- `public/fonts/`, `public/favicon.svg`, `public/logo-mark.svg`, `public/og-image.svg`, `public/manus-routes.json`: self-hosted source assets and route declaration; generated PNG files are reproducible.
- `scripts/`: deterministic favicon/OG generation now; content/media preparation in later phases.
- `README.md`, `TODO.md`, `plan.md`: local setup/asset regeneration/deployment instructions, outcome criteria and implementation decisions.

## Design

**Design movement:** engineering editorial, combining the brief's warm creative-studio restraint with subtle CAD-drawing conventions.

**Core principles:** keep the person and real work primary; use clear technical hierarchy rather than decorative panels; limit engineering cues to useful labels, crop marks and measurements; keep missing content honest and editable.

**Color philosophy:** ivory `#f5f1e9` remains the calm paper-like field; dark brown `#542f28` carries readable text; muted brown `#8b7566` supports secondary details; terracotta `#e17145` and deep terracotta `#b66143` add an ownable human accent. Thin `#dcd3c6` rules organize the page. The engineering details stay low-contrast and sparse, never a dense interface texture.

**Layout paradigm:** retain the asymmetrical two-column hero with large left-aligned text and a spacious right-hand sculpture stage. A credentials rule leads into six airy project previews. Crop-mark frames and small mono specs make cards feel documented rather than boxed. On mobile, stack text and sculpture, keep Contact visible, use 3:2 project covers and prevent horizontal overflow.

**Signature elements:** the supplied P mark next to lowercase `pongnapat.` with a terracotta period; a faint hero-only dot grid and corner crop marks; the inflated orange six-lobed form with two orbiting pearls.

**Interaction philosophy:** semantic links, visible focus, keyboard-usable controls and familiar navigation. The spin pill remains a real button. Desktop fine pointers may drag; touch remains page-scrollable and gets no “desktop drag” hint. Later Work controls update grid/archive and expose result counts accessibly.

**Animation:** preserve slow sculpture float/rotation and pearl orbits with a soft blurred CSS shadow; use only restrained hover lifts and scroll fades. Reduced motion yields a still pose and suppresses animated transitions/spins. WebGL failure shows the static original silhouette.

**Typography system:** self-hosted Space Grotesk weight 400 for body and 400/500 for headings. Use JetBrains Mono for labels, dates, categories, numbers, tags and results. “life.” is upright terracotta. Do not synthesize a serif italic. Small technical labels remain legible and use restrained tracking.

**Brand essence:** a personal portfolio and lasting archive for a robotics student working across mechanisms, electronics, control and bio-inspired research. Personality: precise, curious, warm.

**Brand voice:** direct, concise and personal, not corporate. Example lines: “Mechanisms that move. Ideas with a little life.” and “Currently — Research Intern at VISTEC.” Additional editorial phrasing must remain non-factual or explicitly TODO when missing from the brief.

**Wordmark and logo:** lowercase `pongnapat.` with terracotta punctuation and the user's transparent P mark; source SVGs are replaceable files whose paths are held in settings. Generate the favicon and social image from those sources with the build script.

**Signature brand color:** terracotta `#e17145`; hero sculpture orange `#f36c2e` is reserved for the playful 3D object.
