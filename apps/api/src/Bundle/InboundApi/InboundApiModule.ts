import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingService } from 'src/Core/Logging';
import { UniqueID } from 'src/Utils/UniqueID';
import { TwilioRestController } from './Twilio/Rest/TwilioRestController';
import { TwilioRestProviders } from './Twilio/Rest/UseCase';
import { TwilioWebsocketController } from './Twilio/Websocket/TwilioWebsocketController';
import { TwilioWebsocketProviders } from './Twilio/Websocket/UseCase';
import { GptServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/GptService';
import { SessionServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/SessionService';
import { StreamingServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/StreamingService';
import { TextToSpeechServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/TextToSpeechService';
import { TranscriptionServiceProviders } from './Twilio/Websocket/UseCase/PhoneConversation/TranscriptionService';
@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
  ],
  controllers: [TwilioRestController],
  providers: [
    TwilioWebsocketController,
    LoggingService,
    UniqueID,
    ...TwilioRestProviders,
    ...TwilioWebsocketProviders,
    ...TranscriptionServiceProviders,
    ...SessionServiceProviders,
    ...GptServiceProviders,
    ...StreamingServiceProviders,
    ...TextToSpeechServiceProviders,
  ],
})
export class InboundApiModule {}
