# Self-hosted font sources

- **Space Grotesk** weights 400 and 500, Latin WOFF2; sourced from the pinned `@fontsource/space-grotesk` 5.3.0 package. Upstream: [Florian Karsten's Space Grotesk repository](https://github.com/floriankarsten/space-grotesk). Distributed under the SIL Open Font License 1.1; full notice: `OFL-Space-Grotesk.txt`.
- **JetBrains Mono** weights 400 and 500, Latin WOFF2; sourced from the pinned `@fontsource/jetbrains-mono` 5.3.0 package. Upstream: [JetBrains Mono repository](https://github.com/JetBrains/JetBrainsMono). Distributed under the SIL Open Font License 1.1; full notice: `OFL-JetBrains-Mono.txt`.

The WOFF2 source files live in `src/fonts/`; Vite fingerprints them and serves them from the generated static site under the configured base path. The pinned Fontsource packages remain development dependencies so asset versions are traceable in the lockfile.

The P mark in `../logo-mark.svg` and `../favicon.svg` is Pongnapat's supplied artwork. `scripts/generate-assets.mjs` reads their paths from `content/site.json` to build `favicon-32.png`, `apple-touch-icon.png` (180 × 180) and the Open Graph image. See the root README for regeneration instructions.
