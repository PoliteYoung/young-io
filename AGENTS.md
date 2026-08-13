# AGENTS.md — Young.io operating contract

## Project philosophy

Young.io is a long-lived personal identity system, not a disposable portfolio. Optimize in this order:

1. Data correctness
2. Single source of truth
3. AI readability
4. Maintainability
5. Extensibility
6. Visual quality

The knowledge layer records what is known. The identity layer explains how verified facts should be interpreted. Output channels transform those layers without becoming competing databases.

## Package manager

Use **pnpm** for dependency installation, scripts, and workspace operations.

## Architecture boundaries

- `knowledge/`: factual, structured, traceable records.
- `identity/`: narrative, positioning, capability relationships, voice, and disclosure policy.
- `content/`: authored writing and reviewed drafts.
- `website/astro/`: presentation. Read from knowledge files; do not repeat personal facts in components.
- `generators/`: channel adapters. Generated artifacts must identify their source data and must not silently write facts back.
- `automation/`: future validation and approved delivery workflows. Never publish externally without an explicit human approval step.

## Data contract

Every important factual record must carry:

```yaml
source:
  type: user-provided | document | repository | publication | public-profile | other
  reference: human-readable pointer
verified: true | false
status: verified | needs verification
visibility: public | private | internal | confidential
```

Additional rules:

- Never invent personal history, dates, titles, organizations, metrics, credentials, publications, or achievements.
- If sources conflict, preserve the conflict in notes and mark the record `needs verification`.
- Absence of data is not negative evidence.
- Prefer stable IDs for list records.
- Dates use ISO 8601 where known. Partial dates may use `YYYY` or `YYYY-MM` and must not be made more precise by inference.
- Website output must filter to `visibility: public`.
- `private`, `internal`, and `confidential` data must never enter browser bundles, generated public artifacts, examples, logs, or screenshots.

## Writing style

- Describe Yaodong as a **researcher and research engineer** across digital humans, computer graphics, XR systems, and AI infrastructure.
- Preserve the intersection: **Research + Engineering + Infrastructure**.
- Do not reduce the identity to a single job title or generic role.
- Prefer concrete, calm, technically literate language.
- Avoid hype, unsupported superlatives, inflated leadership claims, and skill-icon walls.
- Distinguish fact, interpretation, and aspiration.

See `identity/writing-style.md` for detailed voice guidance.

## Privacy and safety

- Data is publishable only when it is both `visibility: public` and appropriate for the target channel.
- Secrets, credentials, personal contact details, precise private locations, legal identifiers, unpublished confidential research, and third-party private information must not be committed.
- Redact source references if the reference itself is sensitive.
- Human review is mandatory before publishing generated CVs, bios, GitHub material, or LinkedIn drafts.

## Change workflow

1. Locate the canonical fact in `knowledge/`.
2. Update or add provenance and verification metadata.
3. Update identity guidance only if interpretation changed.
4. Let website or generators derive the output.
5. Run `pnpm check` and `pnpm build`.
6. In the change summary, explicitly list unresolved `needs verification` items.
