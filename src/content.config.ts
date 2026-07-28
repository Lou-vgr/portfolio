import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z as zod } from 'astro/zod';

const skills = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
    schema: zod.object({
        title: zod.string(),
    }),
});

export const collections = {
    skills,
};