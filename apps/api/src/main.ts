import { inboundApiBundleBootstrap } from './Bundle/InboundApi/InboundApiBundleBootstrap';
import { trpcBundleBootstrap } from './Bundle/Trpc/TrpcBundleBootstrap';
import { startupHacks } from './hacks';

startupHacks();

switch (process.env.BUNDLE) {
  case 'TRPC':
    void trpcBundleBootstrap();
    break;
  case 'INBOUND_API':
    void inboundApiBundleBootstrap();
    break;

  case 'ALL':
    void Promise.all([trpcBundleBootstrap(), inboundApiBundleBootstrap()]);
    break;

  default:
    process.exit(1);
}
