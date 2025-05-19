import { openai } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { streamText } from 'ai';
import { SessionService } from '../SessionService/SessionService';
import { TRANSCRIPTION_EVENT } from '../TranscriptionService/TranscriptionEventConstants';
import { TranscriptionEventSpeechEnded } from '../TranscriptionService/Types/TranscritpionEventSpeechEnded';
import { GPT_EVENT } from './GptEventConstants';
import { GptReply } from './Types/GptReply';

@Injectable()
export class GenerateResponse {
  constructor(
    private readonly sessionService: SessionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(TRANSCRIPTION_EVENT.SPEECH_ENDED)
  async handle(event: TranscriptionEventSpeechEnded) {
    console.log('speech ended received on gptservice');

    const session = this.sessionService.getSession(event.streamSid);
    if (!session) {
      throw new Error('Session not found');
    }

    this.sessionService.addMessage(event.streamSid, { role: 'user', content: event.transcript });

    const gptResponse = streamText({ model: openai('gpt-4o-mini'), messages: session?.messages });
    let partialResponse = '';
    let fullResponse = '';

    for await (const textPart of gptResponse.textStream) {
      partialResponse += textPart;
      fullResponse += textPart;

      if (textPart.trim().length > 0) {
        const gptReply = {
          streamSid: event.streamSid,
          partialResponseIndex: session.gptPartialResponseIndex,
          partialResponse,
          isFinal: false,
        } satisfies GptReply;

        // this.eventEmitter.emit(GPT_EVENT.REPLY, gptReply);
        session.gptPartialResponseIndex++;
        partialResponse = '';
      }
    }

    await gptResponse.finishReason;
    this.eventEmitter.emit(GPT_EVENT.REPLY, {
      streamSid: event.streamSid,
      partialResponseIndex: session.gptPartialResponseIndex,
      partialResponse: fullResponse,
      isFinal: true,
    });

    this.sessionService.addMessage(event.streamSid, { role: 'assistant', content: fullResponse });
    console.log('full response: ', fullResponse);
    session.interactionCount++;
  }
}
