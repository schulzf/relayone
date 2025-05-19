export const TRANSCRIPTION_EVENT = {
  OPEN: 'transcription.open',
  CLOSE: 'transcription.close',
  IS_TALKING: 'transcription.is_talking',
  TRANSCRIPT: 'transcription.transcript',
  ERROR: 'transcription.error',
  SPEECH_STARTED: 'transcription.speech_started',
  SPEECH_ENDED: 'transcription.speech_ended',
  UTTERANCE_ENDED: 'transcription.utterance_ended',
} as const;

export type TranscriptionEvent = (typeof TRANSCRIPTION_EVENT)[keyof typeof TRANSCRIPTION_EVENT];
