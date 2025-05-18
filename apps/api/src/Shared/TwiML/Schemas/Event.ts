import { z } from 'zod';

export const TwiMLEventName = {
  connected: 'connected',
  start: 'start',
  media: 'media',
  mark: 'mark',
  clear: 'clear',
  dtmf: 'dtmf',
  stop: 'stop',
} as const;

export type TwiMLEventName = (typeof TwiMLEventName)[keyof typeof TwiMLEventName];

export const TwiMLEvent = z.object({
  event: z.nativeEnum(TwiMLEventName),
  streamSid: z.string(),
});
export type TwiMLEvent = z.infer<typeof TwiMLEvent>;
