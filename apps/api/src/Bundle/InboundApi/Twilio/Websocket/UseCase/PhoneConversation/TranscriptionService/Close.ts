import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventClose } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscritpionEventClose';

@Injectable()
export class Close {
  @OnEvent(TRANSCRIPTION_EVENT.OPEN)
  close(payload: TranscriptionEventClose) {
    console.log(TRANSCRIPTION_EVENT.CLOSE, payload.streamSid);
  }
}
