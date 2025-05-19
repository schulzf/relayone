import { z } from 'zod';

export const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
});
export type Word = z.infer<typeof WordSchema>;

export const UtteranceSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  language: z.string(),
  confidence: z.number(),
  channel: z.number(),
  words: z.array(WordSchema),
});
export type Utterance = z.infer<typeof UtteranceSchema>;

export const DataSchema = z.object({
  id: z.string(),
  is_final: z.boolean(),
  utterance: UtteranceSchema,
});
export type Data = z.infer<typeof DataSchema>;

export const GladiaTranscriptSchema = z.object({
  type: z.string(),
  session_id: z.string(),
  created_at: z.coerce.date(),
  data: DataSchema,
});
export type GladiaTranscript = z.infer<typeof GladiaTranscriptSchema>;
