import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import type { Locale } from '../i18n/types';

const visibilitySchema = z.enum(['public', 'private', 'internal', 'confidential']);
const sourceTypeSchema = z.enum(['user-provided', 'document', 'repository', 'publication', 'public-profile', 'other']);
const sourceSchema = z.object({ type: sourceTypeSchema, reference: z.string().min(1) });
const recordMetaSchema = z.object({
  source: sourceSchema,
  verified: z.boolean(),
  status: z.enum(['verified', 'needs verification']),
  visibility: visibilitySchema,
});
const localizedTextSchema = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const localizedListSchema = z.object({
  en: z.array(z.string().min(1)),
  zh: z.array(z.string().min(1)),
});

const linkSchema = z.object({ label: z.string().min(1), url: z.url() });
const profileRecordSchema = recordMetaSchema.extend({
  id: z.string().min(1),
  name: z.object({ canonical: z.string().min(1), display: localizedTextSchema, alternatives: z.array(z.string().min(1)) }),
  location: localizedTextSchema,
  affiliation: z.object({
    short_name: z.string().min(1),
    institution: localizedTextSchema,
    role: localizedTextSchema,
    field: localizedTextSchema,
  }),
  links: z.object({
    email: linkSchema,
    website: linkSchema,
    github: linkSchema,
    linkedin: linkSchema,
    orcid: linkSchema,
    scholar: linkSchema,
    openreview: linkSchema,
  }),
});
const brandRecordSchema = recordMetaSchema.extend({ name: z.string().min(1) });
const profileFileSchema = z.object({
  schema_version: z.literal(2),
  profile: profileRecordSchema,
  brand: brandRecordSchema,
});

const identityFileSchema = z.object({
  schema_version: z.literal(1),
  identity: recordMetaSchema.extend({
    profile: z.object({
      headline: localizedTextSchema,
      positioning: localizedTextSchema,
      introduction: localizedTextSchema,
      hero_title: z.object({
        en: z.array(z.string().min(1)).length(2),
        zh: z.array(z.string().min(1)).length(2),
      }),
      synthesis: z.array(z.object({ id: z.string().min(1), label: localizedTextSchema })).length(3),
      position: z.object({
        lead: localizedTextSchema,
        lines: z.object({
          en: z.array(z.string().min(1)).length(3),
          zh: z.array(z.string().min(1)).length(3),
        }),
      }),
    }),
    brand: z.object({
      statement: localizedTextSchema,
      meanings: z.array(z.object({ id: z.string().min(1), term: z.string().min(1), detail: localizedTextSchema })).min(1),
    }),
  }),
});

const capabilitySchema = recordMetaSchema.extend({
  id: z.string().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  topics: localizedListSchema,
});
const experienceSchema = recordMetaSchema.extend({
  id: z.string().min(1),
  organization: localizedTextSchema,
  title: localizedTextSchema,
  employment_type: localizedTextSchema,
  period: z.object({
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]).nullable().optional(),
  }),
  location: z.object({
    city: z.string().nullable(),
    region: z.string().nullable(),
    country: z.string().min(2),
    display: localizedTextSchema,
  }),
  summary: localizedTextSchema,
  highlights: localizedListSchema,
});
const experienceFileSchema = z.object({
  schema_version: z.literal(2),
  experience: z.array(experienceSchema),
  capability_domains: z.array(capabilitySchema),
});

const educationSchema = recordMetaSchema.extend({
  id: z.string().min(1),
  institution: localizedTextSchema,
  school: localizedTextSchema.nullable().optional(),
  degree: localizedTextSchema,
  field: localizedTextSchema.nullable().optional(),
  period: z.object({
    start: z.union([z.string(), z.date()]).nullable(),
    end: z.union([z.string(), z.date()]).nullable().optional(),
  }),
  location: z.object({ city: z.string(), country: z.string() }),
  notes: z.string().optional(),
});
const educationFileSchema = z.object({ schema_version: z.literal(2), education: z.array(educationSchema) });

