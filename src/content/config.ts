import { defineCollection, z } from "astro:content";

const code = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    lastUpdate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    heroImage: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

const food = defineCollection({
  schema: z.object({
    title: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number().or(z.string()),
    imgUrl: z.string().optional().nullable(),
    description: z.string(),
    notes: z.string().optional().nullable(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

const notes = defineCollection({
  schema: z.object({}),
});

const photos = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      cover: image(),
    }),
});

export const collections = { code, food, notes, photos };
