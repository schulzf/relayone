import {createTRPCReact} from '@trpc/react-query';
import {type AppRouter} from 'api/dist/Bundle/Trpc/TrpcRouter';

export const trpc = createTRPCReact<AppRouter>();
