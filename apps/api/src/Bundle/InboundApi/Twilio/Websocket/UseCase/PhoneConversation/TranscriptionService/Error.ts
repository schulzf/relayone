import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventError } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscriptionEventError';

@Injectable()
export class Error {
  @OnEvent(TRANSCRIPTION_EVENT.ERROR)
  error(payload: TranscriptionEventError) {
    console.log(TRANSCRIPTION_EVENT.ERROR, payload.streamSid);
  }
}
