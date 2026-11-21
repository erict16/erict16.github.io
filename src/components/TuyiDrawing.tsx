import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

type Label = {
  anchor: 'end' | 'start';
  en: string;
  // the point on the drawing, then where the text sits
  px: number;
  py: number;
  tx: number;
  ty: number;
  zh: string;
};

// Terms from Tuyi's own tap-changer glossary.
const LABELS: Label[] = [
  {
    anchor: 'end',
    en: 'OLTC head',
    px: 152,
    py: 52,
    tx: 128,
    ty: 52,
    zh: '分接开关头部',
  },
  {
    anchor: 'end',
    en: 'diverter switch',
    px: 172,
    py: 118,
    tx: 128,
    ty: 118,
    zh: '切换开关',
  },
  {
    anchor: 'end',
    en: 'tap selector',
    px: 162,
    py: 214,
    tx: 128,
    ty: 214,
    zh: '分接选择器',
  },
  {
    anchor: 'start',
    en: 'Protective relay',
    px: 268,
    py: 30,
    tx: 300,
    ty: 18,
    zh: '保护继电器',
  },
  {
    anchor: 'start',
    en: 'bevel gearbox',
    px: 424,
    py: 52,
    tx: 440,
    ty: 82,
    zh: '伞齿轮盒',
  },
  {
    anchor: 'start',
    en: 'Driving shaft',
    px: 344,
    py: 52,
    tx: 300,
    ty: 132,
    zh: '传动轴',
  },
  {
    anchor: 'start',
    en: 'Product model',
    px: -1,
    py: -1,
    tx: 316,
    ty: 238,
    zh: '产品型号',
  },
];

const NOISE = 'abcdefghijklmnopqrstuvwxyz';
const FILE = 'CM_outline.dwg';

function scrambled(text: string, shown: number) {
  let out = text.slice(0, shown);
  for (let i = shown; i < text.length; i++) {
    out +=
      text[i] === ' ' ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)];
  }
  return out;
}

// A small tap-changer outline whose Chinese labels turn into English one by
// one, the way Tuyi writes the translation back into the drawing.
export default function TuyiDrawing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [run, setRun] = useState({ chars: 0, label: -1 });

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (run.label < LABELS.length) setRun({ chars: 0, label: LABELS.length });
      return;
    }
    if (!inView) return;
    let wait = 30;
    let next = run;
    if (run.label < 0) {
      wait = 1100;
      next = { chars: 0, label: 0 };
    } else if (run.label < LABELS.length) {
      const text = LABELS[run.label].en;
      if (run.chars < text.length) {
        wait = 32;
        next = { chars: run.chars + 1, label: run.label };
      } else {
        wait = 140;
        next = { chars: 0, label: run.label + 1 };
      }
    } else {
      wait = 3600;
      next = { chars: 0, label: -1 };
    }
    const timer = setTimeout(() => setRun(next), wait);
    return () => clearTimeout(timer);
  }, [inView, run]);

  const done = run.label >= LABELS.length;

  return (
    <div className="tuyi" ref={ref}>
      <p className="tuyi-file">
        <span className={done ? 'on' : ''}>en_</span>
        {FILE}
      </p>
      <svg
        aria-label="A tap-changer drawing. Tuyi turns its Chinese labels into English: OLTC head, diverter switch, tap selector, protective relay, bevel gearbox, driving shaft and product model."
        role="img"
        viewBox="0 0 560 300"
      >
        <g className="tuyi-lines">
          {/* head, protective relay */}
          <rect height="18" rx="3" width="140" x="152" y="43" />
          <rect height="14" rx="2" width="22" x="258" y="29" />
          {/* diverter switch oil compartment */}
          <rect height="110" width="100" x="172" y="61" />
          <line x1="172" x2="272" y1="92" y2="92" />
          {/* tap selector cage */}
          <rect height="96" width="120" x="162" y="171" />
          {[186, 210, 234, 258].map((x) => (
            <line key={x} x1={x} x2={x} y1="171" y2="267" />
          ))}
          {[190, 214, 238, 262].map((y) =>
            [186, 210, 234, 258].map((x) => (
              <circle
                className="tuyi-dot"
                cx={x}
                cy={y}
                key={`${x}${y}`}
                r="3"
              />
            )),
          )}
          {/* drive shaft and bevel gearbox */}
          <line x1="292" x2="412" y1="52" y2="52" />
          <rect height="24" rx="2" width="24" x="412" y="40" />
          <line x1="424" x2="424" y1="64" y2="150" />
          {/* title block */}
          <rect
            className="tuyi-frame"
            height="72"
            width="244"
            x="300"
            y="216"
          />
          <line className="tuyi-frame" x1="300" x2="544" y1="252" y2="252" />
        </g>
        {LABELS.map((label, index) => {
          const english = index < run.label || done;
          const live = index === run.label;
          const text = english
            ? label.en
            : live
              ? scrambled(label.en, run.chars)
              : label.zh;
          return (
            <g
              className={['tuyi-label', english && 'en', live && 'live']
                .filter(Boolean)
                .join(' ')}
              key={label.zh}
            >
              {label.px >= 0 && (
                <>
                  <polyline
                    points={`${label.px},${label.py} ${
                      label.anchor === 'end' ? label.tx + 8 : label.tx - 8
                    },${label.ty - 5}`}
                  />
                  <circle cx={label.px} cy={label.py} r="2.4" />
                </>
              )}
              <text textAnchor={label.anchor} x={label.tx} y={label.ty}>
                {text}
              </text>
            </g>
          );
        })}
        <text className="tuyi-model" x="316" y="276">
          CMIII-500Y/72.5B-10193W
        </text>
      </svg>
    </div>
  );
}
