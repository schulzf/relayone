import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingService } from 'src/Core/Logging';
import { SessionManagerModule } from 'src/Services/SessionManager/SessionManagerModule';
import { TranscriptionManagerModule } from 'src/Services/TranscriptionManager/TranscriptionManagerModule';

import { TwiMLModule } from 'src/Shared/TwiML/TwiMLModule';
import { TwilioRestController } from './Twilio/Rest/TwilioRestController';
import { TwilioRestProviders } from './Twilio/Rest/UseCase';
import { TwilioWebsocketController } from './Twilio/Websocket/TwilioWebsocketController';
import { TwilioWebsocketProviders } from './Twilio/Websocket/UseCase';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    TwiMLModule,
    SessionManagerModule,
    TranscriptionManagerModule,
  ],
  controllers: [TwilioRestController],
  providers: [TwilioWebsocketController, LoggingService, ...TwilioRestProviders, ...TwilioWebsocketProviders],
})
export class InboundApiModule {}
