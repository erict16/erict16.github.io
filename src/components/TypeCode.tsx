import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { useEffect, useRef, useState } from 'react';

interface Metric {
  label: string;
  pct: number;
  value: string;
}

interface Part {
  label?: string;
  means?: string;
  text: string;
}

interface DutyPreset {
  basis: string;
  code: string;
  id: string;
  metrics: Metric[];
  parts: Part[];
}

// Three real duties from the OLTC Selector catalogue, with exact type codes,
// segment meanings, and rating utilisation bars.
const PRESETS: DutyPreset[] = [
  {
    basis: '25 MVA · 110 kV · star neutral · ±8×1.25%',
    code: 'CV2III-350Y/72.5-10193W',
    id: 'power',
    metrics: [
      { label: 'Through-current', pct: 42, value: '145.8 / 350 A' },
      { label: 'Step voltage', pct: 40, value: '793.9 / 2000 V' },
      { label: 'Step capacity', pct: 17, value: '115.7 / 700 kVA' },
    ],
    parts: [
      { label: 'family', means: 'CV2 — Vacuum compound, in-tank', text: 'CV2' },
      { label: 'phases', means: 'III — Three-phase unit', text: 'III' },
      { text: '-' },
      { label: 'A', means: '350 A — Rated through-current', text: '350' },
      { label: 'star', means: 'Y — Star-point neutral end', text: 'Y' },
      { text: '/' },
      { label: 'Um kV', means: '72.5 kV — Insulation to earth', text: '72.5' },
      { text: '-' },
      {
        label: '19 pos',
        means: '10193W — 19 positions, reversing',
        text: '10193W',
      },
    ],
  },
  {
    basis: '125 MVA · 225/115 kV · autotransformer · YNa0d11',
    code: '3xCM2I-500/252D-10193W',
    id: 'auto',
    metrics: [
      { label: 'Through-current', pct: 71, value: '356.4 / 500 A' },
      { label: 'Step voltage', pct: 54, value: '1624 / 3000 V' },
      { label: 'Step capacity', pct: 48, value: '578.8 / 1200 kVA' },
    ],
    parts: [
      {
        label: '3× unit',
        means: '3xCM2 — Three single-phase combined vacuum units',
        text: '3xCM2',
      },
      { label: 'phase', means: 'I — Single-phase pole', text: 'I' },
      { text: '-' },
      { label: 'A', means: '500 A — Rated through-current', text: '500' },
      { text: '/' },
      { label: 'Um kV', means: '252 kV — Line-end insulation', text: '252' },
      { label: 'line', means: 'D — Line-end / series winding', text: 'D' },
      { text: '-' },
      {
        label: '19 pos',
        means: '10193W — 19 positions, reversing',
        text: '10193W',
      },
    ],
  },
  {
    basis: '16 MVA · 22 kV · line end · star winding',
    code: 'CV2III-600D/40.5-10193W',
    id: 'line',
    metrics: [
      { label: 'Through-current', pct: 78, value: '466.5 / 600 A' },
      { label: 'Step voltage', pct: 14, value: '275.0 / 2000 V' },
      { label: 'Step capacity', pct: 18, value: '128.3 / 700 kVA' },
    ],
    parts: [
      { label: 'family', means: 'CV2 — Vacuum compound, in-tank', text: 'CV2' },
      { label: 'phases', means: 'III — Three-phase unit', text: 'III' },
      { text: '-' },
      { label: 'A', means: '600 A — Rated through-current', text: '600' },
      { label: 'delta', means: 'D — Line-end connection', text: 'D' },
      { text: '/' },
      { label: 'Um kV', means: '40.5 kV — Insulation to earth', text: '40.5' },
      { text: '-' },
      {
        label: '19 pos',
        means: '10193W — 19 positions, reversing',
        text: '10193W',
      },
    ],
  },
];

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
        if (next > 0 && next % namedIndices.length === 0) {
          setPresetIndex((current) => (current + 1) % PRESETS.length);
          return 0;
        }
        return next;
      });
    }, 1500);
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
      <div className="oltc-head">
        <p className="oltc-basis" key={preset.id}>
          <span className="oltc-dot" />
          {preset.basis}
        </p>
        <span className="oltc-cli">npx oltc-selector</span>
      </div>

      <div aria-label={preset.code} className="oltc-plate" role="group">
        {preset.parts.map((part, index) => {
          const isNamed = Boolean(part.means);
          const isOn = index === active;
          if (!isNamed) {
            return (
              <span aria-hidden="true" className="oltc-sep" key={index}>
                {part.text}
              </span>
            );
          }
          return (
            <button
              className={isOn ? 'oltc-seg on' : 'oltc-seg'}
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

      <div className="oltc-meters">
        {preset.metrics.map((metric) => (
          <div className="oltc-meter" key={metric.label}>
            <div className="oltc-meter-head">
              <span>{metric.label}</span>
              <b>{metric.value}</b>
            </div>
            <div className="oltc-bar">
              <i style={{ width: `${metric.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
