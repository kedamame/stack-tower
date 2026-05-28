// Screenshot 1: Start screen (1284x2778)
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function GET() {
  const blockWidths = [600, 500, 410, 320, 240, 160, 80];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#000000',
          paddingTop: 100,
          paddingBottom: 120,
          paddingLeft: 100,
          paddingRight: 100,
          justifyContent: 'space-between',
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.38)',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 12,
            fontFamily: 'monospace',
          }}
        >
          MINI GAME
        </div>

        {/* Block tower – centered via flex alignItems center */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 60,
          }}
        >
          {blockWidths.map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: w,
                height: 80,
                background: i % 2 === 0 ? '#FFFFFF' : '#CCCCCC',
                marginBottom: 5,
              }}
            />
          ))}
        </div>

        {/* Hero text + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 280,
              fontWeight: 900,
              lineHeight: 0.85,
              fontFamily: 'serif',
              letterSpacing: -8,
            }}
          >
            STACK
          </div>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 280,
              fontWeight: 900,
              lineHeight: 0.85,
              fontFamily: 'serif',
              letterSpacing: -8,
            }}
          >
            TOWER
          </div>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.42)',
              fontSize: 40,
              fontFamily: 'monospace',
              marginTop: 48,
              marginBottom: 64,
            }}
          >
            Tap to drop. Stack as high as you can.
          </div>
          {/* Pill button */}
          <div
            style={{
              display: 'flex',
              paddingTop: 28,
              paddingBottom: 28,
              paddingLeft: 72,
              paddingRight: 72,
              border: '3px solid #FFFFFF',
              borderRadius: 9999,
              alignItems: 'center',
              justifyContent: 'center',
              width: 420,
            }}
          >
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: 36,
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              Start Playing
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
