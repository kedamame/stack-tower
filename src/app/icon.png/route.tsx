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
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#000000',
          padding: 80,
        }}
      >
        {/* Stacked blocks illustration */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 140, left: '50%', transform: 'translateX(-50%)' }}>
          {[280, 240, 200, 160, 120].map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: w,
                height: 60,
                background: i % 2 === 0 ? '#FFFFFF' : '#CCCCCC',
                marginBottom: 6,
              }}
            />
          ))}
        </div>
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: '#fff',
              fontSize: 140,
              fontWeight: 900,
              lineHeight: 0.88,
              fontFamily: 'serif',
              letterSpacing: -4,
            }}
          >
            ST
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 },
  );
}
