import { z } from 'zod';

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
  INBOUND_WEBSOCKET_STREAM_URL: z.string().url(),
  TWILIO_AUTH_TOKEN: z.string(),
  BUNDLE: z.enum(['ALL', 'TRPC', 'INBOUND_API']),
  DEEPGRAM_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
});

export type EnvVariables = z.infer<typeof schema>;
