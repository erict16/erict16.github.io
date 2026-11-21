import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

type Line = {
  ok?: boolean;
  speed: number;
  sym: string;
  text: string;
  who: '' | 'agent' | 'you';
};

// The real commands, from the Ragdoll Mail command-line guide.
const SCRIPT: Line[] = [
  {
    speed: 34,
    sym: '›',
    text: 'Reply to Jane: the first batch ships on the 4th.',
    who: 'you',
  },
  {
    speed: 13,
    sym: '$',
    text: 'ragdoll search jane PO-1234 --json',
    who: 'agent',
  },
  { speed: 13, sym: '$', text: 'ragdoll thread inbox:1 --json', who: 'agent' },
  {
    speed: 13,
    sym: '$',
    text: 'ragdoll draft --reply inbox:1 --body reply.html',
    who: 'agent',
  },
  { speed: 13, sym: '$', text: 'ragdoll check drafts:2 --reply', who: 'agent' },
  { speed: 0, sym: '', text: 'To:      Jane Doe', who: '' },
  { speed: 0, sym: '', text: 'Subject: Re: Quote for PO-1234', who: '' },
  { ok: true, speed: 0, sym: '', text: 'CHECK OK', who: '' },
  {
    speed: 15,
    sym: '›',
    text: 'The draft is in your Drafts folder. Shall I send it?',
    who: 'agent',
  },
  { speed: 110, sym: '›', text: 'Yes.', who: 'you' },
  { speed: 13, sym: '$', text: 'ragdoll send drafts:2 --yes', who: 'agent' },
];

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [at, setAt] = useState({ char: 0, line: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (at.line < SCRIPT.length) setAt({ char: 0, line: SCRIPT.length });
      return;
    }
    if (!inView) return;
    const line = SCRIPT[at.line];
    let wait = 4600;
    let next = { char: 0, line: 0 };
    if (line && line.speed > 0 && at.char < line.text.length) {
      wait = line.speed * (0.6 + Math.random());
      next = { char: at.char + 1, line: at.line };
    } else if (line) {
      wait = line.who === 'you' ? 700 : line.speed > 0 ? 420 : 160;
      next = { char: 0, line: at.line + 1 };
    }
    const timer = setTimeout(() => setAt(next), wait);
    return () => clearTimeout(timer);
  }, [at, inView]);

  return (
    <div className="term" ref={ref}>
      <div aria-hidden="true" className="term-bar">
        <i />
        <i />
        <i />
      </div>
      <div
        aria-label="An AI agent finds a mail, writes a reply as a draft, checks it, and sends it only after you say yes."
        className="term-body"
        role="img"
      >
        {SCRIPT.map((line, index) => {
          if (index > at.line) return <div className="tl" key={index} />;
          const live = index === at.line;
          const text =
            live && line.speed > 0 ? line.text.slice(0, at.char) : line.text;
          return (
            <div className="tl" key={index}>
              <span className={`who ${line.who}`}>{line.who}</span>
              <span className="sym">{line.sym}</span>
              <span
                className={
                  line.ok
                    ? 'ok'
                    : line.sym === '$'
                      ? 'cmd'
                      : line.who
                        ? ''
                        : 'out'
                }
              >
                {text}
                {live && <span className="caret" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
