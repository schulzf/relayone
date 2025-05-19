import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventUtteranceEnded } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscritpionEventUtteranceEnded';

@Injectable()
export class UtteranceEnded {
  @OnEvent(TRANSCRIPTION_EVENT.UTTERANCE_ENDED)
  utteranceEnded(payload: TranscriptionEventUtteranceEnded) {
    console.log(TRANSCRIPTION_EVENT.UTTERANCE_ENDED, payload.streamSid, payload.payload.last_word_end);
  }
}
