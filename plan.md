# Pongnapat portfolio implementation plan

## Scope and sequence

The original brief is the factual source of truth; the user has now confirmed there are exactly 16 project records. Robocon, the hackathon and Jinpao are experience/achievement entries that point to existing projects, never additional projects. Do not invent facts, numbers, quotes, roles, links, media or personal prose. Use visible `[TODO: ...]` placeholders where the source does not supply something. The homepage has been approved; first make the two requested adjustments (updated supplied P-mark artwork and compact accessible mobile menu), then follow the original build order: schema-backed content and Work grid/archive/filters; all 16 project pages; Experience and Competitions & Achievements; About, Resume, Contact and 404; responsive/accessibility pass and complete README. The requested final review is desktop and 390px for Work grid, Work archive, the 2-DOF Vertical RP Plotter page, Experience and About. Also verify the mobile header at 360px.

## Implementation approach

Continue the existing Astro 6 / TypeScript / plain CSS static site and preserve its port-3000 development service and `SITE_BASE` portability for Vercel, Netlify and GitHub Pages. No server, database, login, Manus API or Manus Storage is needed. Keep initial route content in static HTML. Use existing pinned Zod, `gray-matter`, `sharp`, Three.js and self-hosted fonts; add only a small Markdown renderer if required for project narratives. Keep diagnostics registered for TypeScript, JavaScript, JSON, HTML and CSS.

Use the supplied updated SVG exactly as `public/favicon.svg` and the transparent `public/logo-mark.svg`; the shared wordmark references that file rather than duplicating its paths. Keep logo/favicon paths in `content/site.json`. The existing asset script reads those paths and creates a 32px favicon, 180px Apple touch icon and OG PNG. Refresh the project-level HTTPS logo metadata separately; it is not loaded by the website. On widths below 600px, keep only the mark/wordmark and an accessible menu button in the header; its expanded panel contains Work, Experience, About and Contact. With JavaScript unavailable, leave links visible. Preserve the approved Space Grotesk 400/500 and JetBrains Mono 400/500 fonts, engineering-editorial layout, palette, result specs, crop marks, faint hero-only dot grid, 3D sculpture, reduced-motion behavior and optional model path.

Build a central `src/lib/content.ts` loader with Zod schemas for site settings, taxonomy, projects, experiences, achievements and About. Load `content/projects/<slug>/index.md`, `content/experience/<slug>.md`, `content/achievements/<slug>.md`, `content/about.md`, `content/site.json` and `content/taxonomy.json`; check required values, slug/folder agreement, valid category/tag spelling, unique slugs and every cross-reference. Exclude the documented `_template` folder. The homepage reads six `featured:true` items ordered by `featuredOrder`; Work grid and date-descending archive derive from all 16 project records; experience and achievement pages derive related-project lists from slugs. Search/filter controls work with keyboard and update both Work views.

Create the 16 project routes with `getStaticPaths`. Each page uses a shared CAD title block (ordinal project number, role, tools, dates, results), summary and supplied narrative, What I Did, process, results, a `[TODO]` learning section where absent, expected-file photo/video placeholders, and previous/next links. Derive compact mono spec lines only from supplied facts. Add an original-media pipeline that reads frontmatter references and project-local JPG/PNG, emits responsive WebP sizes into ignored generated output, copies declared local MP4/posters, and generates a manifest consumed by the pages. Missing media remains a neutral placeholder displaying its expected filename; local video stays muted, looping and playsinline, with no sound autoplay; external video embeds are lazy.

Experience and achievement Markdown records use schemas and project slugs. About settings contain the exact supplied education, skills, language scores and unresolved bio/profile-photo placeholders. Resume keeps its missing PDF placeholder and contact links. Contact and shared footer use configured email, LinkedIn and GitHub only; never add a phone number. Route-specific title/description and social metadata are generated into HTML. Do not guess the public site origin: omit canonical and absolute social URL tags until `siteUrl` is supplied. Include the actual source route list in `/manus-routes.json`; it is optional declaration only, not a runtime dependency.

## Project structure

