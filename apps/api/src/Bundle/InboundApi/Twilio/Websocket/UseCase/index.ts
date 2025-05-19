import { Injectable } from '@nestjs/common';
import { PhoneConversationUseCase } from './PhoneConversation/PhoneConversationUseCase';

@Injectable()
export class WebsocketUseCaseContainer {
  phoneConversation: PhoneConversationUseCase['handle'];

  constructor(private readonly phoneConversationUseCase: PhoneConversationUseCase) {
    this.phoneConversation = this.phoneConversationUseCase.handle.bind(this.phoneConversationUseCase);
  }
}

export const TwilioWebsocketProviders = [PhoneConversationUseCase, WebsocketUseCaseContainer];
