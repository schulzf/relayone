import SuperJSON from '@repo/superjson';
import {defaultShouldDehydrateQuery, QueryClient} from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        gcTime: 1000 * 60 * 60 * 72,
        retry: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}
