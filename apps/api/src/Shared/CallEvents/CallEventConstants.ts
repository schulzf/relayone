export const CALL_EVENT = {
  PHONE_CALL_STARTED: 'phone.call.started',
  PHONE_CALL_ENDED: 'phone.call.ended',
  PHONE_CALL_MEDIA_RECEIVED: 'phone.call.media.received',
  PHONE_CALL_MARK_RECEIVED: 'phone.call.mark.received',
} as const;

export type CallEvent = (typeof CALL_EVENT)[keyof typeof CALL_EVENT];
