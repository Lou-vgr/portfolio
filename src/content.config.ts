import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z as zod } from 'astro/zod';

const skills = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
    schema: zod.object({
        title: zod.string(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: zod.object({
        title: zod.string().optional(),
    }),
});

export const collections = {
    skills,
    projects,
};