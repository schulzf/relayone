import { z } from 'zod';

export const MarkSchema = z.object({
  name: z.string(),
});
export type Mark = z.infer<typeof MarkSchema>;

/**
 * Send a mark message
 *
 * Send a mark event message after sending a media event message to be notified when
 * the audio that you have sent has been completed. Twilio sends back a mark event
 * with a matching name when the audio ends (or if there is no audio buffered).
 *
 * Your application also receives an incoming mark event message if the buffer was
 * cleared using the clear event message.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case "mark".
 * @property {string} streamSid - The SID of the Stream that should receive the mark
 * @property {object} mark - An object containing mark metadata and payload
 * @property {string} mark.name - A name specific to your needs that will assist in recognizing future received mark event
 *
 * @example
 * Below is an example mark message that your WebSocket server sends to Twilio.
 *
 * {
 *  "event": "mark",
 *  "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *  "mark": {
 *    "name": "my label"
 *  }
 * }
 */
export const TwiMlSendMarkMessage = z.object({
  event: z.string(),
  streamSid: z.string(),
  mark: MarkSchema,
});
export type TwiMlSendMarkMessage = z.infer<typeof TwiMlSendMarkMessage>;
