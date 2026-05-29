import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const score = parseInt(req.nextUrl.searchParams.get('score') ?? '0', 10);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000000',
          paddingTop: 72,
          paddingBottom: 72,
          paddingLeft: 80,
          paddingRight: 80,
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        {/* Left: branding + score + tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          {/* Top: app name */}
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
            STACK TOWER
          </div>

          {/* Center: score */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.38)',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 8,
                fontFamily: 'monospace',
                marginBottom: 8,
              }}
            >
              SCORE
            </div>
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: score >= 100 ? 160 : 200,
                fontWeight: 900,
                lineHeight: 0.85,
                fontFamily: 'serif',
                letterSpacing: -8,
              }}
            >
              {String(score)}
            </div>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.38)',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 8,
                fontFamily: 'monospace',
                marginTop: 16,
              }}
            >
              BLOCKS STACKED
            </div>
          </div>

          {/* Bottom: tagline */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 22,
              fontFamily: 'monospace',
            }}
          >
            Can you beat me?
          </div>
        </div>

        {/* Right: tower illustration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingLeft: 60,
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
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
