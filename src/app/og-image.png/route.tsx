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
          paddingTop: 72,
          paddingBottom: 72,
          paddingLeft: 80,
          paddingRight: 80,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.38)',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 10,
            fontFamily: 'monospace',
          }}
        >
          MINI GAME
        </div>

        {/* Block tower illustration – center */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            right: 80,
            top: 72,
            bottom: 72,
          }}
        >
          {[90, 140, 185, 230, 270, 320].map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: w,
                height: 50,
                background: i % 2 === 0 ? '#FFFFFF' : '#CCCCCC',
                marginBottom: 4,
              }}
            />
          ))}
        </div>

        {/* Bottom: hero text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 148,
              fontWeight: 900,
              lineHeight: 0.86,
              fontFamily: 'serif',
              letterSpacing: -4,
            }}
          >
            STACK
          </div>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 148,
              fontWeight: 900,
              lineHeight: 0.86,
              fontFamily: 'serif',
              letterSpacing: -4,
            }}
          >
            TOWER
          </div>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 22,
              fontFamily: 'monospace',
              marginTop: 28,
            }}
          >
            Tap to drop. Stack as high as you can.
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
