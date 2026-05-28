import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 4 thick blocks — fewer, bolder, reads clearly at small display sizes
const WIDTHS = [160, 128, 96, 64];
const BH = 30;
const GAP = 4;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          gap: GAP,
        }}
      >
        {/* "STACK" label above the tower */}
        <div
          style={{
            display: 'flex',
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 900,
            fontFamily: 'serif',
            letterSpacing: 6,
            marginBottom: 10,
          }}
        >
          STACK
        </div>

        {/* Narrow block at top → wide floor at bottom */}
        <div style={{ display: 'flex', width: WIDTHS[3], height: BH, background: '#FFFFFF' }} />
        <div style={{ display: 'flex', width: WIDTHS[2], height: BH, background: '#CCCCCC' }} />
        <div style={{ display: 'flex', width: WIDTHS[1], height: BH, background: '#FFFFFF' }} />
        <div style={{ display: 'flex', width: WIDTHS[0], height: BH, background: '#CCCCCC' }} />
      </div>
    ),
    { width: 200, height: 200 },
  );
}
