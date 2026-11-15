import type { CSSProperties } from 'react';
import { handwrittenName, handwrittenNameWidth } from '@/lib/handwrittenName';
import { handwritingScript } from '@/lib/handwritingScript';

/** 元の字形を、各文字の中心線に沿う筆順で表示する。 */
export default function HandwrittenName() {
  let step = 0;
  return (
    <span className="handwritten-name" suppressHydrationWarning>
      <span className="u-visually-hidden">TOMOCAN</span>
      <svg viewBox={`0 0 ${handwrittenNameWidth} 800`} aria-hidden="true" focusable="false">
        {handwrittenName.map((glyph, index) => (
          <g key={index} transform={`translate(${glyph.x},700) scale(1,-1)`}>
            <defs>
              <mask id={`tomocan-pen-${index}`} maskUnits="userSpaceOnUse" x="-100" y="-150" width="900" height="1000">
                {glyph.strokes.map((d, stroke) => (
                  <path key={stroke} d={d} className="handwritten-name__pen" pathLength="1" fill="none" stroke="white" strokeWidth="200" strokeLinecap="round" strokeLinejoin="round" style={{ '--pen-delay': `${step++ * 0.22}s` } as CSSProperties} />
                ))}
              </mask>
            </defs>
            <path d={glyph.outline} fill="currentColor" mask={`url(#tomocan-pen-${index})`} />
          </g>
        ))}
      </svg>
      <script dangerouslySetInnerHTML={{ __html: handwritingScript }} />
    </span>
  );
}
