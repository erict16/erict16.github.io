'use client';

import { useEffect } from 'react';

// Page motion that plain CSS cannot do: reveal on scroll, the top bar state,
// the tilt of the demo window, and the light that follows the pointer on cards.
export default function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js');

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    for (const node of document.querySelectorAll('[data-reveal]')) {
      reveal.observe(node);
    }

    const nav = document.querySelector<HTMLElement>('[data-nav]');
    const stage = document.querySelector<HTMLElement>('[data-stage]');
    let queued = false;
    const update = () => {
      queued = false;
      const view = window.innerHeight;
      const scroll = window.scrollY;
      nav?.classList.toggle('scrolled', scroll > 24);
      root.style.setProperty(
        '--hero',
        Math.min(1, scroll / (view * 0.7)).toFixed(3),
      );
      if (stage) {
        const top = stage.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (view - top) / (view * 0.8)));
        stage.style.setProperty('--p', (p * p * (3 - 2 * p)).toFixed(3));
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const onPointer = (event: PointerEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-spot]',
      );
      if (!card) return;
      const box = card.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      card.style.setProperty('--mx', `${x.toFixed(1)}px`);
      card.style.setProperty('--my', `${y.toFixed(1)}px`);
      if (card.dataset.spot === 'tilt' && event.pointerType === 'mouse') {
        card.style.setProperty('--ry', ((x / box.width - 0.5) * 5).toFixed(2));
        card.style.setProperty('--rx', ((0.5 - y / box.height) * 5).toFixed(2));
      }
    };
    const onPointerOut = (event: PointerEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-spot]',
      );
      if (!card || card.contains(event.relatedTarget as Node | null)) return;
      card.style.setProperty('--rx', '0');
      card.style.setProperty('--ry', '0');
    };
    document.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });

    return () => {
      reveal.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  return null;
}
