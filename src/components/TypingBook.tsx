import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

// The opening of Moby-Dick (Herman Melville, 1851), typed the way TypeBooks
// has you type it.
const TEXT =
  'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.';

export default function TypingBook() {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref);
  const [typed, setTyped] = useState(16);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const done = typed >= TEXT.length;
    const timer = setTimeout(
      () => setTyped(done ? 0 : typed + 1),
      done ? 2600 : 45 + Math.random() * 90,
    );
    return () => clearTimeout(timer);
  }, [inView, typed]);

  return (
    <p aria-label={TEXT} className="book" ref={ref}>
      <span aria-hidden="true" className="book-done">
        {TEXT.slice(0, typed)}
      </span>
      <span aria-hidden="true" className="caret" />
      <span aria-hidden="true">{TEXT.slice(typed)}</span>
    </p>
  );
}
