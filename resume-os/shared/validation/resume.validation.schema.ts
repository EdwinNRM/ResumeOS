import { z } from 'zod';

export const ResumeBlockSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().uuid(),
    type: z.literal('name'),
    content: z.string().min(1).max(100),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('headline'),
    content: z.string().max(200),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('summary'),
    content: z.string().max(2000),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('experience'),
    items: z.array(z.object({
      role: z.string(),
      company: z.string(),
      bullets: z.array(z.string()),
    })),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('project'),
    items: z.array(z.object({
      title: z.string(),
      bullets: z.array(z.string()),
    })),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('education'),
    items: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
    })),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('skills'),
    list: z.array(z.string()),
  }),
]);

export const ResumeSchema = z.array(ResumeBlockSchema);
