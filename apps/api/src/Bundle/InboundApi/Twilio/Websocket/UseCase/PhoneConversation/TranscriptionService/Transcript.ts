import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventTranscript } from 'src/Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService/Types/TranscriptionEventTranscript';
import { SessionService } from '../SessionService/SessionService';

@Injectable()
export class Transcript {
  constructor(private readonly sessionService: SessionService) {}

  @OnEvent(TRANSCRIPTION_EVENT.TRANSCRIPT)
  transcript(payload: TranscriptionEventTranscript) {
    const session = this.sessionService.getSession(payload.streamSid);

    if (!session) {
      throw new Error('Session not found');
    }

    this.sessionService.addToCurrentTranscript(payload.streamSid, payload.payload.channel.alternatives[0]?.transcript);

    if (payload.payload.speech_final) {
      const transcript = this.sessionService.getCurrentTranscript(payload.streamSid);
      console.log('user is done talking: ', transcript);
      this.sessionService.clearCurrentTranscript(payload.streamSid);

      // TODO: save transcript to db
      // TODO: send transcript to LLM
      // TODO: save LLM response to db
      // TODO: send LLM response to user
    }
  }
}
