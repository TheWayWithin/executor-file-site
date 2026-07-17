import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const learn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Drafts are never built or listed. Jamie flips draft to false to publish.
    draft: z.boolean().default(true),
    // True only for pages carrying affiliate links; renders the disclosure
    // line above the fold. Affiliate links exist only under /learn.
    affiliate: z.boolean().default(false),
    markets: z.array(z.enum(['US', 'UK', 'CA', 'AU', 'NZ'])).default([]),
  }),
});

export const collections = { learn };
