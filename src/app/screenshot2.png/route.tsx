// Screenshot 2: In-game view (1284x2778)
// Simulates a mid-game state at score=12 using pure flex layout (no position:absolute)
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Simulated placed blocks (widths only – display is centered via flex)
const BLOCK_WIDTHS = [600, 560, 510, 470, 470, 430, 390, 390, 355, 320, 320, 288, 260];
const BLOCK_H = 80;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          paddingTop: 80,
          paddingBottom: 0,
          paddingLeft: 100,
          paddingRight: 100,
        }}
      >
        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 12,
              fontFamily: 'monospace',
            }}
          >
            SCORE
          </div>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: 'serif',
            }}
          >
            12
          </div>
        </div>

        {/* Tower – fill remaining space, blocks centered at bottom */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* Moving block (highlighted, offset left to simulate mid-motion) */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', paddingLeft: 60, marginBottom: 5 }}>
            <div
              style={{
                display: 'flex',
                width: 230,
                height: BLOCK_H - 5,
                background: '#FFFFFF',
              }}
            />
          </div>
          {/* Placed blocks – rendered top to bottom (reversed so newest is on top) */}
          {[...BLOCK_WIDTHS].reverse().map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: w,
                height: BLOCK_H - 5,
                background: i % 2 === 0 ? '#CCCCCC' : '#FFFFFF',
                marginBottom: 5,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
