// Farcaster embed image (3:2 = 900x600)
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

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
          paddingTop: 56,
          paddingBottom: 56,
          paddingLeft: 64,
          paddingRight: 64,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Label */}
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.35)',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 8,
            fontFamily: 'monospace',
          }}
        >
          FARCASTER MINI GAME
        </div>

        {/* Tower illustration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            right: 64,
            bottom: 56,
          }}
        >
          {[45, 85, 125, 165, 200, 240].map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: w,
                height: 38,
                background: i % 2 === 0 ? '#FFFFFF' : '#BBBBBB',
                marginBottom: 3,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 112,
              fontWeight: 900,
              lineHeight: 0.85,
              fontFamily: 'serif',
              letterSpacing: -3,
            }}
          >
            STACK
          </div>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 112,
              fontWeight: 900,
              lineHeight: 0.85,
              fontFamily: 'serif',
              letterSpacing: -3,
            }}
          >
            TOWER
          </div>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 18,
              fontFamily: 'monospace',
              marginTop: 20,
            }}
          >
            Tap to drop. Stack as high as you can.
          </div>
        </div>
      </div>
    ),
    { width: 900, height: 600 },
  );
}
