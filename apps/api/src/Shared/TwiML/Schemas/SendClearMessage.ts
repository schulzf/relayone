import { z } from 'zod';

/**
 * Send a clear message
 *
 * Send a clear message if you want to interrupt the audio that has been sent in various
 * media messages. This empties all buffered audio and causes any mark messages to be
 * sent back to your WebSocket server.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, "clear".
 * @property {string} streamSid - The SID of the Stream in which you wish to interrupt the audio.
 *
 * @example
 * Below is an example clear message that your WebSocket server sends to Twilio.
 *
 * {
 *  "event": "clear",
 *  "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * }
 */
export const TwiMlSendClearMessage = z.object({
  event: z.string(),
  streamSid: z.string(),
});
export type TwiMlSendClearMessage = z.infer<typeof TwiMlSendClearMessage>;
