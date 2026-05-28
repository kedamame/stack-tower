'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import('@farcaster/miniapp-sdk')
      .then(({ sdk }) => sdk.actions.ready())
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    // Hold the splash screen until SDK is initialized
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  return <>{children}</>;
}
