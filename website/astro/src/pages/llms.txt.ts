import type { APIRoute } from 'astro';
import { getPublicIdentity } from '../lib/knowledge';
export const GET: APIRoute = async ({ site }) => {
  const { profile } = await getPublicIdentity('en');
  return new Response(`# ${profile.canonicalName}\n\n${profile.positioning}\n\nGenerated from verified public knowledge/profile.yaml and identity/core.yaml.\n\n- [Structured identity](${new URL('/identity.json', site)})\n- [Research](${new URL('/research', site)})\n- [Publications](${new URL('/publications', site)})\n- [Experience](${new URL('/experience', site)})\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
