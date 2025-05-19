import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Readable } from 'stream';
import { GPT_EVENT } from '../GptService/GptEventConstants';
import { GptReply } from '../GptService/Types/GptReply';
import { SessionService } from '../SessionService/SessionService';

@Injectable()
export class GenerateSpeech {
  constructor(private readonly sessionService: SessionService) {}

  @OnEvent(GPT_EVENT.REPLY)
  async generateSpeech(payload: GptReply) {
    const session = this.sessionService.getSession(payload.streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    const response = await session.elevenLabsClient.textToSpeech.convert('IpTJxgMFj1wbxpha4zxm', {
      model_id: 'eleven_multilingual_v2',
      output_format: 'ulaw_8000',
      text: payload.partialResponse,
    });

    const readableStream = Readable.from(response);
    const audioArrayBuffer = await this.streamToArrayBuffer(readableStream);

    session.twilioConn.send(
      JSON.stringify({
        streamSid: session.streamSid,
        event: 'media',
        media: {
          payload: Buffer.from(audioArrayBuffer as any).toString('base64'),
        },
      }),
    );
  }

  streamToArrayBuffer(readableStream: Readable) {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).buffer);
      });
      readableStream.on('error', reject);
    });
  }
}
