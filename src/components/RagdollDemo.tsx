import { useInView } from '@/lib/useInView';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

// The Ragdoll Mail demo film in a window that tips up as it scrolls in.
// It plays while on screen, muted until asked, with a reliable play fallback.
export default function RagdollDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(stage, 0.2);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const film = video.current;
    if (!film) return;
    film.muted = !sound;
    if (sound) {
      film.volume = 0.6;
      film.play().catch(() => {});
    }
  }, [sound]);

  useEffect(() => {
    const film = video.current;
    if (!film) return;
    if (inView) {
      film.muted = !sound;
      if (film.preload === 'none') film.preload = 'auto';
      film.play().catch(() => {
        film.controls = true;
      });
    } else {
      film.pause();
    }
  }, [inView, sound]);

  return (
    <div className="stage" data-stage ref={stage}>
      <div className="window">
        <video
          aria-label="Ragdoll Mail in use: an AI agent in a terminal saves a reply to Drafts with the ragdoll command, you read it in the app, the agent sends it when you say yes, it shows in Sent, and search finds mail as you type"
          autoPlay
          loop
          muted={!sound}
          playsInline
          poster="/static/home/ragdoll-demo.webp?v=2"
          preload="metadata"
          ref={video}
          src="/static/home/ragdoll-demo.mp4?v=2"
        />
        <button
          aria-label={sound ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={sound}
          className="sound"
          onClick={() => setSound((current) => !current)}
          type="button"
        >
          {sound ? <SpeakerWaveIcon /> : <SpeakerXMarkIcon />}
        </button>
      </div>
    </div>
  );
}
