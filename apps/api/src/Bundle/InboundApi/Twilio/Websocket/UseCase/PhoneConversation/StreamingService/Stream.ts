import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { UniqueID } from 'src/Utils/UniqueID';
import * as WebSocket from 'ws';

@Injectable()
export class TwiMLStream extends EventEmitter {
  constructor(private readonly uniqueID: UniqueID) {
    super();
  }

  private expectedAudioIndex = 0;
  private audioBuffer: Record<number, Buffer> = {};
  private streamSid = '';
  private websocket: WebSocket;

  setWebSocket(websocket: WebSocket) {
    this.websocket = websocket;
  }

  setStreamSid(streamSid: string) {
    this.streamSid = streamSid;
  }

  // Manages the order of audio playback
  buffer(index: number, audio: Buffer) {
    // Welcome message has no index, play immediately
    if (index === null) {
      this.sendAudio(audio);
    }
    // If this is the next expected piece, play it and check for more
    else if (index === this.expectedAudioIndex) {
      this.sendAudio(audio);
      this.expectedAudioIndex++;

      // Play any stored pieces that are now ready in sequence
      while (Object.prototype.hasOwnProperty.call(this.audioBuffer, this.expectedAudioIndex)) {
        const bufferedAudio = this.audioBuffer[this.expectedAudioIndex];
        this.sendAudio(bufferedAudio);
        this.expectedAudioIndex++;
      }
    }
    // Store future pieces until their turn
    else {
      this.audioBuffer[index] = audio;
    }
  }

  // Actually sends audio to the caller through websocket
  sendAudio(audio: Buffer) {
    // Send the audio data
    this.websocket.send(
      JSON.stringify({
        streamSid: this.streamSid,
        event: 'media',
        media: {
          payload: audio,
        },
      }),
    );

    // Create and send a unique marker to track when audio finishes playing
    const markLabel = this.uniqueID.generate();

    this.websocket.send(
      JSON.stringify({
        streamSid: this.streamSid,
        event: 'mark',
        mark: {
          name: markLabel,
        },
      }),
    );

    // Let other parts of the system know audio was sent
    this.emit('audiosent', markLabel);
  }
}
