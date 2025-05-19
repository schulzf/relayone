import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs';
import * as WebSocket from 'ws';
import { Session } from '../SessionService/SessionService';
import { TEXT_TO_SPEECH } from './TextToSpeechConstants';
import { ElevenLabsWebsocketMessage } from './Types/ElevenLabsWebsocketMessage';
import { SpeechChunkComplete } from './Types/SpeechChunkComplete';

@Injectable()
export class CreateElevenLabsConnection {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  createConnection(session: Session, voiceId = 'Xb7hH8MSUJpSbSDYk0k2') {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    // For use cases where latency is important, we recommend using the 'eleven_flash_v2_5' model.
    const model = 'eleven_flash_v2_5';
    const uri = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;

    const websocket = new WebSocket(uri, {
      headers: { 'xi-api-key': `${ELEVENLABS_API_KEY}` },
    });

    websocket.on('close', (data) => {
      console.log('WebSocket (ElevenLabs) closed:', data);
    });

    websocket.on('message', (data: Buffer) => {
      const message = JSON.parse(data.toString()) as ElevenLabsWebsocketMessage;

      const path = '/Users/schulzf/Desktop/dump.json';
      //   if no file create
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '');
      }

      // store the content of this message on ~/Desktop/dump.json, concenate the content with the previous content
      const previousContent = fs.readFileSync(path, 'utf8');
      fs.writeFileSync(path, previousContent + JSON.stringify(message, null, 2));

      if (message.audio) {
        this.eventEmitter.emit(TEXT_TO_SPEECH.SPEECH_CHUNK_COMPLETE, {
          streamSid: session.streamSid,
          partialResponseIndex: session.gptPartialResponseIndex,
          audio: message.audio,
        } satisfies SpeechChunkComplete);
      }
    });

    return websocket;
  }
}
