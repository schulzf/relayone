import { Injectable } from '@nestjs/common';
import { UseCase } from 'src';
import { TranscriptionEventTranscript } from '../Types/TranscriptionEventTranscript';

@Injectable()
export class TranscriptUseCase implements UseCase<void, [TranscriptionEventTranscript]> {
  handle(payload: TranscriptionEventTranscript) {
    // console.log(payload);
  }
}
