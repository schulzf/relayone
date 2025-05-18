import { z } from 'zod';

export const PayloadSchema = z.object({});
export type Payload = z.infer<typeof PayloadSchema>;

export const TranscriptionEventCloseSchema = z.object({
  streamSid: z.string(),
  payload: PayloadSchema,
});
export type TranscriptionEventClose = z.infer<typeof TranscriptionEventCloseSchema>;
