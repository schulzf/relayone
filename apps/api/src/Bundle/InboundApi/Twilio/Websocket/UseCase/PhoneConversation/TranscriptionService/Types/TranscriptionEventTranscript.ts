import { z } from 'zod';

export const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  punctuated_word: z.string(),
});
export type Word = z.infer<typeof WordSchema>;

export const ModelInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  arch: z.string(),
});
export type ModelInfo = z.infer<typeof ModelInfoSchema>;

export const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
});
export type Alternative = z.infer<typeof AlternativeSchema>;

export const MetadataSchema = z.object({
  request_id: z.string(),
  model_info: ModelInfoSchema,
  model_uuid: z.string(),
});
export type Metadata = z.infer<typeof MetadataSchema>;

export const ChannelSchema = z.object({
  alternatives: z.array(AlternativeSchema),
});
export type Channel = z.infer<typeof ChannelSchema>;

export const PayloadSchema = z.object({
  type: z.string(),
  channel_index: z.array(z.number()),
  duration: z.number(),
  start: z.number(),
  is_final: z.boolean(),
  speech_final: z.boolean(),
  channel: ChannelSchema,
  metadata: MetadataSchema,
  from_finalize: z.boolean(),
});
export type Payload = z.infer<typeof PayloadSchema>;

export const TranscriptionEventTranscriptSchema = z.object({
  streamSid: z.string(),
  payload: z.string(),
});
export type TranscriptionEventTranscript = z.infer<typeof TranscriptionEventTranscriptSchema>;
