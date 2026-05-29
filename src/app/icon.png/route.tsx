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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        {/* Tower: narrow at top → wide at bottom (correct stacking) */}
        <div style={{ display: 'flex', width: 112, height: 68, background: '#FFFFFF', marginBottom: 8 }} />
        <div style={{ display: 'flex', width: 192, height: 68, background: '#CCCCCC', marginBottom: 8 }} />
        <div style={{ display: 'flex', width: 272, height: 68, background: '#FFFFFF', marginBottom: 8 }} />
        <div style={{ display: 'flex', width: 352, height: 68, background: '#CCCCCC', marginBottom: 8 }} />
        <div style={{ display: 'flex', width: 432, height: 68, background: '#FFFFFF', marginBottom: 8 }} />
        <div style={{ display: 'flex', width: 512, height: 68, background: '#CCCCCC' }} />
      </div>
    ),
    { width: 1024, height: 1024 },
  );
}