const publicationSchema = recordMetaSchema.extend({
  id: z.string().min(1),
  title: localizedTextSchema,
  authors: z.array(z.string().min(1)),
  author_display: z.object({ zh: z.string().min(1) }).optional(),
  year: z.number(),
  venue: localizedTextSchema,
  pages: z.string().optional(),
  type: z.string(),
  notes: z.string().optional(),
  identifiers: z.object({
    doi: z.string().min(1),
    arxiv: z.string().min(1).optional(),
  }),
  links: z.object({
    primary: z.url(),
    preprint: z.url().optional(),
    code: z.url().optional(),
  }),
});
const publicationsFileSchema = z.object({ schema_version: z.literal(2), publications: z.array(publicationSchema) });
const narrativeSchema = recordMetaSchema.extend({
  experience_id: z.string().min(1),
  contribution: localizedTextSchema,
  framing: localizedTextSchema,
});
const experienceNarrativeFileSchema = z.object({
  schema_version: z.literal(2),
  career_throughline: recordMetaSchema.extend({ text: localizedTextSchema }),
  experience: z.array(narrativeSchema),
});

function projectPath(directory: 'knowledge' | 'identity', file: string) {
  return resolve(process.cwd(), `../../${directory}`, file);
}

async function readYaml(directory: 'knowledge' | 'identity', file: string) {
  return parse(await readFile(projectPath(directory, file), 'utf8')) as unknown;
}

function assertUniqueIds(records: Array<{ id: string }>, label: string) {
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) throw new Error(`Duplicate ${label} id: ${record.id}`);
    seen.add(record.id);
  }
}

function assertPublicRecord(record: z.infer<typeof recordMetaSchema>, label: string) {
  if (record.visibility === 'public' && (!record.verified || record.status !== 'verified')) {
    throw new Error(`Public ${label} must be verified: ${JSON.stringify(record)}`);
  }
}

function publicOnly<T extends z.infer<typeof recordMetaSchema>>(records: T[], label: string) {
  records.forEach((record) => assertPublicRecord(record, label));
  return records.filter((record) => record.visibility === 'public' && record.verified && record.status === 'verified');
}

async function loadPublicKnowledge() {
  const [profileData, identityData, experienceData, educationData, publicationsData, experienceNarrativeData] = await Promise.all([
    readYaml('knowledge', 'profile.yaml'),
    readYaml('identity', 'core.yaml'),
    readYaml('knowledge', 'experience.yaml'),
    readYaml('knowledge', 'education.yaml'),
    readYaml('knowledge', 'publications.yaml'),
    readYaml('identity', 'experience-narrative.yaml'),
  ]);

  const { profile, brand } = profileFileSchema.parse(profileData);
  const identity = identityFileSchema.parse(identityData).identity;
  const experienceFile = experienceFileSchema.parse(experienceData);
  const education = educationFileSchema.parse(educationData).education;
  const publications = publicationsFileSchema.parse(publicationsData).publications;
  const experienceNarrative = experienceNarrativeFileSchema.parse(experienceNarrativeData);

  assertPublicRecord(profile, 'profile');
  assertPublicRecord(brand, 'brand');
  assertPublicRecord(identity, 'identity');
  if (profile.visibility !== 'public' || brand.visibility !== 'public' || identity.visibility !== 'public') {
    throw new Error('The primary profile, brand, and identity records must be public to build the website.');
  }

  assertPublicRecord(experienceNarrative.career_throughline, 'career throughline');
  if (experienceNarrative.career_throughline.visibility !== 'public') {
    throw new Error('The career throughline must be public to build the experience page.');
  }

  assertUniqueIds(identity.profile.synthesis, 'identity synthesis');
  assertUniqueIds(identity.brand.meanings, 'brand meaning');
  assertUniqueIds(experienceFile.experience, 'experience');
  assertUniqueIds(experienceFile.capability_domains, 'capability');
  assertUniqueIds(education, 'education');
  assertUniqueIds(publications, 'publication');

  const publicExperience = publicOnly(experienceFile.experience, 'experience');
  const publicNarratives = publicOnly(experienceNarrative.experience, 'experience narrative');
  const narrativeIds = new Set<string>();
  for (const narrative of experienceNarrative.experience) {
    if (narrativeIds.has(narrative.experience_id)) {
      throw new Error(`Duplicate experience narrative reference: ${narrative.experience_id}`);
    }
    narrativeIds.add(narrative.experience_id);
    if (!experienceFile.experience.some((item) => item.id === narrative.experience_id)) {
      throw new Error(`Identity narrative references an unknown experience record: ${narrative.experience_id}`);
    }
  }
  const publicNarrativeIds = new Set(publicNarratives.map((item) => item.experience_id));
  for (const item of publicExperience) {
    if (!publicNarrativeIds.has(item.id)) throw new Error(`Missing public identity narrative for experience record: ${item.id}`);
  }
  return {
    profile,
    brand,
    identity,
    experience: publicExperience,
    capabilities: publicOnly(experienceFile.capability_domains, 'capability'),
    education: publicOnly(education, 'education'),
    publications: publicOnly(publications, 'publication'),
    experienceNarrative: {
      career_throughline: experienceNarrative.career_throughline,
      experience: publicNarratives,
    },
  };
}

