import {trpcBundleBootstrap} from "./Bundle/Trpc/TrpcBundleBootstrap";
import {startupHacks} from "./hacks";

startupHacks();

switch (process.env.BUNDLE) {
  case "TRPC":
    void trpcBundleBootstrap();
    break;
  case "LOCAL_UI":
    void trpcBundleBootstrap();
    break;

  case "ALL":
    void Promise.all([trpcBundleBootstrap()]);

    break;

  default:
    process.exit(1);
}
