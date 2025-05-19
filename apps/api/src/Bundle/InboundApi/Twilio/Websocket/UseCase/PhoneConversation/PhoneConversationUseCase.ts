import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from 'src';
import { TranscriptionService } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionService';
import { CALL_EVENT } from 'src/Shared/CallEvents/CallEventConstants';
import { TwiMLEvent, TwiMLEventName } from 'src/Shared/TwiML/Schemas/Event';
import { TwiMLMark } from 'src/Shared/TwiML/Schemas/Mark';
import { TwiMLMedia } from 'src/Shared/TwiML/Schemas/Media';
import { TwiMLStart } from 'src/Shared/TwiML/Schemas/Start';
import * as WebSocket from 'ws';
import { Session, SessionService } from './SessionService/SessionService';

@Injectable()
export class PhoneConversationUseCase implements UseCase<Promise<void>, [WebSocket]> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sessionService: SessionService,
    private readonly transcriptionManager: TranscriptionService,
  ) {}

  /**
   * Handles incoming WebSocket events from the Twilio Media Stream.
   * Processes different types of events:
   * - start: Creates a new session for the call
   * - media: Forwards audio payload for transcription
   * - mark: Emits mark events for call flow control
   * - stop: Handles call termination
   *
   * @param ws - WebSocket connection from Twilio Media Stream
   * @returns Promise that resolves when the handler is set up
   */
  async handle(ws: WebSocket): Promise<void> {
    let session: Session;

    ws.on('message', async (data: WebSocket.RawData) => {
      const e: TwiMLEvent = JSON.parse(String(data));

      switch (e.event) {
        case TwiMLEventName.start:
          const callInfo = e as TwiMLStart;
          session = await this.sessionService.createSession({ callSid: callInfo.start.callSid, streamSid: e.streamSid, twilioConn: ws });
          break;
        case TwiMLEventName.media:
          const media = e as TwiMLMedia;
          if (!session) {
            return;
          }

          this.transcriptionManager.sendMediaForTranscription(session.deepgramClient, media.media.payload);
          break;
        case TwiMLEventName.mark:
          const mark = e as TwiMLMark;
          this.eventEmitter.emit(CALL_EVENT.PHONE_CALL_MARK_RECEIVED, {
            streamSid: e.streamSid,
            mark: mark.mark.name,
          });
          break;
        case TwiMLEventName.stop:
          this.eventEmitter.emit(CALL_EVENT.PHONE_CALL_ENDED, { streamSid: e.event });
          break;
        default:
          break;
      }
    });
  }
}
