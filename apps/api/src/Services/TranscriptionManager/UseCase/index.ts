import { Injectable } from '@nestjs/common';
import { SendUseCase } from './Send';
import { TranscriptUseCase } from './Transcript';

@Injectable()
export class TranscriptionUseCaseContainer {
  send: SendUseCase['handle'];
  transcript: TranscriptUseCase['handle'];

  constructor(
    private readonly sendUseCase: SendUseCase,
    private readonly transcriptUseCase: TranscriptUseCase,
  ) {
    this.send = this.sendUseCase.handle.bind(this.sendUseCase);
    this.transcript = this.transcriptUseCase.handle.bind(this.transcriptUseCase);
  }
}

export const TranscriptionProviders = [TranscriptionUseCaseContainer, SendUseCase, TranscriptUseCase];
