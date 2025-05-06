import {INestApplication, Injectable} from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import {TrpcContext} from './TrpcContext';
import {TrpcService} from './TrpcService';
import {HelloRouter} from './UseCase/Hello/HelloRouter';

export let trpcRouter: TRPCRouter;

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly createCtx: TrpcContext,
    private readonly helloRouter: HelloRouter,
  ) {}

  root = this.trpc.router({
    hello: this.helloRouter.router,
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      '/procedures',
      trpcExpress.createExpressMiddleware({
        router: this.root,
        createContext: this.createCtx.createCtx,
      }),
    );
  }
}

export type TRPCRouter = TrpcRouter[`root`];
