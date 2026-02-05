import { z } from 'zod';
import { insertAvatarSchema, avatars } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  avatars: {
    create: {
      method: 'POST' as const,
      path: '/api/avatars',
      input: insertAvatarSchema,
      responses: {
        201: z.custom<typeof avatars.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    listStyles: {
      method: 'GET' as const,
      path: '/api/styles',
      responses: {
        200: z.array(z.string()),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
