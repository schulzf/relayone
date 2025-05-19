import { z } from 'zod';

export const PayloadSchema = z.object({
  type: z.string(),
  channel: z.array(z.number()),
  last_word_end: z.number(),
});
export type Payload = z.infer<typeof PayloadSchema>;

export const TranscriptionEventUtteranceEndedSchema = z.object({
  streamSid: z.string(),
  payload: PayloadSchema,
});
export type TranscriptionEventUtteranceEnded = z.infer<typeof TranscriptionEventUtteranceEndedSchema>;
