import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EventEmitter } from 'events';
import { Buffer } from 'node:buffer';

@Injectable()
export class TextToSpeechService extends EventEmitter {
  constructor() {
    super();
  }

  // Convert text to speech using Deepgram's API
  async generate(gptReply: { partialResponseIndex: number; partialResponse: string }, interactionCount: number) {
    const { partialResponseIndex, partialResponse } = gptReply;

    // Skip if no text to convert
    if (!partialResponse) {
      return;
    }

    try {
      // Call Deepgram's text-to-speech API
      const response = await axios.post(
        `https://api.deepgram.com/v1/speak?model=aura-asteria-en&encoding=mulaw&sample_rate=8000&container=none`,
        {
          text: partialResponse,
        },
        {
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      // Handle successful response
      if (response.status === 200) {
        try {
          // Convert audio response to base64 format
          const base64String = Buffer.from(response.data).toString('base64');

          // Send audio to be played
          this.emit('speech', partialResponseIndex, base64String, partialResponse, interactionCount);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('Deepgram TTS error:');
        console.log(response);
      }
    } catch (err) {
      console.error('Error occurred in TextToSpeech service');
      console.error(err);
    }
  }
}
