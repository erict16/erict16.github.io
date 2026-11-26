import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

type Lang = 'de' | 'en' | 'es' | 'fr';

interface Label {
  anchor: 'end' | 'start';
  // the point on the drawing, then where the text sits
  px: number;
  py: number;
  text: Record<Lang, string>;
  tx: number;
  ty: number;
}

// The loop: English, then Spanish, French, German, and back to English.
const LANGS: Lang[] = ['en', 'es', 'fr', 'de'];

// Tap-changer terms, as Tuyi's glossary would write them.
const LABELS: Label[] = [
  {
    anchor: 'end',
    px: 152,
    py: 52,
    text: {
      de: 'OLTC-Kopf',
      en: 'OLTC head',
      es: 'Cabezal OLTC',
      fr: 'Tête OLTC',
    },
    tx: 128,
    ty: 52,
  },
  {
    anchor: 'end',
    px: 172,
    py: 118,
    text: {
      de: 'Lastumschalter',
      en: 'Diverter switch',
      es: 'Ruptor',
      fr: 'Commutateur',
    },
    tx: 128,
    ty: 118,
  },
  {
    anchor: 'end',
    px: 162,
    py: 214,
    text: { de: 'Wähler', en: 'Tap selector', es: 'Selector', fr: 'Sélecteur' },
    tx: 128,
    ty: 214,
  },
  {
    anchor: 'start',
    px: 269,
    py: 36,
    text: {
      de: 'Schutzrelais',
      en: 'Protective relay',
      es: 'Relé de protección',
      fr: 'Relais de protection',
    },
    tx: 300,
    ty: 20,
  },
  {
    anchor: 'start',
    px: 352,
    py: 52,
    text: {
      de: 'Antriebswelle',
      en: 'Drive shaft',
      es: 'Eje de mando',
      fr: 'Arbre de commande',
    },
    tx: 300,
    ty: 132,
  },
  {
    anchor: 'start',
    px: 436,
    py: 52,
    text: {
      de: 'Winkelgetriebe',
      en: 'Bevel gearbox',
      es: 'Reenvío angular',
      fr: "Renvoi d'angle",
    },
    tx: 450,
    ty: 88,
  },
  {
    anchor: 'start',
    px: -1,
    py: -1,
    text: { de: 'Typ', en: 'Product model', es: 'Modelo', fr: 'Modèle' },
    tx: 316,
    ty: 240,
  },
];

const NOISE = 'abcdefghijklmnopqrstuvwxyz';
const FILE = 'CM_outline.dwg';

// One loop, in milliseconds: a pause, the scan line crosses the drawing,
// each label scrambles into the next language as the line reaches it, then a hold.
const SWEEP_FROM = 1100;
const SWEEP = 2800;
const X0 = -10;
const X1 = 570;
const TYPE = 420;
const FLASH = 700;
const LOOP = 7600;

const beamX = (t: number) =>
  X0 + (X1 - X0) * Math.min(1, Math.max(0, (t - SWEEP_FROM) / SWEEP));

// When the scan line reaches the left edge of the label.
const startOf = (label: Label, lang: Lang) => {
  const left =
    label.anchor === 'end'
      ? label.tx - label.text[lang].length * 6.6
      : label.tx;
  return SWEEP_FROM + ((left - X0) / (X1 - X0)) * SWEEP;
};

function scrambled(text: string, shown: number) {
  let out = text.slice(0, shown);
  for (let i = shown; i < text.length; i++) {
    out +=
      text[i] === ' ' ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)];
  }
  return out;
}

