import { z } from 'zod';

/**
 * Schema for Twilio's incoming call webhook payload
 *
 * @example
 * {
 *   AccountSid: 'AC29cde0cd852ec434460f1d0ae4d20e90',
 *   ApiVersion: '2010-04-01',
 *   Called: '+18645318893',
 *   CalledCity: 'no value',
 *   CalledCountry: 'US',
 *   CalledState: 'SC',
 *   CalledZip: 'no value',
 *   Caller: '+351911740671',
 *   CallerCity: 'no value',
 *   CallerCountry: 'PT',
 *   CallerState: 'no value',
 *   CallerZip: 'no value',
 *   CallSid: 'CA07c4e00df86d68fac9e58479ce17c532',
 *   CallStatus: 'ringing',
 *   CallToken: 'REDACTED',
 *   Direction: 'inbound',
 *   From: '+351911740671',
 *   FromCity: 'no value',
 *   FromCountry: 'PT',
 *   FromState: 'no value',
 *   FromZip: 'no value',
 *   StirVerstat: 'TN-Validation-Passed-C',
 *   To: '+18645318893',
 *   ToCity: 'no value',
 *   ToCountry: 'US',
 *   ToState: 'SC',
 *   ToZip: 'no value'
 * }
 */
export const TwiMLIncomingCall = z.object({
  Called: z.string(),
  ToState: z.string(),
  CallerCountry: z.string(),
  Direction: z.string(),
  CallerState: z.string(),
  ToZip: z.string(),
  CallSid: z.string(),
  To: z.string(),
  CallerZip: z.string(),
  ToCountry: z.string(),
  StirVerstat: z.string(),
  CallToken: z.string(),
  CalledZip: z.string(),
  ApiVersion: z.string(),
  CalledCity: z.string(),
  CallStatus: z.string(),
  From: z.string(),
  AccountSid: z.string(),
  CalledCountry: z.string(),
  CallerCity: z.string(),
  ToCity: z.string(),
  FromCountry: z.string(),
  Caller: z.string(),
  FromCity: z.string(),
  CalledState: z.string(),
  FromZip: z.string(),
  FromState: z.string(),
});
export type TwiMLIncomingCall = z.infer<typeof TwiMLIncomingCall>;