const localize = <T>(value: Record<Locale, T>, locale: Locale) => value[locale];

export async function getPublicIdentity(locale: Locale) {
  const data = await loadPublicKnowledge();
  const displayName = localize(data.profile.name.display, locale);
  const narrativeByExperience = new Map(data.experienceNarrative.experience.map((item) => [item.experience_id, item]));

  return {
    profile: {
      id: data.profile.id,
      displayName,
      canonicalName: data.profile.name.canonical,
      alternatives: data.profile.name.alternatives,
      headline: localize(data.identity.profile.headline, locale),
      positioning: localize(data.identity.profile.positioning, locale),
      introduction: localize(data.identity.profile.introduction, locale),
      heroTitle: localize(data.identity.profile.hero_title, locale),
      synthesis: data.identity.profile.synthesis.map((item) => ({ id: item.id, label: localize(item.label, locale) })),
      position: {
        lead: localize(data.identity.profile.position.lead, locale),
        lines: localize(data.identity.profile.position.lines, locale),
      },
      location: localize(data.profile.location, locale),
      affiliation: {
        shortName: data.profile.affiliation.short_name,
        institution: localize(data.profile.affiliation.institution, locale),
        role: localize(data.profile.affiliation.role, locale),
        field: localize(data.profile.affiliation.field, locale),
      },
      links: data.profile.links,
    },
    brand: {
      name: data.brand.name,
      statement: localize(data.identity.brand.statement, locale),
      meanings: data.identity.brand.meanings.map((item) => ({ id: item.id, term: item.term, detail: localize(item.detail, locale) })),
    },
    capabilities: data.capabilities.map((item) => ({
      ...item,
      title: localize(item.title, locale),
      summary: localize(item.summary, locale),
      topics: localize(item.topics, locale),
    })),
    experience: data.experience.map((item) => {
      const narrative = narrativeByExperience.get(item.id);
      if (!narrative) throw new Error(`Missing identity narrative for experience record: ${item.id}`);
      return {
        ...item,
        organization: localize(item.organization, locale),
        title: localize(item.title, locale),
        employmentType: localize(item.employment_type, locale),
        locationDisplay: localize(item.location.display, locale),
        summary: localize(item.summary, locale),
        highlights: localize(item.highlights, locale),
        contribution: localize(narrative.contribution, locale),
        framing: localize(narrative.framing, locale),
      };
    }),
    education: data.education.map((item) => ({
      ...item,
      institution: localize(item.institution, locale),
      school: item.school ? localize(item.school, locale) : null,
      degree: localize(item.degree, locale),
      field: item.field ? localize(item.field, locale) : null,
    })),
    publications: data.publications.map((item) => ({
      ...item,
      title: localize(item.title, locale),
      venue: localize(item.venue, locale),
      authorDisplay: locale === 'zh' ? item.author_display?.zh : undefined,
    })),
    careerThroughline: localize(data.experienceNarrative.career_throughline.text, locale),
  };
}
