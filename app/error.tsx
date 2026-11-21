'use client';

import { useEffect } from 'react';

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="lost" id="main-content">
      <h1 className="display">
        Something <em>went wrong</em>.
      </h1>
      <p className="intro">Load the page again.</p>
    </main>
  );
}
