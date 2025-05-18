import { Module } from '@nestjs/common';
import { TextToSpeechService } from './TextToSpeech';

@Module({
  providers: [TextToSpeechService],
  exports: [TextToSpeechService],
})
export class TextToSpeechModule {}