- `content/site.json`, `content/taxonomy.json`: editable identity, interface copy, navigation, assets, hero, contacts and category/tag vocabulary.
- `content/projects/<slug>/index.md`: all project metadata/narrative and media; `content/projects/_template/index.md` is commented and excluded.
- `content/experience/<slug>.md`, `content/achievements/<slug>.md`, `content/about.md`: validated editable background and linked records.
- `src/lib/schemas.ts`, `src/lib/content.ts`, `src/lib/url.ts`: validation, loaders, sorting, relationships and base-aware URLs.
- `src/pages/`: home, Work, dynamic static project routes, Experience, Achievements, About, Resume, Contact and 404.
- `src/layouts/BaseLayout.astro`: accessible shared shell, responsive navigation, footer and route metadata.
- `src/components/`: wordmark, sculpture, project cards, project title block, media gallery and shared page sections.
- `src/scripts/`: filter/menu behavior and any small progressive enhancement.
- `scripts/generate-assets.mjs`, `scripts/process-media.mjs`: reproducible local icons/OG and original-media conversion.
- `src/styles/global.css`: existing design tokens and page-specific responsive/accessibility styles.
- `src/fonts/` and `public/fonts/`: Vite-hashed local WOFF2 sources and their OFL notices; public SVG icons, Open Graph template and optional route manifest; generated PNGs stay reproducible.
- `README.md`, `TODO.md`, `plan.md`: plain-language source use, ongoing outcome criteria and approved design/implementation decisions.

## Design

**Design movement:** engineering editorial, pairing the warm creative-studio restraint of the brief with sparse CAD documentation cues.

**Core principles:** keep Pongnapat and the real projects primary; make technical hierarchy precise; use technical details only when informative; keep unknown personal/media information honest and editable.

**Color philosophy:** warm ivory `#f5f1e9` remains the paper-like field; dark brown `#542f28` carries primary text; muted brown `#8b7566` supports secondary copy; terracotta `#e17145` and deeper `#b66143` provide a personal accent; `#dcd3c6` rules structure the page. The sculpture retains its orange `#f36c2e`. Engineering details remain subtle.

**Layout paradigm:** preserve the asymmetrical two-column hero and wide editorial reading column. Credentials lead into six spacious project previews. Work view toggles between airy cards and a compact chronological register. Project details use an editorial title followed by a compact CAD title block and legible narrative. Mobile stacks the content and collapses navigation rather than squeezing links.

**Signature elements:** the updated user-provided P mark with lowercase `pongnapat.` and terracotta period; understated crop marks and mono spec/title-block lines; the six-lobed orange sculpture with two pearls and a faint dot field limited to the hero.

**Interaction philosophy:** semantic links and buttons, keyboard-operable menu and filters, visible focus, announced counts and predictable Escape behavior. Desktop pointers may drag the sculpture; touch remains scrollable. Work filters and grid/archive switch progressively enhance content that is already present in HTML.

**Animation:** retain the slowly rotating/floating sculpture and pearls, gentle hover lifts and restrained scroll fades. Respect `prefers-reduced-motion` for layout transitions and sculpture motion; show the static SVG silhouette if WebGL fails. Avoid animation as a substitute for an interaction state.

**Typography system:** self-hosted Space Grotesk weights 400 and 500 for headings/body; JetBrains Mono for labels, dates, categories, tags, result specs and project numbers. Keep copy legible and avoid synthetic font styles. The homepage accent word remains upright terracotta, per the accepted revision.

**Brand essence:** a personal archive and portfolio for a robotics student spanning mechanisms, electronics, control and bio-inspired research. Personality: precise, curious, warm.

**Brand voice:** concise, technical where helpful, and personal rather than corporate. Examples: “Mechanisms that move. Ideas with a little life.” and “Currently — Research Intern at VISTEC.” Additional unsupported claims remain `[TODO]` or are omitted.

**Wordmark and logo:** lowercase `pongnapat.` with terracotta punctuation and the connected-tail P mark provided by the user, held as source SVG files and referenced via settings.

**Signature brand color:** terracotta `#e17145`, paired with the sculpture's orange `#f36c2e`.
