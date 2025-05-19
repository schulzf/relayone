import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingService } from 'src/Core/Logging';

import { TwiMLModule } from 'src/Shared/TwiML/TwiMLModule';
import { TwilioRestController } from './Twilio/Rest/TwilioRestController';
import { TwilioRestProviders } from './Twilio/Rest/UseCase';
import { TwilioWebsocketController } from './Twilio/Websocket/TwilioWebsocketController';
import { TwilioWebsocketProviders } from './Twilio/Websocket/UseCase';
import { SessionServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/SessionService';
import { TranscriptionServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    TwiMLModule,
  ],
  controllers: [TwilioRestController],
  providers: [
    TwilioWebsocketController,
    LoggingService,
    ...TwilioRestProviders,
    ...TwilioWebsocketProviders,
    ...TranscriptionServiceProviders,
    ...SessionServiceProviders,
  ],
})
export class InboundApiModule {}
