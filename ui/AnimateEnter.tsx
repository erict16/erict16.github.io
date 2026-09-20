'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function AnimateEnter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <m.main
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-8 pt-6 sm:pb-10 sm:pt-8"
        exit={{ opacity: 0, y: 20 }}
        id="main-content"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </m.main>
    </LazyMotion>
  );
}
