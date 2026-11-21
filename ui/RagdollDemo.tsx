'use client';

import { useInView } from '@/lib/useInView';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

// The Ragdoll Mail demo film in a window that tips up as it scrolls in.
// It plays only while it is on screen, and without sound until asked.
export default function RagdollDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(stage, 0.4);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const film = video.current;
    if (!film) return;
    if (inView) {
      film.play().catch(() => {});
    } else {
      film.pause();
    }
  }, [inView]);

  return (
    <div className="stage" data-stage ref={stage}>
      <div className="window">
        <video
          aria-label="Ragdoll Mail: an AI agent writes a reply from the terminal, the draft opens in the app, the send is undone and set for tomorrow, and search finds mail as you type"
          loop
          muted={!sound}
          playsInline
          poster="/static/home/ragdoll-demo.webp"
          preload="none"
          ref={video}
          src="/static/home/ragdoll-demo.mp4"
        />
        <button
          aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={sound}
          className="sound"
          onClick={() => setSound(!sound)}
          type="button"
        >
          {sound ? <SpeakerWaveIcon /> : <SpeakerXMarkIcon />}
        </button>
      </div>
    </div>
  );
}
