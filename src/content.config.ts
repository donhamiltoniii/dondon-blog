import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { gitLastModified } from './utils/git-dates';

/**
 * Glob loader with automatic updatedAt derivation.
 * Frontmatter updatedAt always wins if present.
 */
const timestampedGlob = (dir: string, pattern = '**/*.md') =>
  glob({
    pattern,
    base: `./src/content/${dir}`,
    transform: ({ data, filePath }: { data: Record<string, unknown>; filePath: string }) => ({
      ...data,
      updatedAt: data.updatedAt ?? gitLastModified(filePath),
    }),
  } as object as Parameters<typeof glob>[0]);

/** Shared timestamp fields. */
const timestamps = {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
};

const code = defineCollection({
  loader: timestampedGlob('code'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    published: z.boolean().optional(),
    ...timestamps,
  }),
});

const cultivatedThoughtz = defineCollection({
  loader: timestampedGlob('cultivatedThoughtz'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ...timestamps,
  }),
});

const food = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/food' }),
  schema: z.object({
    title: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number().or(z.string()),
    imgUrl: z.string().optional().nullable(),
    description: z.string(),
    notes: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

const photos = defineCollection({
  loader: glob({
    pattern: '**/*.{json,yaml,yml}',
    base: './src/content/photos',
  }),
  schema: ({ image }) =>
    z.object({
      cover: image(),
      created: z.coerce.date(),
      description: z.string().optional(),
      title: z.string(),
    }),
});

const seeds = defineCollection({
  loader: timestampedGlob('seeds'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ...timestamps,
  }),
});

export const collections = { code, cultivatedThoughtz, food, photos, seeds };