// A tap-changer outline on a CAD sheet. A scan line crosses it and every
// label scrambles into the next language, the way Tuyi writes a translation
// back into a new drawing.
export default function TuyiDrawing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const elapsed = useRef(0);
  const [time, setTime] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    if (!inView) return;
    let frame = 0;
    let last = 0;
    const begin = performance.now() - elapsed.current;
    const tick = (now: number) => {
      if (now - last > 30) {
        last = now;
        elapsed.current = Math.max(0, now - begin);
        setTime(elapsed.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  const round = Math.floor(time / LOOP);
  const t = still ? 0 : time % LOOP;
  const from = LANGS[round % LANGS.length];
  const to = LANGS[(round + 1) % LANGS.length];
  const x = beamX(t);
  const sweeping = !still && t > SWEEP_FROM && t < SWEEP_FROM + SWEEP;
  const starts = LABELS.map((label) => startOf(label, to));
  const changedCount = still
    ? 0
    : starts.filter((start) => t >= start + TYPE).length;
  const done = changedCount === LABELS.length;
  const shown = done ? to : from;

  return (
    <div
      className={['tuyi', (inView || still) && 'on', done && 'done']
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      <div className="tuyi-hud">
        <p className="tuyi-file">
          <span aria-hidden="true" className="tuyi-file-tag">
            DWG
          </span>
          <span>
            <span className="tuyi-prefix" key={shown}>
              {shown}_
            </span>
            {FILE}
          </span>
        </p>
        <p aria-hidden="true" className="tuyi-pair">
          <span>{from.toUpperCase()}</span>
          <i>→</i>
          <b key={to}>{to.toUpperCase()}</b>
          <span className="tuyi-count">
            {changedCount}/{LABELS.length}
          </span>
        </p>
      </div>

      <div className="tuyi-sheet">
        <svg
          aria-label="A tap-changer drawing whose labels Tuyi rewrites in English, Spanish, French and German, one language after another."
          role="img"
          viewBox="0 0 560 300"
        >
          <defs>
            <linearGradient id="tuyi-trail" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#6cbdb5" stopOpacity="0" />
              <stop offset="1" stopColor="#6cbdb5" stopOpacity="0.22" />
            </linearGradient>
            <linearGradient id="tuyi-beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#6cbdb5" stopOpacity="0" />
              <stop offset="0.2" stopColor="#9fe3dc" />
              <stop offset="0.8" stopColor="#9fe3dc" />
              <stop offset="1" stopColor="#6cbdb5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* sheet corners */}
          <g aria-hidden="true" className="tuyi-ticks">
            <path d="M2 18V2h16" />
            <path d="M542 2h16v16" />
            <path d="M558 282v16h-16" />
            <path d="M18 298H2v-16" />
          </g>

          <g className="tuyi-lines">
            {/* head, protective relay */}
            <rect
              className="tuyi-body"
              height="18"
              pathLength="1"
              rx="4"
              width="140"
              x="152"
              y="43"
            />
            <rect height="14" pathLength="1" rx="2" width="22" x="258" y="29" />
            {/* diverter switch oil compartment */}
            <rect
              className="tuyi-body"
              height="110"
              pathLength="1"
              rx="2"
              width="100"
              x="172"
              y="61"
            />
            <line pathLength="1" x1="172" x2="272" y1="92" y2="92" />
            {/* tap selector cage */}
            <rect
              className="tuyi-body"
              height="96"
              pathLength="1"
              rx="2"
              width="120"
              x="162"
              y="171"
            />
            {[186, 210, 234, 258].map((cx) => (
              <line key={cx} pathLength="1" x1={cx} x2={cx} y1="171" y2="267" />
            ))}
            {[190, 214, 238, 262].map((cy) =>
              [186, 210, 234, 258].map((cx) => (
                <circle
                  className="tuyi-dot"
                  cx={cx}
                  cy={cy}
                  key={`${cx}${cy}`}
                  r="3"
                />
              )),
            )}
            {/* drive shaft and bevel gearbox */}
            <line pathLength="1" x1="292" x2="424" y1="52" y2="52" />
            <rect height="24" pathLength="1" rx="3" width="24" x="424" y="40" />
            <line pathLength="1" x1="436" x2="436" y1="64" y2="150" />
            {/* a dimension under the cage */}
            <line
              className="tuyi-dim"
              pathLength="1"
              x1="162"
              x2="282"
              y1="286"
              y2="286"
            />
            <line
              className="tuyi-dim"
              pathLength="1"
              x1="162"
              x2="162"
              y1="279"
              y2="293"
            />
            <line
              className="tuyi-dim"
              pathLength="1"
              x1="282"
              x2="282"
              y1="279"
              y2="293"
            />
            {/* title block */}
            <rect
              className="tuyi-block"
              height="72"
              pathLength="1"
              rx="3"
              width="244"
              x="300"
              y="216"
            />
            <line
              className="tuyi-block"
              pathLength="1"
              x1="300"
              x2="544"
              y1="254"
              y2="254"
            />
          </g>
          <text className="tuyi-num" textAnchor="middle" x="222" y="282">
            480
          </text>

          {sweeping && (
            <g className="tuyi-beam" transform={`translate(${x} 0)`}>
              <rect
                fill="url(#tuyi-trail)"
                height="300"
                width="90"
                x="-90"
                y="0"
              />
              <rect
                className="tuyi-scan"
                fill="url(#tuyi-beam)"
                height="300"
                width="1.6"
                x="-0.8"
                y="0"
              />
            </g>
          )}

          {LABELS.map((label, index) => {
            const start = starts[index];
            const target = label.text[to];
            const typed = Math.floor(((t - start) / TYPE) * target.length);
            const live = !still && t >= start && typed < target.length;
            const changed = !still && t >= start + TYPE;
            const flash = changed && t < start + TYPE + FLASH;
            const text = changed
              ? target
              : live
                ? scrambled(target, Math.max(0, typed))
                : label.text[from];
            return (
              <g
                className={['tuyi-label', live && 'live', flash && 'flash']
                  .filter(Boolean)
                  .join(' ')}
                key={label.text.en}
              >
                {label.px >= 0 && (
                  <>
                    <polyline
                      points={`${label.px},${label.py} ${
                        label.anchor === 'end' ? label.tx + 8 : label.tx - 8
                      },${label.ty - 4}`}
                    />
                    {flash && (
                      <circle
                        className="tuyi-ping"
                        cx={label.px}
                        cy={label.py}
                        r="10"
                      />
                    )}
                    <circle
                      className="tuyi-pin"
                      cx={label.px}
                      cy={label.py}
                      r="2.6"
                    />
                  </>
                )}
                <text textAnchor={label.anchor} x={label.tx} y={label.ty}>
                  {text}
                </text>
              </g>
            );
          })}
          <text className="tuyi-meta" textAnchor="end" x="530" y="240">
            A3 · 1:20
          </text>
          <text className="tuyi-model" x="316" y="276">
            CMIII-500Y/72.5B-10193W
          </text>
        </svg>
      </div>
    </div>
  );
}
