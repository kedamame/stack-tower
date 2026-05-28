import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BH = 20;
const GAP = 3;

// Widths from top (narrow) to bottom (wide)
const WIDTHS = [68, 88, 108, 130, 154];

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
          background: '#000000',
          paddingTop: 26,
        }}
      >
        {/* Moving block — semi-transparent, shifted right */}
        <div
          style={{
            display: 'flex',
            width: WIDTHS[0],
            height: BH,
            background: 'rgba(255,255,255,0.45)',
            marginLeft: 28,
            marginBottom: GAP,
          }}
        />

        {/* Placed blocks: narrow (top) → wide (floor) */}
        <div
          style={{
            display: 'flex',
            width: WIDTHS[0],
            height: BH,
            background: '#FFFFFF',
            marginBottom: GAP,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: WIDTHS[1],
            height: BH,
            background: '#CCCCCC',
            marginBottom: GAP,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: WIDTHS[2],
            height: BH,
            background: '#FFFFFF',
            marginBottom: GAP,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: WIDTHS[3],
            height: BH,
            background: '#CCCCCC',
            marginBottom: GAP,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: WIDTHS[4],
            height: BH,
            background: '#FFFFFF',
            marginBottom: 16,
          }}
        />

        {/* Label */}
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.42)',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: 3,
          }}
        >
          STACK TOWER
        </div>
      </div>
    ),
    { width: 200, height: 200 },
  );
}
