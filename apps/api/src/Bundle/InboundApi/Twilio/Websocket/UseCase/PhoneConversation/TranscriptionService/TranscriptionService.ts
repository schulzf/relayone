import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios, { AxiosError } from 'axios';
import { WebSocket } from 'ws';
import { TRANSCRIPTION_EVENT } from './TranscriptionEventConstants';
import { GladiaTranscript } from './Types/GladiaTranscript';
import { TranscriptionEventTranscript } from './Types/TranscriptionEventTranscript';

interface InitiateResponse {
  id: string;
  url: string;
}

interface TranscriptionBuffer {
  text: string;
  timer: NodeJS.Timeout | null;
  lastTranscriptTime: number;
  intervalHistory: number[];
  currentTimeout: number;
}

@Injectable()
export class TranscriptionService {
  private transcriptionBuffers: Map<string, TranscriptionBuffer>;
  private readonly MIN_BUFFER_TIMEOUT = 500; // 300ms minimum
  private readonly MAX_BUFFER_TIMEOUT = 1500; // 2s maximum
  private readonly DEFAULT_BUFFER_TIMEOUT = 1000; // 1s default
  private readonly HISTORY_SIZE = 5; // Number of intervals to keep for average calculation

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.transcriptionBuffers = new Map();
  }

  private getOrCreateBuffer(streamSid: string): TranscriptionBuffer {
    if (!this.transcriptionBuffers.has(streamSid)) {
      this.transcriptionBuffers.set(streamSid, {
        text: '',
        timer: null,
        lastTranscriptTime: Date.now(),
        intervalHistory: [],
        currentTimeout: this.DEFAULT_BUFFER_TIMEOUT,
      });
    }
    return this.transcriptionBuffers.get(streamSid)!;
  }

  private calculateDynamicTimeout(buffer: TranscriptionBuffer): number {
    if (buffer.intervalHistory.length === 0) {
      return this.DEFAULT_BUFFER_TIMEOUT;
    }

    // Calculate average interval
    const avgInterval = buffer.intervalHistory.reduce((a, b) => a + b, 0) / buffer.intervalHistory.length;

    // If average interval is very small (rapid transcripts), use a shorter timeout
    // If average interval is larger (slower transcripts), use a longer timeout
    // Multiply by 1.5 to give some buffer room for the next transcript
    let dynamicTimeout = avgInterval * 1.5;

    // Ensure timeout stays within bounds
    return Math.min(Math.max(dynamicTimeout, this.MIN_BUFFER_TIMEOUT), this.MAX_BUFFER_TIMEOUT);
  }

  private updateIntervalHistory(buffer: TranscriptionBuffer) {
    const now = Date.now();
    const interval = now - buffer.lastTranscriptTime;

    // Only track intervals that seem reasonable (not too long, which might indicate a pause in speech)
    if (interval < this.MAX_BUFFER_TIMEOUT) {
      buffer.intervalHistory.push(interval);
      // Keep only the most recent intervals
      if (buffer.intervalHistory.length > this.HISTORY_SIZE) {
        buffer.intervalHistory.shift();
      }
    }

    buffer.lastTranscriptTime = now;
    buffer.currentTimeout = this.calculateDynamicTimeout(buffer);
  }

  private emitBufferedTranscript(streamSid: string) {
    const buffer = this.transcriptionBuffers.get(streamSid);
    if (buffer && buffer.text) {
      this.eventEmitter.emit(TRANSCRIPTION_EVENT.TRANSCRIPT, {
        streamSid,
        payload: buffer.text.trim(),
      } satisfies TranscriptionEventTranscript);

      // Clear the buffer text but maintain timing data
      buffer.text = '';
    }
  }

  async createTranscriptionClient(streamSid: string) {
    const gladiaSession = await this.initLiveSession();

    return this.initWebsocket(gladiaSession.url, streamSid);
  }

  async initLiveSession(): Promise<InitiateResponse> {
    try {
      const { data } = await axios.post<InitiateResponse>(
        `${process.env.GLADIA_API_URL}/v2/live`,
        {
          encoding: 'wav/ulaw',
          bit_depth: 8,
          sample_rate: 8_000,
          channels: 1,
          model: 'solaria-1',
          endpointing: 0.1,
          maximum_duration_without_endpointing: 20,
          pre_processing: {
            audio_enhancer: false,
            speech_threshold: 0.5,
          },
          callback: false,
          callback_config: {
            url: '',
          },
          language_config: {
            languages: ['fr'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-GLADIA-KEY': process.env.GLADIA_API_KEY,
          },
        },
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`${error.response?.status}: ${JSON.stringify(error.response?.data) || error.message}`);
      }
      throw error;
    }
  }

  initWebsocket(url: string, streamSid: string) {
    const socket = new WebSocket(url);

    socket.on('open', () => {
      console.log('Gladia session opened');
    });

    socket.on('error', (error) => {
      console.error('Gladia session error', error);
      socket.close();
    });

    socket.on('close', async () => {
      console.log('Gladia session closed for streamSid', streamSid);
      // Clean up any remaining buffer
      const buffer = this.transcriptionBuffers.get(streamSid);
      if (buffer?.timer) {
        clearTimeout(buffer.timer);
      }
      this.emitBufferedTranscript(streamSid);
      this.transcriptionBuffers.delete(streamSid);
    });

    socket.on('message', (event: any) => {
      // All the messages we are sending are in JSON format
      const message = JSON.parse(String(event));

      if (message.type === 'transcript') {
        const transcript = message as GladiaTranscript;
        const buffer = this.getOrCreateBuffer(streamSid);

        // Update timing data and calculate new timeout
        this.updateIntervalHistory(buffer);

        // Append new text to buffer
        buffer.text += (buffer.text ? ' ' : '') + transcript.data.utterance.text;

        // Clear existing timer if there is one
        if (buffer.timer) {
          clearTimeout(buffer.timer);
        }

        // Set new timer with dynamic timeout
        buffer.timer = setTimeout(() => {
          this.emitBufferedTranscript(streamSid);
        }, buffer.currentTimeout);
      }
    });

    return socket;
  }

  sendMediaForTranscription(client: WebSocket, base64audio: string) {
    // const ulawBuffer = Buffer.from(base64audio, 'base64');
    // const pcm16Buffer = resampleUlawToPcm16(ulawBuffer);
    // const pcm16BufferBase64 = Buffer.from(pcm16Buffer).toString('base64');

    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'audio_chunk',
          data: {
            chunk: base64audio,
          },
        }),
      );
    }
  }
}
