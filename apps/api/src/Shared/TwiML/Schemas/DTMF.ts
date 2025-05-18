import { z } from 'zod';

export const DTMFClass = z.object({
  track: z.string(),
  digit: z.string(),
});
export type DTMFClass = z.infer<typeof DTMFClass>;

/**
 * DTMF message
 *
 * The dtmf message is currently only supported in bidirectional Streams.
 *
 * A dtmf message is sent when someone presses a touch-tone number key in the inbound stream,
 * typically in response to a prompt in the outbound stream.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, dtmf.
 * @property {string} streamSid - The unique identifier of the Stream
 * @property {string} sequenceNumber - Number used to keep track of message sending order.
 *                                     The first message has a value of 1 and then is incremented for each subsequent message.
 * @property {object} dtmf - An object containing the DTMF metadata
 * @property {string} dtmf.track - The track on which the DTMF key was pressed. Value is always inbound_track
 * @property {string} dtmf.digit - The number-key tone detected
 *
 * @example
 * An example dtmf message is shown below. The dtmf.digit value is 1, indicating that someone pressed the 1 key on their handset.
 *
 * {
 *   "event": "dtmf",
 *   "streamSid":"MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *   "sequenceNumber":"5",
 *   "dtmf": {
 *       "track":"inbound_track",
 *       "digit": "1"
 *   }
 * }
 */
export const TwiMLDTMF = z.object({
  event: z.string(),
  streamSid: z.string(),
  sequenceNumber: z.string(),
  dtmf: DTMFClass,
});
export type TwiMLDTMF = z.infer<typeof TwiMLDTMF>;
