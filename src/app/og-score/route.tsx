// Farcaster embed image — 900x600 (3:2), matches in-game game-over aesthetic
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 15;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// Module-level cache (per Node.js process)
let font400: ArrayBuffer | null = null;
let font900: ArrayBuffer | null = null;

async function loadFont(weight: 400 | 900): Promise<ArrayBuffer | null> {
  if (weight === 400 && font400) return font400;
  if (weight === 900 && font900) return font900;
  try {
    const data = await fetch(`${APP_URL}/fonts/inter-${weight}.woff2`).then(r => r.arrayBuffer());
    if (weight === 400) font400 = data;
    else font900 = data;
    return data;
  } catch {
    return null;
  }
}

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

  const [f400, f900] = await Promise.all([loadFont(400), loadFont(900)]);

  const fonts = [
    ...(f400 ? [{ name: 'Inter', data: f400, weight: 400 as const, style: 'normal' as const }] : []),
    ...(f900 ? [{ name: 'Inter', data: f900, weight: 900 as const, style: 'normal' as const }] : []),
  ];

  const font = 'Inter, sans-serif';

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
        {/* ── Left: score info ─────────────────────────────────────── */}
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
          {/* "FINAL SCORE" label */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.38)',
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: 3,
              fontFamily: font,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Final Score
          </div>

          {/* Score number + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: '#FFFFFF',
                fontSize: fs,
                fontWeight: 900,
                lineHeight: 0.88,
                fontFamily: font,
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
                fontWeight: 400,
                fontFamily: font,
                marginTop: 14,
                whiteSpace: 'nowrap',
              }}
            >
              blocks stacked
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 18,
              fontWeight: 400,
              fontFamily: font,
              whiteSpace: 'nowrap',
            }}
          >
            Can you beat me?
          </div>
        </div>

        {/* ── Flexible gap ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* ── Right: app label + tower ──────────────────────────────── */}
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
          <div
            style={{
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: 6,
              fontFamily: font,
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
        </div>
      </div>
    ),
    { width: 900, height: 600, fonts },
  );
}
