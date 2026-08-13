import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';

const visibilitySchema = z.enum(['public', 'private', 'internal', 'confidential']);
const sourceSchema = z.object({ type: z.string().min(1), reference: z.string().min(1) });
const recordMetaSchema = z.object({
  source: sourceSchema,
  verified: z.boolean(),
  status: z.enum(['verified', 'needs verification']),
  visibility: visibilitySchema,
});

const profileRecordSchema = recordMetaSchema.extend({
  id: z.string(),
  name: z.object({ display: z.string(), alternatives: z.array(z.string()) }),
  headline: z.string(),
  positioning: z.string(),
  synthesis: z.array(z.string()).length(3),
  introduction: z.string(),
  location: z.string().nullable(),
  affiliation: z.object({
    institution: z.string(),
    institution_zh: z.string(),
    role: z.string(),
    field: z.string(),
  }),
  links: z.record(z.string(), z.object({ label: z.string(), url: z.url() })),
});
const brandRecordSchema = recordMetaSchema.extend({
  name: z.string(),
  statement: z.string(),
  meanings: z.array(z.object({ term: z.string(), detail: z.string() })),
});
const profileFileSchema = z.object({ schema_version: z.number(), profile: profileRecordSchema, brand: brandRecordSchema });

const capabilitySchema = recordMetaSchema.extend({ id: z.string(), title: z.string(), summary: z.string(), topics: z.array(z.string()) });
const experienceFileSchema = z.object({ schema_version: z.number(), experience: z.array(z.unknown()), capability_domains: z.array(capabilitySchema) });

const educationSchema = recordMetaSchema.extend({
  id: z.string(),
  institution: z.string(),
  school: z.string().nullable(),
  degree: z.string(),
  field: z.string().nullable(),
  period: z.object({
    start: z.union([z.string(), z.date()]).nullable(),
    end: z.union([z.string(), z.date()]).nullable().optional(),
  }),
  location: z.object({ city: z.string(), country: z.string() }),
  notes: z.string().optional(),
});
const educationFileSchema = z.object({ schema_version: z.number(), education: z.array(educationSchema) });

const publicationSchema = recordMetaSchema.extend({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number(),
  venue: z.string(),
  pages: z.string().optional(),
  type: z.string(),
  notes: z.string().optional(),
  identifiers: z.record(z.string(), z.string()),
  links: z.record(z.string(), z.url()),
});
const publicationsFileSchema = z.object({ schema_version: z.number(), publications: z.array(publicationSchema) });
const talksFileSchema = z.object({ schema_version: z.number(), talks: z.array(z.unknown()) });

function knowledgePath(file: string) { return resolve(process.cwd(), '../../knowledge', file); }
async function readYaml(file: string) { return parse(await readFile(knowledgePath(file), 'utf8')) as unknown; }

export async function getPublicKnowledge() {
  const [profileData, experienceData, educationData, publicationsData, talksData] = await Promise.all([
    readYaml('profile.yaml'), readYaml('experience.yaml'), readYaml('education.yaml'), readYaml('publications.yaml'), readYaml('talks.yaml'),
  ]);
  const { profile, brand } = profileFileSchema.parse(profileData);
  const experience = experienceFileSchema.parse(experienceData);
  const education = educationFileSchema.parse(educationData).education;
  const publications = publicationsFileSchema.parse(publicationsData).publications;
  const talks = talksFileSchema.parse(talksData).talks;
  if (profile.visibility !== 'public' || brand.visibility !== 'public') throw new Error('The primary profile and brand records must be public to build the website.');
  return {
    profile, brand,
    capabilities: experience.capability_domains.filter((item) => item.visibility === 'public'),
    education: education.filter((item) => item.visibility === 'public'),
    publications: publications.filter((item) => item.visibility === 'public'),
    talks,
  };
}
