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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Mini block stack */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            {[80, 64, 48].map((w, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  width: w,
                  height: 16,
                  background: i % 2 === 0 ? '#FFFFFF' : '#AAAAAA',
                  marginBottom: 2,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              color: '#fff',
              fontSize: 28,
              fontWeight: 900,
              fontFamily: 'serif',
              letterSpacing: 2,
            }}
          >
            STACK TOWER
          </div>
        </div>
      </div>
    ),
    { width: 200, height: 200 },
  );
}
