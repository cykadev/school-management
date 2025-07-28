import { cacheExchange, fetchExchange, createClient, ssrExchange } from '@urql/core';

export const createUrqlClient = () => {
  const ssr = ssrExchange({
    isClient: typeof window !== 'undefined',
  });

  const client = createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
    exchanges: [cacheExchange, ssr, fetchExchange],
    suspense: false,
    fetchOptions: {
      credentials: 'include',
    },
  });

  return { client, ssr };
};
