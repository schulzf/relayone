import { z } from 'zod';

export const MediaClass = z.object({
  track: z.string(),
  chunk: z.string(),
  timestamp: z.string(),
  payload: z.string(),
});
export type MediaClass = z.infer<typeof MediaClass>;

/**
 * Media message
 *
 * This message type encapsulates the raw audio data.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, "media".
 * @property {string} sequenceNumber - Number used to keep track of message sending order.
 *                                     The first message has a value of 1 and then is incremented for each subsequent message.
 * @property {object} media - An object containing media metadata and payload
 * @property {string} media.track - One of inbound or outbound
 * @property {string} media.chunk - The chunk for the message. The first message will begin with 1 and increment with each subsequent message.
 * @property {string} media.timestamp - Presentation Timestamp in Milliseconds from the start of the stream.
 * @property {string} media.payload - Raw audio in encoded in base64
 * @property {string} streamSid - The unique identifier of the Stream
 *
 * @example
 * An example outbound media message is shown below. The payload value is abbreviated.
 *
 * {
 *   "event": "media",
 *   "sequenceNumber": "3",
 *   "media": {
 *     "track": "outbound",
 *     "chunk": "1",
 *     "timestamp": "5",
 *     "payload": "no+JhoaJjpz..."
 *   },
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * }
 *
 * @example
 * An example inbound media message is shown below. The payload value is abbreviated.
 *
 * {
 *   "event": "media",
 *   "sequenceNumber": "4",
 *   "media": {
 *     "track": "inbound",
 *     "chunk": "2",
 *     "timestamp": "5",
 *     "payload": "no+JhoaJjpzS..."
 *   },
 *   "streamSid": "MZXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * }
 */
export const TwiMLMedia = z.object({
  event: z.string(),
  sequenceNumber: z.string(),
  media: MediaClass,
  streamSid: z.string(),
});
export type TwiMLMedia = z.infer<typeof TwiMLMedia>;
