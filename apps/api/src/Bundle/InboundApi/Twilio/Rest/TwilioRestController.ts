import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { TwiMLIncomingCall } from 'src/Shared/TwiML/Schemas/IncomingCall';
import { TwilioGuard } from './Guard/TwilioGuard';
import { RestUseCaseContainer } from './UseCase';

@Controller('/twilio')
export class TwilioRestController {
  constructor(private readonly useCaseContainer: RestUseCaseContainer) {}

  @Post('/incoming')
  @UseGuards(TwilioGuard)
  async incoming(@Body() dto: TwiMLIncomingCall, @Res() res: FastifyReply) {
    return this.useCaseContainer.inbound(dto, res);
  }
}
