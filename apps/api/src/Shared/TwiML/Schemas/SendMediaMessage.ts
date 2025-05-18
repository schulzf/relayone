import { z } from 'zod';

export const MediaSchema = z.object({
  payload: z.string(),
});
export type Media = z.infer<typeof MediaSchema>;

/**
 * Send a media message
 *
 * To send media back to Twilio, you must provide a properly formatted media message.
 *
 * The payload must be encoded audio/x-mulaw with a sample rate of 8000 and must be base64 encoded.
 * The audio can be of any size.
 *
 * The media messages are buffered and played in the order received. If you need to interrupt
 * the buffered audio, send a clear message.
 *
 * Warning: The media.payload should not contain audio file type header bytes.
 * Providing header bytes causes the media to be streamed incorrectly.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, "media".
 * @property {string} streamSid - The SID of the Stream that should play the audio
 * @property {object} media - An object containing the media payload
 * @property {string} media.payload - Raw mulaw/8000 audio in encoded in base64
 *
 * @example
 * Below is an example media message that your WebSocket server sends back to Twilio.
 * The media.payload is abbreviated.
 *
 * {
 *   "event": "media",
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *   "media": {
 *     "payload": "a3242sa..."
 *   }
 * }
 */
export const TwiMlSendMediaMessage = z.object({
  event: z.string(),
  streamSid: z.string(),
  media: MediaSchema,
});
export type TwiMlSendMediaMessage = z.infer<typeof TwiMlSendMediaMessage>;
