import { createClient, ListenLiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TRANSCRIPTION_EVENT } from './TranscriptionEventConstants';
import { TranscriptionEventError } from './Types/TranscriptionEventError';
import { TranscriptionEventTranscript } from './Types/TranscriptionEventTranscript';
import { TranscriptionEventClose } from './Types/TranscritpionEventClose';
import { TranscriptionEventOpen } from './Types/TranscritpionEventOpen';
import { TranscriptionEventSpeechStarted } from './Types/TranscritpionEventSpeechStarted';
import { TranscriptionEventUtteranceEnded } from './Types/TranscritpionEventUtteranceEnded';

@Injectable()
export class TranscriptionService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  createTranscriptionClient(streamSid: string) {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    // Configure live transcription settings
    const deepgramClient = deepgram.listen.live({
      encoding: 'mulaw', // Audio encoding type
      channels: 1,
      sample_rate: 8000, // Phone call quality
      model: 'nova-3', // Deepgram model to use
      punctuate: true, // Add punctuation
      interim_results: true, // Get partial results
      smart_format: true,
      vad_events: true,
      endpointing: 200, // Detect speech endings
      utterance_end_ms: 1000, // Wait time for utterance end
      language: 'multi',
    });

    deepgramClient.on(LiveTranscriptionEvents.Open, (payload) => {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.OPEN, { streamSid, payload } satisfies TranscriptionEventOpen);
    });

    deepgramClient.on(LiveTranscriptionEvents.Close, (payload) => {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.CLOSE, { streamSid, payload } satisfies TranscriptionEventClose);
    });

    deepgramClient.on(LiveTranscriptionEvents.Transcript, (payload: TranscriptionEventTranscript['payload']) => {
      // ignore silence
      if (payload.channel.alternatives[0]?.transcript === '') {
        return;
      }

      // Only process final transcripts
      if (payload.is_final) {
        this.eventEmitter.emit(TRANSCRIPTION_EVENT.TRANSCRIPT, { streamSid, payload } satisfies TranscriptionEventTranscript);
      } else {
        this.eventEmitter.emit(TRANSCRIPTION_EVENT.IS_TALKING);
      }
    });

    deepgramClient.on(LiveTranscriptionEvents.Error, (payload) => {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.ERROR, { streamSid, payload } satisfies TranscriptionEventError);
    });

    deepgramClient.on(LiveTranscriptionEvents.SpeechStarted, (payload) => {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.SPEECH_STARTED, { streamSid, payload } satisfies TranscriptionEventSpeechStarted);
    });

    deepgramClient.on(LiveTranscriptionEvents.UtteranceEnd, (payload) => {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.UTTERANCE_ENDED, { streamSid, payload } satisfies TranscriptionEventUtteranceEnded);
    });

    deepgramClient.on(LiveTranscriptionEvents.Unhandled, (payload) => {
      console.log('unhandled', payload);
    });

    return deepgramClient;
  }

  sendMediaForTranscription(client: ListenLiveClient, base64audio: string) {
    client.send(Buffer.from(base64audio, 'base64'));
  }
}
