import { Module } from '@nestjs/common';
import { SessionManagerModule } from '../SessionManager/SessionManagerModule';
import { TranscriptionEventController } from './TranscriptionEventController';
import { TranscriptionManager } from './TranscriptionManager';
import { TranscriptionProviders } from './UseCase';

@Module({
  imports: [SessionManagerModule],
  providers: [TranscriptionManager, TranscriptionEventController, ...TranscriptionProviders],
  exports: [TranscriptionManager],
})
export class TranscriptionManagerModule {}
