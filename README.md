# Young.io

**Young.io is Yaodong Yang's digital identity compiler:** a durable, AI-readable system that turns verified personal knowledge into a website, biographies, CVs, GitHub material, and future public communication.

The canonical brand interpretation and localized identity statement are maintained in [`identity/core.yaml`](./identity/core.yaml), so public channels can derive them without keeping competing copies.

## Current phase: Phase 0 — Identity Reconstruction

This repository currently prioritizes evidence, provenance, privacy, and a stable data model. It intentionally does **not** attempt autonomous publishing or exhaustive biography reconstruction. Unknown facts remain unknown and conflicts are marked `needs verification`.

## Architecture

```text
knowledge (facts + provenance)
        ↓
identity (narrative + boundaries)
        ↓
transformations / generators
        ├── website
        ├── GitHub profile
        ├── LinkedIn drafts
        ├── CV / resume
        └── biographies
```

| Area | Purpose |
| --- | --- |
| `knowledge/` | Structured facts with source, verification state, and visibility |
| `identity/` | Positioning, career map, capability graph, voice, and privacy rules |
| `content/` | Long-form writing, notes, and reviewed channel drafts |
| `website/astro/` | Astro site compiled from the knowledge layer |
| `generators/` | Future channel-specific transformations |
| `automation/` | Future validation and publishing support |

## Local development

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local address printed by Astro.

Other useful commands:

```bash
pnpm validate  # shared knowledge and identity validation
pnpm test      # data contract regression tests
pnpm check     # data, Astro and TypeScript validation
pnpm build     # production build
pnpm preview   # preview the production build
```

## Editing data safely

The current schema stores localized facts in `knowledge/` and localized identity interpretation in `identity/`. Website components consume the validated `getPublicIdentity(locale)` interface; `i18n/` contains interface and channel labels rather than duplicate personal data.

1. Add facts to `knowledge/*.yaml`; do not copy them into pages.
2. Add positioning and narrative changes to the appropriate file in `identity/`.
3. Every important record must include `source`, `verified`, `status`, and `visibility`.
4. Use `verified: false` together with `status: needs verification` when evidence is incomplete.
5. Public outputs only accept records that are public, verified, and have `status: verified`.
6. Run `pnpm check && pnpm build` before committing.

See [`MAINTENANCE.md`](./MAINTENANCE.md) for the content ownership map, record-addition workflow, and instructions for adding a new section. See [`AGENTS.md`](./AGENTS.md) for the operating contract used by Codex, Claude Code, OpenCode, ChatGPT, and human contributors.

## Public-record source hierarchy

Young.io treats public profiles as inputs to verify, not competing source databases:

1. **Publisher and DOI metadata (Crossref)** for canonical titles, venues, pages, and identifiers.
2. **DBLP** for computer-science bibliography and author disambiguation.
3. **ORCID** for persistent identity, affiliations, education, and links between a person and works.
4. **Google Scholar and Semantic Scholar** for discovery and changing citation signals.
5. **arXiv** for preprints and version history.
6. **OpenAlex, Scopus, Web of Science, institutional repositories, project pages, and GitHub** for coverage, validation, and proof of work.

When sources disagree, retain the disagreement in the knowledge record instead of silently choosing a convenient value.

## Deployment

`.github/workflows/deploy.yml` builds and deploys `website/astro` to GitHub Pages. `website/astro/public/CNAME` documents the intended production domain as `pol1te.cc.cd`; with a custom GitHub Actions workflow, the Pages **Custom domain** setting remains the deployment source of truth.

After the repository is pushed to GitHub:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Add `pol1te.cc.cd` under **Custom domain** in the Pages settings.
4. At the DNS provider, create a `CNAME` for `pol1te` pointing to `politeyoung.github.io` (the GitHub Pages account hostname, without `/young-io`).
5. Wait for DNS verification, then enable **Enforce HTTPS**.

The Astro configuration targets the custom-domain root. If the site is temporarily published only at `https://politeyoung.github.io/young-io/`, add `base: '/young-io'` to `website/astro/astro.config.mjs` for that temporary mode.

## Long-term principle

> Facts are stored once. Narratives are generated deliberately. Nothing personal is invented.

## Shared validation and public discovery

`packages/knowledge` owns schemas, provenance checks, public filtering, and the server-side loader, which caches only in production and reloads YAML in development. It resolves repository data relative to its package entry, independently of the caller's working directory, including during Astro prerendering. YAML 1.2 keeps dates as strings; dates must be valid `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` values. `verified` and `status` must agree for every record. `pnpm check` includes `pnpm validate`, so CI validates data before building.

Validation includes `knowledge/talks.yaml` and every `.yaml`/`.yml` file directly inside `knowledge/projects/`. Project records follow the template in that directory; talk records require stable `id`, localized `title` and `event`, nullable `date`, `links` (label/URL pairs), and the standard record metadata. Neither collection is published automatically.

The website emits Person JSON-LD, social image metadata, a sitemap, robots.txt, a custom 404, `/identity.json`, and `/llms.txt`. The machine-readable endpoints select public fields explicitly and exclude provenance, internal notes, and email. The social preview uses a 1200 × 1200 top-cropped version of the verified public portrait with Twitter summary cards. Its image request explicitly opts into enlargement because Astro otherwise limits output to the original image dimensions. Astro emits file-format HTML for extensionless GitHub Pages URLs; canonical and sitemap URLs omit `.html` and trailing slashes. Language switching uses explicit links, without regional routing or preference cookies.

Local changes require human review before publication. The optional GitHub profile generator remains future work. Existing source notes about the Hi-Reco proceedings year and DBLP author disambiguation remain unresolved; the owner has already emailed DBLP about the author correction and is handling that process.


### Error pages and language discovery

The bilingual 404 page is marked `noindex` and excludes canonical, hreflang, `og:url`, and Person JSON-LD. On legacy non-root URLs ending in a slash, its browser script removes trailing slashes with `location.replace()`, preserving query parameters and fragments. GitHub Pages still initially responds with HTTP 404: this is browser recovery, not a server-side redirect. Confirm `/experience/` → `/experience` on the production domain after merging and deployment.

The sitemap pairs English and Chinese versions after normalizing file-format routes (including the `/zh` homepage). `/llms.txt` includes research directions, publications, experience, education, and platform profiles, all selected from `getPublicIdentity('en')` without email or provenance notes. Person JSON-LD includes the public affiliation, completed education institutions excluding the current affiliation, capability titles, ORCID, and papers with DOI links. Conference years are not emitted as article publication dates when the source notes distinguish the two.
