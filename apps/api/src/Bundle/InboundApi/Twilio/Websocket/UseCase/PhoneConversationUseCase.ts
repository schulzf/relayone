import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UseCase } from 'src';
import { SessionManager } from 'src/Services/SessionManager/SessionManager';
import { CALL_EVENT } from 'src/Shared/CallEvents/CallEventConstants';
import { CallEventCallStarted } from 'src/Shared/CallEvents/Types/CallEventCallStarted';
import { CallEventMediaReceived } from 'src/Shared/CallEvents/Types/CallEventMediaReceived';
import { TwiMLEvent, TwiMLEventName } from 'src/Shared/TwiML/Schemas/Event';
import { TwiMLMark } from 'src/Shared/TwiML/Schemas/Mark';
import { TwiMLMedia } from 'src/Shared/TwiML/Schemas/Media';
import { TwiMLStart } from 'src/Shared/TwiML/Schemas/Start';
import * as WebSocket from 'ws';

@Injectable()
export class PhoneConversationUseCase implements UseCase<Promise<void>, [WebSocket]> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sessionManager: SessionManager,
  ) {}

  async handle(ws: WebSocket): Promise<void> {
    try {
      ws.on('message', (data: WebSocket.RawData) => {
        const e: TwiMLEvent = JSON.parse(String(data));

        switch (e.event) {
          case TwiMLEventName.start:
            const callInfo = e as TwiMLStart;
            this.sessionManager.createSession({ callSid: callInfo.start.callSid, streamSid: e.streamSid, twilioConn: ws });
            this.eventEmitter.emit(CALL_EVENT.PHONE_CALL_STARTED, { streamSid: callInfo.start.streamSid } satisfies CallEventCallStarted);
            break;
          case TwiMLEventName.media:
            const media = e as TwiMLMedia;
            this.eventEmitter.emit(CALL_EVENT.PHONE_CALL_MEDIA_RECEIVED, {
              streamSid: e.streamSid,
              media: media.media.payload,
            } satisfies CallEventMediaReceived);
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

      // // Handle interruptions (caller speaking while assistant is)
      // stt.on('utterance', async (text: string) => {
      //   if (marks.length > 0 && text?.length > 5) {
      //     console.log('Twilio -> Interruption, Clearing stream');
      //     ws.send(
      //       JSON.stringify({
      //         streamSid: callInfo.streamSid,
      //         event: 'clear',
      //       }),
      //     );
      //   }
      // });

      // // Send GPT's response to text-to-speech
      // textConversation.on('gptreply', async (gptReply, icount) => {
      //   console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`);
      //   tts.generate(gptReply, icount);
      // });

      // // Send converted speech to caller
      // tts.on('speech', (responseIndex, audio, label, icount) => {
      //   console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`);
      //   streamService.buffer(responseIndex, audio);
      // });

      // // Track when audio pieces are sent
      // streamService.on('audiosent', (markLabel) => {
      //   marks.push(markLabel);
      // });
    } catch (err) {
      console.error('Error in PhoneConversationUseCase', err);
    }
  }
}
