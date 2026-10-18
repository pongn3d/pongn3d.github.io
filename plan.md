# Pongnapat portfolio implementation plan

## Scope and build sequence

Follow `/home/ubuntu/upload/portfolio-prompt.md` as the factual source of truth. It contains **16 projects**, of which six are featured, five experience roles and four competition/achievement entries. No additional project should be invented. Missing personal text, resume PDF and all project media remain visible, filename-specific TODO placeholders. Never display a phone number.

The first deliverable is the homepage for review before the rest of the site is built. Show it in both desktop and a 390px-wide mobile preview. It includes the design system, shared navigation and footer, real-time Three.js hero, quiet credentials strip and six featured-project previews. Content foundations needed by the homepage will be created now, but Work, project detail pages and supporting pages will be built only after the homepage is shown. The complete later deliverable includes Work grid/archive views with category/tag filters, every project detail page, Experience timeline, Competitions & Achievements, About, Resume and Contact. Resume stays a TODO until a real PDF is supplied.

## Implementation approach

Use **Astro, TypeScript and plain CSS**, with a small, dynamically imported Three.js module for the hero. Generate content-bearing static HTML rather than a client-only shell. No server or database is required. The configured development service listens on `0.0.0.0:3000`; the self-hostable production output is `dist/`. Manus preview is only an optional development convenience: the production output must not call Manus APIs or require Manus storage or hosting.

Use Markdown plus frontmatter for projects, experience, achievements and About; JSON for site settings and taxonomy. A central Zod-validated loader reads these files, checks required fields, validates categories/tags and slug relationships, excludes `_template`, and drives featured ordering, archive sorting and related-project lists automatically. Editorial text and labels also live in site settings rather than being embedded in components. The site settings expose a single `hero.modelPath` field for future GLB replacement.

Install Astro, Three.js, Zod, a frontmatter parser and Sharp. Pin pnpm and record lifecycle permissions before installation. Self-host only the requested weight-400 DM Sans and Instrument Serif normal/real-italic font assets with their licenses. Uploaded originals stay with each project; media processing creates responsive WebP outputs during the build and preserves explicit placeholders when files do not exist. Local videos use muted/looping/playsinline playback with posters and preload metadata only; external video embeds are click-to-load.

Generate per-page titles and descriptions, an original typography/brand Open Graph image, a spark favicon and a complete route manifest. Do not guess a public canonical URL: expose `siteUrl` in settings and omit origin-dependent tags until configured. Make source portable to Vercel, Netlify and GitHub Pages, with deployment and media/content-editing instructions in a plain-language README. Hand off a real Git repository that the user can push to their GitHub; do not push to an unprovided repository.

## Project structure

- `content/site.json`: identity, all editable interface copy, hero copy/settings/model path, credentials, navigation, footer and contacts.
- `content/taxonomy.json`: primary categories and supported tags.
- `content/projects/<slug>/index.md`: project frontmatter and narrative; media in the same folder. `_template/index.md` is documented and excluded.
- `content/experience/<slug>.md` and `content/achievements/<slug>.md`: schema-checked role/award entries and narrative.
- `content/about.md`: biography TODO, education, grouped skills, languages and scores.
- `src/lib/content.ts` and `src/lib/schemas.ts`: validation, sorting, slug relationships and content helpers.
- `src/layouts/BaseLayout.astro`: semantic page shell, metadata and shared navigation/footer.
- `src/components/`: wordmark, hero, project previews, neutral filename placeholders and later gallery/filter controls.
- `src/scripts/sculpture.ts`: lazily loaded Three.js sculpture or configured GLB model, pointer/spin controls, reduced-motion behavior and cleanup.
- `src/pages/`: homepage first; later Work, static project routes, Experience, Achievements, About, Resume, Contact and 404.
- `src/styles/global.css`: visual system, responsive layouts and accessible interaction states.
- `public/fonts/`, `public/favicon.svg`, `public/og-image.png`, `public/manus-routes.json`: durable self-hosted assets and route declarations.
- `scripts/`: reusable content/media checks and responsive media preparation.
- `README.md`, `TODO.md`, `plan.md`: editing/hosting documentation, deliverable criteria and implementation decisions.

## Design

**Design movement:** warm editorial creative-studio design, exactly as specified in the brief.

**Core principles:** make the person and real work primary; use spacious typographic hierarchy rather than template cards; let restrained mechanical playfulness appear through the spark and sculpture; keep missing content honest and editable.

**Color philosophy:** ivory `#f5f1e9` provides a calm paper-like field; dark brown `#542f28` supplies readable warmth; muted brown `#8b7566` supports secondary details; terracotta `#e17145` and deep terracotta `#b66143` add a human accent. Thin `#dcd3c6` rules organize content. Use a deeper companion tint for small muted/accent text where needed so small labels remain readable.

**Layout paradigm:** a wide, asymmetrical two-column hero with large left-aligned text and a generous right-hand sculpture stage. A quiet horizontal credentials line leads into six airy featured previews. Keep navigation lightweight, secondary content editorial and the footer spacious. On small screens, stack text and the sculpture without horizontal overflow.

**Signature elements:** an eight-armed four-line spark; real italic terracotta accent words; the inflated orange six-lobed form with two orbiting pearls. Neutral media placeholders show expected filenames and are never presented as actual project documentation.

**Interaction philosophy:** familiar semantic links, visibly focused buttons and keyboard-usable controls. The hero spin pill is a real button. Desktop mouse dragging rotates the object; touch gestures remain page-scrollable. Later Work controls update the grid/archive and expose result counts without losing accessibility.

**Animation:** the sculpture floats and slowly rotates, with gentle orbiting cream/wine pearls and a soft blurred CSS shadow. Use only restrained hover lifts and scroll fades. Reduced motion yields a still pose and suppresses animated transitions/spins. If WebGL cannot initialize, show a static original silhouette instead.

**Typography system:** self-hosted Instrument Serif weight 400 normal and real italic for expressive headings; DM Sans weight 400 for body and labels. Never synthesize bold or italic. Display scale responds to viewport width; uppercase labels have restrained tracking and stay in the requested 9–11px range when legible.

**Brand essence:** a personal portfolio and lasting archive for a robotics student working across mechanisms, electronics, control and bio-inspired research. Personality: calm, warm, curious.

**Brand voice:** clear, concise and personal, not corporate. Example lines: “Mechanisms that move. Ideas with a little life.” and “Currently — Research Intern at VISTEC.” Additional editorial phrasing must remain non-factual or explicitly TODO when missing from the brief.

**Wordmark and logo:** four crossing thin strokes form the eight-armed spark beside a lowercase `pongnapat.` wordmark, with the period in terracotta. Use the spark alone as the favicon and platform logo.

**Signature brand color:** terracotta `#e17145`; hero sculpture orange `#f36c2e` is reserved for the playful 3D object.
