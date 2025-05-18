import { Module } from '@nestjs/common';
import { UniqueID } from 'src/Utils/UniqueID';
import { TwiMLStream } from './Services/Stream';

@Module({
  providers: [UniqueID, TwiMLStream],
  exports: [UniqueID, TwiMLStream],
})
export class TwiMLModule {}
