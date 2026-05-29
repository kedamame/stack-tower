// Farcaster embed image (3:2 = 900x600) — same ratio as /opengraph-image
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function scoreFontSize(score: number): number {
  const d = String(score).length;
  if (d <= 1) return 240;
  if (d <= 2) return 190;
  if (d <= 3) return 150;
  return 120;
}

export async function GET(req: NextRequest) {
  const score = parseInt(req.nextUrl.searchParams.get('score') ?? '0', 10);
  const fs = scoreFontSize(score);

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
          paddingRight: 64,
          alignItems: 'stretch',
        }}
      >
        {/* ── Left column: score ──────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 460,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* App name */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 8,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            STACK TOWER
          </div>

          {/* Score block */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 8,
                fontFamily: 'monospace',
                marginBottom: 6,
                whiteSpace: 'nowrap',
              }}
            >
              SCORE
            </div>
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: fs,
                fontWeight: 900,
                lineHeight: 1,
                fontFamily: 'serif',
                letterSpacing: -3,
                whiteSpace: 'nowrap',
              }}
            >
              {String(score)}
            </div>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 8,
                fontFamily: 'monospace',
                marginTop: 12,
                whiteSpace: 'nowrap',
              }}
            >
              BLOCKS STACKED
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 18,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            Can you beat me?
          </div>
        </div>

        {/* ── Gap ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* ── Right column: tower ──────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: 248,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', width: 50,  height: 34, background: '#FFFFFF', marginBottom: 3 }} />
          <div style={{ display: 'flex', width: 82,  height: 34, background: '#CCCCCC', marginBottom: 3 }} />
          <div style={{ display: 'flex', width: 114, height: 34, background: '#FFFFFF', marginBottom: 3 }} />
          <div style={{ display: 'flex', width: 148, height: 34, background: '#CCCCCC', marginBottom: 3 }} />
          <div style={{ display: 'flex', width: 182, height: 34, background: '#FFFFFF', marginBottom: 3 }} />
          <div style={{ display: 'flex', width: 220, height: 34, background: '#CCCCCC' }} />
        </div>
      </div>
    ),
    { width: 900, height: 600 },
  );
}
