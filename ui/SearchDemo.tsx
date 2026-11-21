'use client';

import { prefersReducedMotion, useInView } from '@/lib/useInView';
import {
  MagnifyingGlassIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';

type Mail = {
  file?: boolean;
  from: string;
  subject: string;
  text: string;
  time: string;
};

const MAILS: Mail[] = [
  {
    file: true,
    from: 'Jane Doe',
    subject: 'Quote for PO-1234',
    text: 'I have attached the signed quote and the updated delivery schedule.',
    time: '11:25',
  },
  {
    file: true,
    from: 'Li Ming',
    subject: 'Beijing ABC project: drawings to confirm',
    text: 'Attached are the latest drawings for the Beijing site.',
    time: '10:47',
  },
  {
    from: 'Sara Kim',
    subject: 'Lunch on Thursday?',
    text: 'Are you around on Thursday? There is a new noodle place.',
    time: '06:39',
  },
  {
    from: 'Daniel Ruiz',
    subject: 'Re: Site visit photos',
    text: 'Photos from the visit are below. The cabinet is in place.',
    time: '02:39',
  },
  {
    file: true,
    from: 'Northwind Billing',
    subject: 'Your invoice INV-0006 is ready',
    text: 'Your invoice INV-0006 for November is attached.',
    time: 'Yesterday',
  },
  {
    file: true,
    from: 'Tom Becker',
    subject: 'Packing list for the November shipment',
    text: 'Please find the packing list attached. Gross weight 412 kg.',
    time: 'Yesterday',
  },
  {
    from: 'Priya Natarajan',
    subject: 'Meeting notes: Q4 planning',
    text: 'Notes from today. Q4 targets are confirmed.',
    time: 'Thu',
  },
];

const TOUR = ['invoice', 'from:jane', 'drawings', 'has:attachment', 'thursday'];

function find(query: string) {
  const words: string[] = [];
  let list = MAILS;
  for (const part of query.trim().toLowerCase().split(/\s+/)) {
    if (!part) continue;
    if (part.startsWith('from:')) {
      const name = part.slice(5);
      list = list.filter((mail) => mail.from.toLowerCase().includes(name));
    } else if (part === 'has:attachment') {
      list = list.filter((mail) => mail.file);
    } else {
      words.push(part);
    }
  }
  list = list.filter((mail) => {
    const all = `${mail.from} ${mail.subject} ${mail.text}`.toLowerCase();
    return words.every((word) => all.includes(word));
  });
  return { list, words };
}

function Marked({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>;
  const escaped = words.map((word) =>
    word.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&'),
  );
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index}>{part}</mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

// A small copy of the search box. It types a few searches by itself until the
// visitor takes over.
export default function SearchDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [query, setQuery] = useState('');
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState({ char: 0, tour: 0 });

  useEffect(() => {
    if (!auto || !inView || prefersReducedMotion()) return;
    const word = TOUR[step.tour];
    const typing = step.char <= word.length;
    const timer = setTimeout(
      () => {
        if (typing) {
          setQuery(word.slice(0, step.char));
          setStep({ char: step.char + 1, tour: step.tour });
        } else {
          setQuery('');
          setStep({ char: 0, tour: (step.tour + 1) % TOUR.length });
        }
      },
      typing ? (step.char === 0 ? 500 : 95) : 2100,
    );
    return () => clearTimeout(timer);
  }, [auto, inView, step]);

  const { list, words } = find(query);

  return (
    <div className="search" ref={ref}>
      <label className="search-box">
        <MagnifyingGlassIcon aria-hidden="true" />
        <input
          aria-label="Search the sample mailbox"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setAuto(false)}
          placeholder="Search mail"
          spellCheck={false}
          type="text"
          value={query}
        />
      </label>
      <ul aria-live="polite" className="search-list">
        {list.slice(0, 3).map((mail) => (
          <li key={mail.subject}>
            <span className="search-from">
              <Marked text={mail.from} words={words} />
              {mail.file && <PaperClipIcon aria-hidden="true" />}
              <time>{mail.time}</time>
            </span>
            <span className="search-subject">
              <Marked text={mail.subject} words={words} />
            </span>
            <span className="search-text">
              <Marked text={mail.text} words={words} />
            </span>
          </li>
        ))}
        {list.length === 0 && <li className="search-none">No mail found</li>}
      </ul>
    </div>
  );
}
