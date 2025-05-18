import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { InboundApiModule } from './InboundApiModule';

export const inboundApiBundleBootstrap = async () => {
  // const log = new LoggingService();
  const app = await NestFactory.create(InboundApiModule);

  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  const port = Number(process.env.PORT || 5050);
  await app.listen(port);

  // log.info(`inbound api bundle started on PORT ${port}`);
};
