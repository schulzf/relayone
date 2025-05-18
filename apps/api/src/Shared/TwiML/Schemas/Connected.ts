import { z } from 'zod';

/**
 * Connected message
 *
 * Twilio sends the connected event once a WebSocket connection is established.
 * This is the first message your WebSocket server receives, and this message
 * describes the protocol to expect in the following messages.
 *
 * @property {string} event - Describes the type of WebSocket message. In this case, connected.
 * @property {string} protocol - Defines the protocol for the WebSocket connection's lifetime.
 * @property {string} version - Semantic version of the protocol.
 *
 * @example
 * {
 *  "event": "connected",
 *  "protocol": "Call",
 *  "version": "1.0.0"
 * }
 */
export const TwiMLConnected = z.object({
  event: z.string(),
  protocol: z.string(),
  version: z.string(),
});
export type TwiMLConnected = z.infer<typeof TwiMLConnected>;
