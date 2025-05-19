import { ListenLiveClient } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import { CoreMessage } from 'ai';
import * as WebSocket from 'ws';
import { TranscriptionService } from '../TranscriptionService/TranscriptionService';

type StreamSid = string;
type CallSid = string;

export interface Session {
  callSid: CallSid;
  streamSid: StreamSid;
  twilioConn: WebSocket;
  deepgramClient: ListenLiveClient;
  messages: CoreMessage[];
  currentTranscript: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly transcriptionManager: TranscriptionService) {}

  private sessions: Map<StreamSid, Session> = new Map();

  async createSession({ callSid, streamSid, twilioConn }: { callSid: CallSid; streamSid: StreamSid; twilioConn: WebSocket }) {
    const deepgramClient = this.transcriptionManager.createTranscriptionClient(streamSid);
    const session = {
      callSid,
      streamSid,
      twilioConn,
      deepgramClient,
      messages: [],
      currentTranscript: '',
    } satisfies Session;

    this.sessions.set(streamSid, session);

    return session;
  }

  getSession(streamSid: StreamSid) {
    return this.sessions.get(streamSid);
  }

  deleteSession(streamSid: StreamSid) {
    this.sessions.delete(streamSid);
  }

  setDeepgramClient(streamSid: StreamSid, deepgramClient: ListenLiveClient) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.deepgramClient = deepgramClient;
  }

  getCurrentTranscript(streamSid: StreamSid) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }

    return session.currentTranscript;
  }

  addToCurrentTranscript(streamSid: StreamSid, transcript: string) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.currentTranscript = session.currentTranscript + ' ' + transcript;
  }

  clearCurrentTranscript(streamSid: StreamSid) {
    const session = this.getSession(streamSid);
    if (!session) {
      throw new Error('Session not found');
    }
    session.currentTranscript = '';
  }
}
