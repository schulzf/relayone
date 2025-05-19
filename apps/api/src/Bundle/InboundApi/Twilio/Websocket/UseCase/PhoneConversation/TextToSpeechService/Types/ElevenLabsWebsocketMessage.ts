import { z } from 'zod';

export const AlignmentSchema = z.object({
  chars: z.array(z.string()),
  charStartTimesMs: z.array(z.number()),
  charDurationsMs: z.array(z.number()),
});
export type Alignment = z.infer<typeof AlignmentSchema>;

export const ElevenLabsWebsocketMessageSchema = z.object({
  audio: z.string(),
  isFinal: z.null(),
  normalizedAlignment: AlignmentSchema,
  alignment: AlignmentSchema,
});
export type ElevenLabsWebsocketMessage = z.infer<typeof ElevenLabsWebsocketMessageSchema>;
