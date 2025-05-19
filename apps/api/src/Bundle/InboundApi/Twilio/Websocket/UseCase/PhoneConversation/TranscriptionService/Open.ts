import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventOpen } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscritpionEventOpen';

@Injectable()
export class Open {
  @OnEvent(TRANSCRIPTION_EVENT.OPEN)
  open(payload: TranscriptionEventOpen) {
    console.log(TRANSCRIPTION_EVENT.OPEN, payload.streamSid, payload.payload.key);
  }
}
