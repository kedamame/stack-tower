// Screenshot 3: Game Over screen (1284x2778)
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
          GAME OVER
        </div>

        {/* Spacer */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* Final score + buttons */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 12,
              fontFamily: 'monospace',
              marginBottom: 16,
            }}
          >
            FINAL SCORE
          </div>
          <div
            style={{
              display: 'flex',
              color: '#FFFFFF',
              fontSize: 400,
              fontWeight: 900,
              lineHeight: 0.82,
              fontFamily: 'serif',
              letterSpacing: -12,
            }}
          >
            27
          </div>
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 40,
              fontFamily: 'monospace',
              marginTop: 24,
              marginBottom: 72,
            }}
          >
            blocks stacked
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 28 }}>
            <div
              style={{
                display: 'flex',
                paddingTop: 28,
                paddingBottom: 28,
                paddingLeft: 72,
                paddingRight: 72,
                borderRadius: 9999,
                background: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  color: '#000000',
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                Play Again
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                paddingTop: 28,
                paddingBottom: 28,
                paddingLeft: 72,
                paddingRight: 72,
                border: '3px solid rgba(255,255,255,0.45)',
                borderRadius: 9999,
                alignItems: 'center',
                justifyContent: 'center',
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
                Share Score
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
