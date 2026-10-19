import type { APIRoute } from 'astro';
import { getPublicIdentity } from '../lib/knowledge';
export const GET: APIRoute = async () => {
  const data = await getPublicIdentity('en');
  return Response.json({
    schemaVersion: 1,
    generatedFrom: ['knowledge/profile.yaml', 'identity/core.yaml', 'knowledge/publications.yaml'],
    review: 'Public website export; generated from verified public records.',
    person: { name: data.profile.canonicalName, alternateNames: data.profile.alternatives,
      description: data.profile.positioning,
      links: Object.fromEntries(Object.entries(data.profile.links).filter(([key]) => key !== 'email')) },
    publications: data.publications.map(({ id, title, authors, year, venue, identifiers, links }) => ({ id, title, authors, year, venue, identifiers, links })),
  });
};
