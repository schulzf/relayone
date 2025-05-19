import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UseCase } from 'src';
import { LoggingService } from 'src/Core/Logging';
import { TwiMLIncomingCall } from 'src/Shared/TwiML/Schemas/IncomingCall';
import * as VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

@Injectable()
export class IncomingCallUseCase implements UseCase<Promise<void>, [dto: TwiMLIncomingCall, res: FastifyReply]> {
  constructor(private readonly log: LoggingService) {}

  async handle(dto: TwiMLIncomingCall, res: FastifyReply) {
    try {
      const call = new VoiceResponse();
      const connection = call.connect();
      connection.stream({
        url: process.env.INBOUND_WEBSOCKET_STREAM_URL,
      });

      const twiML = call.toString();

      return res.status(200).type('text/xml').send(twiML);
    } catch (error) {
      this.log.error({ message: 'failed to pick up call', error: (error as Error).message });

      return res.status(500);
    }
  }
}
