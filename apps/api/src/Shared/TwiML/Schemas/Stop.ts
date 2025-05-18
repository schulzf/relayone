import { z } from 'zod';

export const StopClass = z.object({
  accountSid: z.string(),
  callSid: z.string(),
});
export type StopClass = z.infer<typeof StopClass>;

/**
 * Stop message
 *
 * Twilio sends a stop message when the Stream has stopped or the call has ended.
 *
 * For unidirectional Streams, a Stream can be stopped with the <Stop> TwiML instruction
 * or by updating the Stream resource's status to stopped.
 *
 * For bidirectional Streams, the only way to stop a Stream is to end the call.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, stop.
 * @property {string} sequenceNumber - Number used to keep track of message sending order.
 *                                     The first message has a value of 1 and then is incremented for each subsequent message.
 * @property {object} stop - An object containing Stream metadata
 * @property {string} stop.accountSid - The Account identifier that created the Stream
 * @property {string} stop.callSid - The Call identifier that started the Stream
 * @property {string} streamSid - The unique identifier of the Stream
 *
 * @example
 * An example stop message is shown below.
 *
 * {
 *  "event": "stop",
 *  "sequenceNumber": "5",
 *  "stop": {
 *     "accountSid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *     "callSid": "CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 *   },
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * }
 */
export const TwiMLStop = z.object({
  event: z.string(),
  sequenceNumber: z.string(),
  streamSid: z.string(),
  stop: StopClass,
});
export type TwiMLStop = z.infer<typeof TwiMLStop>;
