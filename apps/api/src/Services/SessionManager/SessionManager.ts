import { ListenLiveClient } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import { CoreMessage } from 'ai';
import * as WebSocket from 'ws';
import { TranscriptionManager } from '../TranscriptionManager/TranscriptionManager';

type StreamSid = string;
type CallSid = string;

interface Session {
  callSid: CallSid;
  streamSid: StreamSid;
  twilioConn: WebSocket;
  deepgramClient: ListenLiveClient;
  messages: CoreMessage[];
}

@Injectable()
export class SessionManager {
  constructor(private readonly transcriptionManager: TranscriptionManager) {}

  private sessions: Map<StreamSid, Session> = new Map();

  async createSession({ callSid, streamSid, twilioConn }: { callSid: CallSid; streamSid: StreamSid; twilioConn: WebSocket }) {
    const deepgramClient = this.transcriptionManager.createTranscriptionClient(streamSid);
    const session = {
      callSid,
      streamSid,
      twilioConn,
      deepgramClient,
      messages: [],
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

    this.sessions.set(streamSid, session);
  }
}
