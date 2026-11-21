import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

// The type string the selector gives for 25 MVA, 110 kV, tap changer at the
// neutral end, with the meaning of each coded part.
const PARTS = [
  { means: 'Vacuum, compound', text: 'CV2' },
  { means: 'Three phases', text: 'III' },
  { text: '-' },
  { means: '350 A through-current', text: '350' },
  { means: 'Star connection', text: 'Y' },
  { text: '/' },
  { means: 'Um 72.5 kV', text: '72.5' },
  { text: '-' },
  { means: '19 positions, reversing', text: '10193W' },
];

const NAMED = PARTS.flatMap((part, index) => (part.means ? [index] : []));

export default function TypeCode() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const timer = setInterval(() => setTurn((value) => value + 1), 1500);
    return () => clearInterval(timer);
  }, [inView]);

  const active = NAMED[turn % NAMED.length];

  return (
    <div className="code" ref={ref}>
      <p className="code-duty">25 MVA · 110 kV · neutral end</p>
      <p aria-label="CV2III-350Y/72.5-10193W" className="code-type">
        {PARTS.map((part, index) => (
          <span
            aria-hidden="true"
            className={index === active ? 'on' : part.means ? '' : 'dim'}
            key={index}
          >
            {part.text}
          </span>
        ))}
      </p>
      <p className="code-means" key={active}>
        {PARTS[active].means}
      </p>
    </div>
  );
}
