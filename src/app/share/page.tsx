import type { Metadata } from 'next';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { score?: string };
}): Promise<Metadata> {
  const score = parseInt(searchParams.score ?? '0', 10);
  const ogImage = `${APP_URL}/og-score?score=${score}`;
  const title = `I stacked ${score} blocks in Stack Tower!`;
  const description = `Can you beat my score of ${score}? Play Stack Tower on Farcaster.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      url: `${APP_URL}/share?score=${score}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    // Override root layout's fc:miniapp so Farcaster uses the score image
    other: {
      'fc:miniapp': JSON.stringify({
        version: '1',
        imageUrl: ogImage,
        button: {
          title: 'Play Stack Tower',
          action: {
            type: 'launch_miniapp',
            name: 'Stack Tower',
            url: APP_URL,
            splashImageUrl: `${APP_URL}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
      'base:app_id': '6a180c5fa104516d71898a64',
    },
  };
}

export default function SharePage({
  searchParams,
}: {
  searchParams: { score?: string };
}) {
  const score = parseInt(searchParams.score ?? '0', 10);

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter,"Helvetica Neue",Arial,sans-serif',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          color: 'rgba(255,255,255,0.38)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        Stack Tower
      </p>
      <h1
        style={{
          color: '#fff',
          fontSize: 'clamp(80px, 22vw, 140px)',
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: '-0.03em',
          margin: '0 0 8px',
        }}
      >
        {score}
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.38)',
          fontSize: 16,
          marginBottom: 48,
        }}
      >
        blocks stacked
      </p>
      <Link
        href="/"
        style={{
          padding: '14px 40px',
          border: '1.5px solid #fff',
          borderRadius: 9999,
          background: '#fff',
          color: '#000',
          fontSize: 15,
          fontWeight: 700,
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Play Stack Tower
      </Link>
    </main>
  );
}
