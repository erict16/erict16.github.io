import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

interface Part {
  label?: string;
  means?: string;
  text: string;
}

interface DutyPreset {
  basis: string;
  code: string;
  id: string;
  parts: Part[];
}

const TAPS: Part = {
  label: 'positions',
  means: '19 positions, so it can raise or lower the voltage',
  text: '10193W',
};

// Three real answers from the OLTC Selector, each part explained in plain words.
const PRESETS: DutyPreset[] = [
  {
    basis: '25 MVA transformer · 110 kV',
    code: 'CV2III-350Y/72.5-10193W',
    id: 'power',
    parts: [
      {
        label: 'type',
        means: 'A vacuum tap changer that sits inside the tank',
        text: 'CV2',
      },
      {
        label: 'phases',
        means: 'One unit switches all three phases',
        text: 'III',
      },
      { text: '-' },
      { label: 'amps', means: 'Carries up to 350 amps', text: '350' },
      {
        label: 'wiring',
        means: 'Fitted at the star point, the neutral end',
        text: 'Y',
      },
      { text: '/' },
      {
        label: 'insulation',
        means: 'Insulated for 72.5 kV to earth',
        text: '72.5',
      },
      { text: '-' },
      TAPS,
    ],
  },
  {
    basis: '125 MVA autotransformer · 225 kV',
    code: '3xCM2I-500/252D-10193W',
    id: 'auto',
    parts: [
      {
        label: 'type',
        means: 'Three single-phase vacuum tap changers, one per phase',
        text: '3xCM2',
      },
      { label: 'phases', means: 'Each unit switches one phase', text: 'I' },
      { text: '-' },
      { label: 'amps', means: 'Carries up to 500 amps', text: '500' },
      { text: '/' },
      {
        label: 'insulation',
        means: 'Insulated for 252 kV to earth',
        text: '252',
      },
      { label: 'wiring', means: 'Fitted at the line end', text: 'D' },
      { text: '-' },
      TAPS,
    ],
  },
  {
    basis: '16 MVA transformer · 22 kV',
    code: 'CV2III-600D/40.5-10193W',
    id: 'line',
    parts: [
      {
        label: 'type',
        means: 'A vacuum tap changer that sits inside the tank',
        text: 'CV2',
      },
      {
        label: 'phases',
        means: 'One unit switches all three phases',
        text: 'III',
      },
      { text: '-' },
      { label: 'amps', means: 'Carries up to 600 amps', text: '600' },
      { label: 'wiring', means: 'Fitted at the line end', text: 'D' },
      { text: '/' },
      {
        label: 'insulation',
        means: 'Insulated for 40.5 kV to earth',
        text: '40.5',
      },
      { text: '-' },
      TAPS,
    ],
  },
];

// The type string the selector gives, read one part at a time.
export default function TypeCode() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [presetIndex, setPresetIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [pinnedPart, setPinnedPart] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const preset = PRESETS[presetIndex];
  const namedIndices = preset.parts.flatMap((part, index) =>
    part.means ? [index] : [],
  );

  useEffect(() => {
    if (!inView || prefersReducedMotion() || paused) return;
    const timer = setInterval(() => {
      setTurn((value) => {
        const next = value + 1;
        if (next % namedIndices.length === 0) {
          setPresetIndex((current) => (current + 1) % PRESETS.length);
          return 0;
        }
        return next;
      });
    }, 1700);
    return () => clearInterval(timer);
  }, [inView, namedIndices.length, paused]);

  const active =
    pinnedPart !== null && preset.parts[pinnedPart]?.means
      ? pinnedPart
      : namedIndices[turn % namedIndices.length];

  return (
    <div
      className="oltc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPinnedPart(null);
        setPaused(false);
      }}
      ref={ref}
    >
      <p className="oltc-basis" key={preset.id}>
        <span className="oltc-dot" />
        {preset.basis}
      </p>

      <div aria-label={preset.code} className="oltc-plate" role="group">
        {preset.parts.map((part, index) => {
          if (!part.means) {
            return (
              <span aria-hidden="true" className="oltc-sep" key={index}>
                {part.text}
              </span>
            );
          }
          return (
            <button
              className={index === active ? 'oltc-seg on' : 'oltc-seg'}
              key={`${preset.id}-${index}`}
              onClick={() => setPinnedPart(index)}
              onFocus={() => setPinnedPart(index)}
              onMouseEnter={() => setPinnedPart(index)}
              type="button"
            >
              <span className="oltc-code">{part.text}</span>
              <span aria-hidden="true" className="oltc-bracket" />
              <span className="oltc-tag">{part.label}</span>
            </button>
          );
        })}
      </div>

      <p className="oltc-means" key={`${preset.id}-${active}`}>
        {preset.parts[active]?.means}
      </p>
    </div>
  );
}
