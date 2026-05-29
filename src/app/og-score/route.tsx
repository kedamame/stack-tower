// Farcaster embed image — 900x600 (3:2), matches in-game game-over aesthetic
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Read fonts synchronously at module init — cached for process lifetime.
// public/fonts/ is included in this function's bundle via outputFileTracingIncludes.
const font400 = (() => {
  try { return readFileSync(join(process.cwd(), 'public/fonts/inter-400.woff2')); }
  catch { return null; }
})();
const font900 = (() => {
  try { return readFileSync(join(process.cwd(), 'public/fonts/inter-900.woff2')); }
  catch { return null; }
})();

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

  const fonts = [
    ...(font400 ? [{ name: 'Inter', data: font400.buffer as ArrayBuffer, weight: 400 as const, style: 'normal' as const }] : []),
    ...(font900 ? [{ name: 'Inter', data: font900.buffer as ArrayBuffer, weight: 900 as const, style: 'normal' as const }] : []),
  ];

  // Use named font only when loaded; fall back to generic sans-serif to avoid
  // Satori attempting a Google Fonts download which can fail in serverless.
  const font = fonts.length > 0 ? 'Inter, sans-serif' : 'sans-serif';

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
    fonts.length > 0
      ? { width: 900, height: 600, fonts }
      : { width: 900, height: 600 },
  );
}
