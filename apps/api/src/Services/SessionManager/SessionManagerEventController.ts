import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CALL_EVENT } from 'src/Shared/CallEvents/CallEventConstants';
import { SessionManager } from './SessionManager';

@Injectable()
export class SessionManagerEventController {
  constructor(private readonly sessionManager: SessionManager) {}

  @OnEvent(CALL_EVENT.PHONE_CALL_STARTED)
  handlePhoneCallStarted(event: { callSid: string; accountSid: string }) {
    const { callSid, accountSid } = event;
    const session = this.sessionManager.getSession(callSid);
  }
}
