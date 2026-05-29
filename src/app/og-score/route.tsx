import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// W=1200 H=630  pad T/B=72 L/R=80  → content 1040×486
const PL = 80;
const PT = 72;
const W = 1200;
const H = 630;
const TOWER_W = 340; // reserved for right tower column
const LEFT_W = W - PL * 2 - TOWER_W - 48; // 48 = gap  → 612

function scoreFontSize(score: number): number {
  const d = String(score).length;
  if (d <= 1) return 300;
  if (d <= 2) return 230;
  if (d <= 3) return 185;
  return 150;
}

export async function GET(req: NextRequest) {
  const score = parseInt(req.nextUrl.searchParams.get('score') ?? '0', 10);
  const fs = scoreFontSize(score);

  const BLOCKS: { w: number; h: number }[] = [
    { w: 80,  h: 40 },
    { w: 120, h: 40 },
    { w: 160, h: 40 },
    { w: 200, h: 40 },
    { w: 245, h: 40 },
    { w: 290, h: 40 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          background: '#000000',
          paddingTop: PT,
          paddingBottom: PT,
          paddingLeft: PL,
          paddingRight: PL,
          alignItems: 'stretch',
        }}
      >
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: LEFT_W,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* App name */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 14,
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
                fontSize: 16,
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
                letterSpacing: -4,
                whiteSpace: 'nowrap',
              }}
            >
              {String(score)}
            </div>
            <div
              style={{
                display: 'flex',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 8,
                fontFamily: 'monospace',
                marginTop: 14,
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
              fontSize: 20,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            Can you beat me?
          </div>
        </div>

        {/* ── Gap ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', width: 48, flexShrink: 0 }} />

        {/* ── Right column: tower ──────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: TOWER_W,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex' }}>
            {/* top block */}
            <div style={{ display: 'flex', width: BLOCKS[0].w, height: BLOCKS[0].h, background: '#FFFFFF', marginBottom: 3 }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: BLOCKS[1].w, height: BLOCKS[1].h, background: '#CCCCCC', marginBottom: 3 }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: BLOCKS[2].w, height: BLOCKS[2].h, background: '#FFFFFF', marginBottom: 3 }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: BLOCKS[3].w, height: BLOCKS[3].h, background: '#CCCCCC', marginBottom: 3 }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: BLOCKS[4].w, height: BLOCKS[4].h, background: '#FFFFFF', marginBottom: 3 }} />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: BLOCKS[5].w, height: BLOCKS[5].h, background: '#CCCCCC' }} />
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
