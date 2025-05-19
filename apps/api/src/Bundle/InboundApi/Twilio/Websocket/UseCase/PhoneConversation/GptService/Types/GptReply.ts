export interface GptReply {
  streamSid: string;
  partialResponseIndex: number;
  partialResponse: string;
  isFinal: boolean;
}
