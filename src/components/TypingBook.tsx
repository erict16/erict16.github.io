import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

interface BookSample {
  author: string;
  chapter: string;
  id: string;
  label: string;
  text: string;
}

const BOOKS: BookSample[] = [
  {
    author: 'F. Scott Fitzgerald',
    chapter: 'Ch. 1',
    id: 'gatsby',
    label: 'Gatsby',
    text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. Whenever you feel like criticizing any one, he told me, just remember that all the people in this world haven't had the advantages that you've had.",
  },
  {
    author: 'Jane Austen',
    chapter: 'Ch. 1',
    id: 'pride',
    label: 'Pride',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families.',
  },
  {
    author: 'Arthur Conan Doyle',
    chapter: 'Ch. 1',
    id: 'sherlock',
    label: 'Sherlock',
    text: 'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.',
  },
];

// A miniature, actually-typeable TypeBooks studio: auto-types classic openings
// while untouched, and turns into a live typing test the moment you click it.
export default function TypingBook() {
  const ref = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const [bookIndex, setBookIndex] = useState(0);
  const [typed, setTyped] = useState(28);
  const [live, setLive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [keystrokes, setKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);

  const book = BOOKS[bookIndex];
  const full = book.text;

  // Auto-typing preview when not in live typing mode.
  useEffect(() => {
    if (!inView || live || prefersReducedMotion()) return;
    const atEnd = typed >= full.length;
    const timer = setTimeout(
      () => {
        if (atEnd) {
          setBookIndex((current) => (current + 1) % BOOKS.length);
          setTyped(0);
        } else {
          setTyped((value) => value + 1);
        }
      },
      atEnd ? 2200 : 48 + Math.random() * 68,
    );
    return () => clearTimeout(timer);
  }, [full.length, inView, live, typed]);

  const selectBook = (index: number) => {
    setBookIndex(index);
    setTyped(0);
    setUserInput('');
    setStartedAt(null);
    setKeystrokes(0);
    setMistakes(0);
    setLiveWpm(0);
  };

  const enterLive = () => {
    if (!live) {
      setLive(true);
      setUserInput('');
      setStartedAt(null);
      setKeystrokes(0);
      setMistakes(0);
      setLiveWpm(0);
    }
    pageRef.current?.focus();
  };

  const exitLive = () => {
    setLive(false);
    setTyped(Math.max(18, userInput.length));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!live) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      exitLive();
      pageRef.current?.blur();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      setUserInput((previous) => previous.slice(0, -1));
      return;
    }

    if (event.key.length !== 1) return;
    event.preventDefault();

    const now = Date.now();
    const begin = startedAt ?? now;
    if (startedAt === null) setStartedAt(now);

    if (userInput.length >= full.length) return;

    const expected = full[userInput.length];
    const nextInput = userInput + event.key;
    const nextKeys = keystrokes + 1;
    const nextMistakes = mistakes + (event.key === expected ? 0 : 1);

    setUserInput(nextInput);
    setKeystrokes(nextKeys);
    setMistakes(nextMistakes);

    const minutes = Math.max((now - begin) / 60_000, 1 / 60);
    let correctChars = 0;
    for (let i = 0; i < nextInput.length; i++) {
      if (nextInput[i] === full[i]) correctChars++;
    }
    setLiveWpm(Math.round(correctChars / 5 / minutes));
  };

  const cursor = live ? userInput.length : typed;
  const pct = Math.min(100, Math.round((cursor / full.length) * 100));
  const demoWpm = 76 + ((typed >> 3) % 7);
  const shownWpm = live ? liveWpm : demoWpm;
  const shownAcc = live
    ? keystrokes > 0
      ? Math.max(0, Math.round(((keystrokes - mistakes) / keystrokes) * 100))
      : 100
    : 99;
  const finished = live && userInput.length >= full.length;

  return (
    <div className="tb" ref={ref}>
      <div className="tb-top">
        <div
          aria-label="Choose a classic book"
          className="tb-tabs"
          role="tablist"
        >
          {BOOKS.map((item, index) => (
            <button
              aria-selected={index === bookIndex}
              className={index === bookIndex ? 'tb-tab on' : 'tb-tab'}
              key={item.id}
              onClick={() => selectBook(index)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          className={live ? 'tb-mode live' : 'tb-mode'}
          onClick={live ? exitLive : enterLive}
          type="button"
        >
          <span aria-hidden="true" className="tb-mode-dot" />
          {live ? 'Esc to pause' : 'Try typing'}
        </button>
      </div>

      <div
        aria-label={
          live
            ? `Typing ${book.label} by ${book.author}. Press Escape to pause.`
            : `${book.label} by ${book.author}. Click to start typing.`
        }
        className={live ? 'tb-page live' : 'tb-page'}
        onBlur={() => {
          if (live && userInput.length === 0) exitLive();
        }}
        onClick={enterLive}
        onKeyDown={onKeyDown}
        ref={pageRef}
        role="textbox"
        tabIndex={0}
      >
        <div className="tb-page-head">
          <span>
            {book.author} · {book.chapter}
          </span>
          {finished ? (
            <b className="tb-done">Passage complete</b>
          ) : (
            <span>{pct}%</span>
          )}
        </div>

        <p aria-hidden="true" className="book">
          {live ? (
            <>
              {[...userInput].map((char, index) => {
                const ok = char === full[index];
                return (
                  <span className={ok ? 'book-done' : 'book-err'} key={index}>
                    {full[index]}
                  </span>
                );
              })}
              {!finished && <span className="caret" />}
              <span>{full.slice(userInput.length)}</span>
            </>
          ) : (
            <>
              <span className="book-done">{full.slice(0, typed)}</span>
              <span className="caret" />
              <span>{full.slice(typed)}</span>
            </>
          )}
        </p>

        <div aria-hidden="true" className="tb-track">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="tb-hud">
        <div className="tb-stat">
          <b>{shownWpm}</b>
          <span>WPM</span>
        </div>
        <div className="tb-stat">
          <b>{shownAcc}%</b>
          <span>accuracy</span>
        </div>
        <span className="tb-catalog">75+ classics · EPUB</span>
      </div>
    </div>
  );
}
