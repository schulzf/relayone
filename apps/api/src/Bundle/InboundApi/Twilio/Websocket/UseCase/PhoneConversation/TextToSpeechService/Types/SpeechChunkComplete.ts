export interface SpeechChunkComplete {
  streamSid: string;
  partialResponseIndex: number;
  audio: string;
}
