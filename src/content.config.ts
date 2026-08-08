import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z as zod } from 'astro/zod';

const skills = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/skills' }),
    schema: zod.object({
        title: zod.string(),
        items: zod.array(
            zod.object({
                name: zod.string(),
                score: zod.number(),
            })
        ),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
    schema: zod.object({
        title: zod.string(),
        order: zod.number().default(0),
        description: zod.string(),
        technologies: zod.array(zod.string()),
        link: zod.string().nullable().optional(),
        github: zod.string().nullable().optional(),
    }),
});

const experiences = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/experiences' }),
    schema: zod.object({
        title: zod.string(),
        company: zod.string(),
        location: zod.string(),
        team: zod.string(),
        period: zod.string(),
        description: zod.string(),
        technologies: zod.array(zod.string()),
        missions: zod.array(zod.string()),
    }),
});

export const collections = {
    skills,
    projects,
    experiences,
};