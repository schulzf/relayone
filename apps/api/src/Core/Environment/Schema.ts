import {z} from 'zod';

export const schema = z.object({
  ENV: z.enum(['dev']).optional(),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url(),
  CLERK_PEM: z.string(),
  CLERK_SECRET_KEY: z.string(),
  GCP_LOGS_PROJECT_ID: z.string().optional(),
  GCP_LOGS_KEY_FILE: z.string().optional(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_URI: z.string(),
  BUNDLE: z.enum(['ALL', 'TRPC', 'LOCAL_UI']),
});

export type EnvVariables = z.infer<typeof schema>;
