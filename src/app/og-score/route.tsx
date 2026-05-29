// Farcaster embed image — 900x600 (3:2), matches in-game game-over aesthetic
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function scoreFontSize(score: number): number {
  const d = String(score).length;
  if (d <= 1) return 280;
  if (d <= 2) return 230;
  if (d <= 3) return 185;
  return 148;
}

export async function GET(req: NextRequest) {
  const score = parseInt(req.nextUrl.searchParams.get('score') ?? '0', 10);
  const fs = scoreFontSize(score);

  const label: Record<string, string | number> = {
    display: 'flex',
    color: 'rgba(255,255,255,0.38)',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 3,
    fontFamily: 'sans-serif',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000000',
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 72,
          paddingRight: 72,
          alignItems: 'stretch',
        }}
      >
        {/* ── Left: score info (mirrors game-over overlay) ─────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 480,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* "Final Score" label — matches game label style */}
          <div style={label}>Final Score</div>

          {/* Score number + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: fs,
                fontWeight: 900,
                lineHeight: 0.88,
                fontFamily: 'sans-serif',
                letterSpacing: -4,
                whiteSpace: 'nowrap',
              }}
            >
              {String(score)}
            </div>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.38)',
                fontSize: 20,
                fontFamily: 'sans-serif',
                marginTop: 14,
                whiteSpace: 'nowrap',
              }}
            >
              blocks stacked
            </div>
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 18,
              fontFamily: 'sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Can you beat me?
          </div>
        </div>

        {/* ── Flexible gap ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* ── Right: app label + tower illustration ────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: 204,
            flexShrink: 0,
          }}
        >
          {/* App name */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 6,
              fontFamily: 'sans-serif',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Stack Tower
          </div>

          {/* Tower blocks (narrow at top → wide at bottom) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', width: 42,  height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 70,  height: 30, background: '#D0D0D0', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 100, height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 128, height: 30, background: '#D0D0D0', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 158, height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 188, height: 30, background: '#D0D0D0' }} />
          </div>
        </div>
      </div>
    ),
    { width: 900, height: 600 },
  );
}
