'use client';

import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { CSSProperties, useEffect, useState } from 'react';

const SECONDS = 30;

type Phase = 'idle' | 'sending' | 'sent' | 'undone';

// Press Send, then take it back.
export default function UndoSend() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [left, setLeft] = useState(SECONDS);

  useEffect(() => {
    if (phase === 'idle') return;
    if (phase === 'sending') {
      const timer = setTimeout(() => {
        if (left <= 1) setPhase('sent');
        else setLeft(left - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPhase('idle'), 2200);
    return () => clearTimeout(timer);
  }, [left, phase]);

  return (
    <div className="undo">
      <div className="undo-mail">
        <span>To Jane Doe</span>
        <b>Re: Quote for PO-1234</b>
      </div>
      <div aria-live="polite" className="undo-row">
        {phase === 'idle' && (
          <button
            className="undo-send"
            onClick={() => {
              setLeft(SECONDS);
              setPhase('sending');
            }}
            type="button"
          >
            <PaperAirplaneIcon aria-hidden="true" />
            Send
          </button>
        )}
        {phase === 'sending' && (
          <>
            <span
              className="undo-ring"
              style={{ '--k': left / SECONDS } as CSSProperties}
            >
              <b>{left}</b>
            </span>
            <span className="undo-note">Sending</span>
            <button
              className="undo-back"
              onClick={() => setPhase('undone')}
              type="button"
            >
              <ArrowUturnLeftIcon aria-hidden="true" />
              Undo
            </button>
          </>
        )}
        {phase === 'undone' && (
          <span className="undo-note">Back in your drafts</span>
        )}
        {phase === 'sent' && <span className="undo-note">Sent</span>}
      </div>
    </div>
  );
}
