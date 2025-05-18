import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { WebsocketUseCaseContainer } from './UseCase';

@WebSocketGateway(5033, { path: 'twiml', transports: ['websocket', 'polling'], cors: { origin: '*' } })
export class TwilioWebsocketController implements OnGatewayConnection {
  constructor(private readonly useCaseContainer: WebsocketUseCaseContainer) {}

  @WebSocketServer()
  server: WebSocket.Server;

  async handleConnection(ws: WebSocket) {
    this.useCaseContainer.phoneConversation(ws);
  }
}
