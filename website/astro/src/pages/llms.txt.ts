import type { APIRoute } from 'astro';
import { getPublicIdentity } from '../lib/knowledge';

export const GET: APIRoute = async ({ site }) => {
  const { profile, capabilities, publications, experience, education } = await getPublicIdentity('en');
  const period = ({ start, end }: { start: string | null; end?: string | null }) =>
    `${start ?? 'Start date unknown'} — ${end ?? 'Present'}`;
  const lines = [
    `# ${profile.canonicalName}`,
    '',
    profile.positioning,
    '',
    'Generated from verified public records in knowledge/profile.yaml, knowledge/experience.yaml, knowledge/education.yaml, knowledge/publications.yaml, identity/core.yaml, and identity/experience-narrative.yaml.',
    '',
    '## Website',
    '',
    ...([
      ['Structured identity', '/identity.json'], ['Research', '/research'],
      ['Publications', '/publications'], ['Experience', '/experience'],
    ] as const).map(([label, path]) => `- [${label}](${new URL(path, site)})`),
    '',
    '## Research directions',
    '',
    ...capabilities.map((item) => `- ${item.title}: ${item.summary}`),
    '',
    '## Publications',
    '',
    ...publications.map((item) => `- ${item.authors.join(', ')}. ${item.title}. ${item.venue}, ${item.year}. DOI: https://doi.org/${item.identifiers.doi}`),
    '',
    '## Experience',
    '',
    ...experience.map((item) => `- ${item.title}, ${item.organization} (${period(item.period)}). ${item.summary}`),
    '',
    '## Education',
    '',
    ...education.map((item) => `- ${item.degree}${item.field ? ` in ${item.field}` : ''}, ${item.institution} (${period(item.period)}).`),
    '',
    '## Profiles',
    '',
    ...(['website', 'github', 'linkedin', 'orcid', 'scholar', 'openreview'] as const)
      .map((key) => `- [${key === 'website' ? 'Website' : key === 'orcid' ? 'ORCID' : key === 'github' ? 'GitHub' : key === 'linkedin' ? 'LinkedIn' : key === 'scholar' ? 'Google Scholar' : 'OpenReview'}](${profile.links[key].url})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
