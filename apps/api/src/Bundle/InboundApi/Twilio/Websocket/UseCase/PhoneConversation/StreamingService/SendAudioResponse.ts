import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UniqueID } from 'src/Utils/UniqueID';
import * as WebSocket from 'ws';
import { SessionService } from '../SessionService/SessionService';
import { TEXT_TO_SPEECH } from '../TextToSpeechService/TextToSpeechConstants';
import { SpeechChunkComplete } from '../TextToSpeechService/Types/SpeechChunkComplete';

export interface SendAudioResponseBuffer {
  streamSid: string;
}

@Injectable()
export class SendAudioResponse {
  constructor(
    private readonly uniqueID: UniqueID,
    private readonly sessionService: SessionService,
  ) {}

  @OnEvent(TEXT_TO_SPEECH.SPEECH_CHUNK_COMPLETE)
  buffer(event: SpeechChunkComplete) {
    const { streamSid, partialResponseIndex, audio } = event;
    const session = this.sessionService.getSession(streamSid);

    if (!session) {
      throw new Error('Session not found');
    }

    return this.sendAudio(audio, streamSid, session.twilioConn);

    // // Welcome message has no index, play immediately
    // if (partialResponseIndex === 0) {
    //   this.sendAudio(audio, streamSid, session.twilioConn);
    // }
    // // If this is the next expected piece, play it and check for more
    // else if (partialResponseIndex === session.expectedAudioIndex) {
    //   this.sendAudio(audio, streamSid, session.twilioConn);
    //   session.expectedAudioIndex++;

    //   // Play any stored pieces that are now ready in sequence
    //   while (Object.prototype.hasOwnProperty.call(session.audioBuffers, session.expectedAudioIndex)) {
    //     const bufferedAudio = session.audioBuffers[session.expectedAudioIndex];
    //     this.sendAudio(bufferedAudio, streamSid, session.twilioConn);
    //     session.expectedAudioIndex++;
    //   }
    // }
    // // Store future pieces until their turn
    // else {
    //   session.audioBuffers[partialResponseIndex] = audio;
    // }
  }

  // Actually sends audio to the caller through websocket
  sendAudio(base64audio: string, streamSid: string, ws: WebSocket) {
    // Send the audio data
    const mediaPayload = {
      streamSid,
      event: 'media',
      media: { payload: base64audio },
    };

    ws.send(JSON.stringify(mediaPayload));

    // Create and send a unique marker to track when audio finishes playing
    const markLabel = this.uniqueID.generate();
    const mark = {
      streamSid,
      event: 'mark',
      mark: { name: markLabel },
    };

    ws.send(JSON.stringify(mark));
    this.sessionService.addMark(streamSid, markLabel);
  }
}
