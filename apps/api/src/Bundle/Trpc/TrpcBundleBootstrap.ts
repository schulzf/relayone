import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {LoggingService} from '../../Core/Logging';
import {TrpcModule} from './TrpcModule';
import {TrpcRouter} from './TrpcRouter';

export const trpcBundleBootstrap = async () => {
  const log = new LoggingService();
  const app = await NestFactory.create<NestExpressApplication>(TrpcModule, {
    logger: log,
  });

  app.enableCors();

  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);

  const port = Number(process.env.PORT || 5045);
  await app.listen(port, '0.0.0.0');

  log.info(`trpc bundle started on PORT ${port}`);
};
