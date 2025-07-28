'use client';

import { UrqlProvider } from '@urql/next';
import { PropsWithChildren, useMemo } from 'react';
import { createUrqlClient } from '@/lib/urqlClient';

export default function UrqlWrapper({ children }: PropsWithChildren) {
  const { client, ssr } = useMemo(() => createUrqlClient(), []);
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}