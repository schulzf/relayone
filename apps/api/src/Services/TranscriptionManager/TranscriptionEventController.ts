import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CALL_EVENT } from 'src/Shared/CallEvents/CallEventConstants';
import { CallEventMediaReceived } from 'src/Shared/CallEvents/Types/CallEventMediaReceived';
import { TRANSCRIPTION_EVENT } from './TranscriptionEventConstants';
import { TranscriptionEventError } from './Types/TranscriptionEventError';
import { TranscriptionEventTranscript } from './Types/TranscriptionEventTranscript';
import { TranscriptionEventClose } from './Types/TranscritpionEventClose';
import { TranscriptionEventOpen } from './Types/TranscritpionEventOpen';
import { TranscriptionEventSpeechStarted } from './Types/TranscritpionEventSpeechStarted';
import { TranscriptionEventUtteranceEnded } from './Types/TranscritpionEventUtteranceEnded';
import { TranscriptionUseCaseContainer } from './UseCase';

@Injectable()
export class TranscriptionEventController {
  constructor(private readonly transcriptionUseCaseContainer: TranscriptionUseCaseContainer) {}

  @OnEvent(CALL_EVENT.PHONE_CALL_MEDIA_RECEIVED)
  mediaReceived(payload: CallEventMediaReceived) {
    this.transcriptionUseCaseContainer.send(payload.streamSid, payload.media);
  }

  @OnEvent(TRANSCRIPTION_EVENT.OPEN)
  open(payload: TranscriptionEventOpen) {
    console.log(TRANSCRIPTION_EVENT.OPEN, payload.streamSid, payload.payload.key);
  }

  @OnEvent(TRANSCRIPTION_EVENT.CLOSE)
  close(payload: TranscriptionEventClose) {
    console.log(TRANSCRIPTION_EVENT.CLOSE, payload.streamSid);
  }

  @OnEvent(TRANSCRIPTION_EVENT.TRANSCRIPT)
  transcript(payload: TranscriptionEventTranscript) {
    console.log(
      TRANSCRIPTION_EVENT.TRANSCRIPT,
      payload.streamSid,
      'is final:',
      payload.payload.is_final,
      'transcript:',
      payload.payload.channel.alternatives[0]?.transcript,
    );
  }

  @OnEvent(TRANSCRIPTION_EVENT.ERROR)
  error(payload: TranscriptionEventError) {
    console.log(TRANSCRIPTION_EVENT.ERROR, JSON.stringify(payload));
  }

  @OnEvent(TRANSCRIPTION_EVENT.SPEECH_STARTED)
  speechStarted(payload: TranscriptionEventSpeechStarted) {
    console.log(TRANSCRIPTION_EVENT.SPEECH_STARTED, JSON.stringify(payload));
  }

  @OnEvent(TRANSCRIPTION_EVENT.UTTERANCE_ENDED)
  utteranceEnded(payload: TranscriptionEventUtteranceEnded) {
    console.log(TRANSCRIPTION_EVENT.UTTERANCE_ENDED, payload.streamSid, payload.payload.last_word_end);
  }
}
