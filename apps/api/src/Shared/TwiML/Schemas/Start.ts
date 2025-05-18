import { z } from 'zod';

export const CustomParameters = z.object({});
export type CustomParameters = z.infer<typeof CustomParameters>;

export const MediaFormat = z.object({
  encoding: z.string(),
  sampleRate: z.number(),
  channels: z.number(),
});
export type MediaFormat = z.infer<typeof MediaFormat>;

export const StartClass = z.object({
  accountSid: z.string(),
  streamSid: z.string(),
  callSid: z.string(),
  tracks: z.array(z.string()),
  mediaFormat: MediaFormat,
  customParameters: CustomParameters,
});
export type StartClass = z.infer<typeof StartClass>;

/**
 * Start message
 *
 * The start message contains metadata about the Stream and is sent immediately after the connected message.
 * It is only sent once at the start of the Stream.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, start.
 * @property {string} sequenceNumber - Number used to keep track of message sending order.
 *                                     The first message has a value of 1 and then is incremented for each subsequent message.
 * @property {object} start - An object containing Stream metadata
 * @property {string} start.streamSid - The unique identifier of the Stream
 * @property {string} start.accountSid - The SID of the Account that created the Stream
 * @property {string} start.callSid - The SID of the Call that started the Stream was started
 * @property {string[]} start.tracks - An array of strings that indicate which media flows are expected in subsequent messages.
 *                                     Values include inbound, outbound.
 * @property {object} start.customParameters - An object containing the custom parameters that were set when defining the Stream
 * @property {object} start.mediaFormat - An object containing the format of the payload in the media messages.
 * @property {string} start.mediaFormat.encoding - The encoding of the data in the upcoming payload. Value is always audio/x-mulaw.
 * @property {number} start.mediaFormat.sampleRate - The sample rate in hertz of the upcoming audio data. Value is always 8000
 * @property {number} start.mediaFormat.channels - The number of channels in the input audio data. Value is always 1
 * @property {string} streamSid - The unique identifier of the Stream
 *
 * The start.customParameters object is populated with the values you provided when starting the stream.
 * See the <Stream> TwiML doc or the Stream resource API reference doc for more info.
 *
 * @example
 * An example start message is shown below.
 *
 * {
 *   "event": "start",
 *   "sequenceNumber": "1",
 *   "start": {
 *     "accountSid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *     "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *     "callSid": "CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
 *     "tracks": [ "inbound" ],
 *     "mediaFormat": {
 *         "encoding": "audio/x-mulaw",
 *         "sampleRate": 8000,
 *         "channels": 1 },
 *     "customParameters": {
 *      "FirstName": "Jane",
 *      "LastName": "Doe",
 *      "RemoteParty": "Bob",
 *    },
 *   },
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * }
 */
export const TwiMLStart = z.object({
  event: z.string(),
  sequenceNumber: z.string(),
  start: StartClass,
  streamSid: z.string(),
});
export type TwiMLStart = z.infer<typeof TwiMLStart>;
