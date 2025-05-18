import { Injectable } from '@nestjs/common';
import { IncomingCallUseCase } from './IncomingCall/IncomingCallUseCase';

@Injectable()
export class RestUseCaseContainer {
  inbound: IncomingCallUseCase['handle'];

  constructor(private readonly inboundCallUseCase: IncomingCallUseCase) {
    this.inbound = this.inboundCallUseCase.handle.bind(this.inboundCallUseCase);
  }
}

export const TwilioRestProviders = [IncomingCallUseCase, RestUseCaseContainer];
