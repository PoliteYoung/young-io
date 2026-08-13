# Young.io

**Young.io is Yaodong Yang's digital identity compiler:** a durable, AI-readable system that turns verified personal knowledge into a website, biographies, CVs, GitHub material, and future public communication.

The name connects **Yang / Young** with computer **I/O** and the sounds of **一 / 零 · 幺 / 洞** — a bridge between human identity and digital identity.

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
pnpm check     # Astro and TypeScript validation
pnpm build     # production build
pnpm preview   # preview the production build
```

## Editing data safely

1. Add facts to `knowledge/*.yaml`; do not copy them into pages.
2. Every important record must include `source`, `verified`, and `visibility`.
3. Use `verified: false` or `status: needs verification` when evidence is incomplete.
4. Public outputs must only expose records with `visibility: public`.
5. Run `pnpm check && pnpm build` before committing.

See [`AGENTS.md`](./AGENTS.md) for the operating contract used by Codex, Claude Code, OpenCode, ChatGPT, and human contributors.

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
4. At the DNS provider, create a `CNAME` for `pol1te` pointing to `yyd003.github.io` (the GitHub Pages account hostname, without `/young-io`).
5. Wait for DNS verification, then enable **Enforce HTTPS**.

The Astro configuration targets the custom-domain root. If the site is temporarily published only at `https://yyd003.github.io/young-io/`, add `base: '/young-io'` to `website/astro/astro.config.mjs` for that temporary mode.

## Long-term principle

> Facts are stored once. Narratives are generated deliberately. Nothing personal is invented.
