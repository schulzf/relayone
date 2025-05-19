import { Module } from '@nestjs/common';
import { UniqueID } from 'src/Utils/UniqueID';
import { TwiMLStream } from '../../Bundle/InboundApi/Twilio/Websocket/UseCase/PhoneConversation/StreamingService/Stream';

@Module({
  providers: [UniqueID, TwiMLStream],
  exports: [UniqueID, TwiMLStream],
})
export class TwiMLModule {}
