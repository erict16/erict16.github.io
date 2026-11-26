import { prefersReducedMotion, useInView } from '@/lib/useInView';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

interface CadRow {
  layer: string;
  source: string;
  target: string;
}

interface DrawingJob {
  direction: string;
  ext: string;
  input: string;
  output: string;
  rows: CadRow[];
}

// Authentic Tuyi workbench runs: real CAD layers, entity types, and glossary translations.
const JOBS: DrawingJob[] = [
  {
    direction: 'ZH → EN',
    ext: 'DXF',
    input: 'floor_plan.dxf',
    output: 'en_floor_plan.dxf',
    rows: [
      { layer: 'TITLE · TEXT', source: '平面布置图', target: 'floor plan' },
      {
        layer: 'TITLE · TEXT',
        source: '天花图',
        target: 'reflected ceiling plan',
      },
      { layer: 'A-WALL · TEXT', source: '剪力墙', target: 'shear wall' },
      {
        layer: 'TITLE · MTEXT',
        source: '隔墙定位图',
        target: 'partition location plan',
      },
      {
        layer: '0 · ATTRIB',
        source: '配电箱',
        target: 'distribution board',
      },
      { layer: 'E-POWR · TEXT', source: '接地', target: 'grounding' },
    ],
  },
  {
    direction: 'EN → ES',
    ext: 'DWG',
    input: 'substation_04.dwg',
    output: 'es_substation_04.dwg',
    rows: [
      {
        layer: 'TITLE · TEXT',
        source: 'General arrangement',
        target: 'Disposición general',
      },
      {
        layer: 'E-HV · TEXT',
        source: 'HV bushing',
        target: 'Aislador AT',
      },
      {
        layer: 'E-OLTC · ATTRIB',
        source: 'Diverter switch',
        target: 'Ruptor de carga',
      },
      {
        layer: 'E-PROT · TEXT',
        source: 'Protective relay',
        target: 'Relé de protección',
      },
      {
        layer: 'M-DRIVE · TEXT',
        source: 'Bevel gearbox',
        target: 'Reenvío angular',
      },
      {
        layer: 'E-GND · TEXT',
        source: 'Earthing pad',
        target: 'Borne de tierra',
      },
    ],
  },
];

// Each tick advances one row; after all rows finish we hold on the "written" state.
const ROW_MS = 460;
const HOLD_TICKS = 7;

export default function TuyiDrawing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [jobIndex, setJobIndex] = useState(0);
  const [step, setStep] = useState(JOBS[0].rows.length + 1);

  const job = JOBS[jobIndex];
  const totalRows = job.rows.length;
  const maxStep = totalRows + HOLD_TICKS;

  useEffect(() => {
    if (!inView || prefersReducedMotion()) {
      setStep(totalRows + 1);
      return;
    }
    setStep(0);
    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= maxStep) {
          setJobIndex((index) => (index + 1) % JOBS.length);
          return 0;
        }
        return current + 1;
      });
    }, ROW_MS);
    return () => clearInterval(timer);
  }, [inView, maxStep, totalRows]);

  const doneCount = Math.min(totalRows, step);
  const allDone = step > totalRows;

  return (
    <div className="tuyi-app" ref={ref}>
      <div className="tuyi-bar">
        <div aria-hidden="true" className="tuyi-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="tuyi-filechip">
          <span className="tuyi-ext">{job.ext}</span>
          <b>{job.input}</b>
        </div>
        <span className="tuyi-dir">{job.direction}</span>
      </div>

      <div className={allDone ? 'tuyi-banner done' : 'tuyi-banner'}>
        <span aria-hidden="true" className="tuyi-banner-bar" />
        {allDone ? (
          <span>
            Written {totalRows} lines → <b>{job.output}</b>
          </span>
        ) : (
          <span>
            Translating {doneCount}/{totalRows} CAD text entities…
          </span>
        )}
      </div>

      <div className="tuyi-table" role="table">
        <div className="tuyi-thead" role="row">
          <span role="columnheader" />
          <span role="columnheader">Source</span>
          <span role="columnheader">Translation</span>
          <span className="tuyi-col-layer" role="columnheader">
            Layer
          </span>
        </div>

        <div className="tuyi-tbody">
          {job.rows.map((row, index) => {
            const translated = index < doneCount;
            const active = index === doneCount && !allDone;
            return (
              <div
                className={[
                  'tuyi-row',
                  translated && 'done',
                  active && 'active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={`${job.input}-${row.source}`}
                role="row"
              >
                <span aria-hidden="true" className="tuyi-check">
                  {translated && <CheckIcon />}
                </span>
                <span className="tuyi-src" role="cell">
                  {row.source}
                </span>
                <span className="tuyi-dst" role="cell">
                  {translated ? row.target : active ? '…' : ''}
                </span>
                <span className="tuyi-layer" role="cell">
                  {row.layer}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
