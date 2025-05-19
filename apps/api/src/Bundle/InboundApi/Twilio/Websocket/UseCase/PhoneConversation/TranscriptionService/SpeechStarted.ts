import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventSpeechStarted } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscritpionEventSpeechStarted';

@Injectable()
export class SpeechStarted {
  @OnEvent(TRANSCRIPTION_EVENT.SPEECH_STARTED)
  speechStarted(payload: TranscriptionEventSpeechStarted) {
    // console.log(TRANSCRIPTION_EVENT.SPEECH_STARTED, payload.streamSid);
  }
}
