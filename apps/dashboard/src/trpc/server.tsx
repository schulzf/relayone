import {createTRPCClient, httpLink} from '@trpc/client';
import {createTRPCOptionsProxy} from '@trpc/tanstack-react-query';
import {cache} from 'react';
import 'server-only';
import {makeQueryClient} from './query-client';

export const getQueryClient = cache(makeQueryClient);

createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })],
  }),
  queryClient: getQueryClient,
});
