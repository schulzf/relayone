import { z } from 'zod';

export const MarkClass = z.object({
  name: z.string(),
});
export type MarkClass = z.infer<typeof MarkClass>;

/**
 * Mark message
 *
 * Twilio sends the mark event only during bidirectional Streams.
 *
 * When your server sends a media message, it should then send a mark message to Twilio.
 * When that media message's playback is complete, Twilio sends a mark message to your
 * server using the same mark.name as the one your server sent. Your application can use
 * this information to keep track of which media has played on the Call.
 *
 * If your server sends a clear message, Twilio empties the audio buffer and sends back
 * mark messages matching any remaining mark messages from your server. Your application
 * can use this information to keep track of which media messages have been cleared and
 * will not be played.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, "mark".
 * @property {string} streamSid - The unique identifier of the Stream
 * @property {string} sequenceNumber - Number used to keep track of message sending order.
 *                                     The first message has a value of 1 and then is incremented for each subsequent message.
 * @property {object} mark - An object containing the mark metadata
 * @property {string} mark.name - A custom value. Twilio sends back the mark.name you specify when it receives a mark message
 *
 * @example
 * An example mark message is shown below.
 *
 * {
 *   "event": "mark",
 *   "sequenceNumber": "4",
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *   "mark": {
 *     "name": "my label"
 *   }
 * }
 */
export const TwiMLMark = z.object({
  event: z.string(),
  sequenceNumber: z.string(),
  streamSid: z.string(),
  mark: MarkClass,
});
export type TwiMLMark = z.infer<typeof TwiMLMark>;
