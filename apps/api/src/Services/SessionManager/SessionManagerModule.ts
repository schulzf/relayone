import { Module } from '@nestjs/common';
import { TranscriptionManager } from '../TranscriptionManager/TranscriptionManager';
import { SessionManager } from './SessionManager';
import { SessionManagerEventController } from './SessionManagerEventController';

@Module({
  providers: [SessionManager, SessionManagerEventController, TranscriptionManager],
  exports: [SessionManager],
})
export class SessionManagerModule {}
