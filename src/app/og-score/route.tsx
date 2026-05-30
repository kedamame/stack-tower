// Farcaster embed image — 900x600 (3:2)
// Layout mirrors the in-game result screen proportions
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Scale game CSS (clamp 96-160px at ~390px viewport) → 900px OG canvas
// Game ratio: ~155px score in ~390px width = 40%
// OG: 40% of 756px content = ~302px → round per digit count
function scoreFontSize(score: number): number {
  const d = String(score).length;
  if (d <= 1) return 380;
  if (d <= 2) return 300;
  if (d <= 3) return 228;
  return 176;
}

export async function GET(req: NextRequest) {
  const score = parseInt(req.nextUrl.searchParams.get('score') ?? '0', 10);
  const fz = scoreFontSize(score);
  // letterSpacing: -0.03em scaled to fz
  const ls = Math.round(fz * -0.03);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000000',
          paddingTop: 56,
          paddingBottom: 56,
          paddingLeft: 64,
          paddingRight: 48,
          alignItems: 'stretch',
        }}
      >
        {/* ── Left: mirrors game result overlay ───────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 524,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* "FINAL SCORE" — matches game label style */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Final Score
          </div>

          {/* Score + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: fz,
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: ls,
                whiteSpace: 'nowrap',
              }}
            >
              {String(score)}
            </div>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.38)',
                fontSize: 18,
                fontWeight: 400,
                marginTop: 18,
                whiteSpace: 'nowrap',
              }}
            >
              blocks stacked
            </div>
          </div>

          {/* Spacer — game result has no bottom text in the left panel */}
          <div style={{ display: 'flex' }} />
        </div>

        {/* ── Gap ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* ── Right: app identity + tower ──────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: 216,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: 5,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Stack Tower
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', width: 42,  height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 70,  height: 30, background: '#D0D0D0', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 100, height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 128, height: 30, background: '#D0D0D0', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 158, height: 30, background: '#FFFFFF', marginBottom: 3 }} />
            <div style={{ display: 'flex', width: 188, height: 30, background: '#D0D0D0' }} />
          </div>

          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.40)',
              fontSize: 16,
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            Can you beat me?
          </div>
        </div>
      </div>
    ),
    { width: 900, height: 600 },
  );
}
