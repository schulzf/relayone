import { Injectable } from '@nestjs/common';
import { UseCase } from 'src';
import { SessionManager } from 'src/Services/SessionManager/SessionManager';

@Injectable()
export class SendUseCase implements UseCase<void, [streamSid: string, base64audio: string]> {
  constructor(private readonly sessionManager: SessionManager) {}

  handle(streamSid: string, base64audio: string): void {
    try {
      const session = this.sessionManager.getSession(streamSid);

      if (!session) {
        throw new Error(`Session not found for streamSid: ${streamSid}`);
      }

      session.deepgramClient.send(Buffer.from(base64audio, 'base64'));
    } catch (error) {
      console.error('SendUseCase error:', error);
    }
  }
}
