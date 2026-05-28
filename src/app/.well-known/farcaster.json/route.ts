import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      // Set these env vars after running the domain association tool at:
      // https://warpcast.com/~/developers/mini-apps
      header: process.env.FARCASTER_HEADER ?? '',
      payload: process.env.FARCASTER_PAYLOAD ?? '',
      signature: process.env.FARCASTER_SIGNATURE ?? '',
    },
    miniapp: {
      version: '1',
      name: 'Stack Tower',
      subtitle: 'Tap. Stack. How high can you go?',
      description:
        'A one-tap block stacking game. Drop each block perfectly to keep your tower growing. Share your high score on Farcaster.',
      homeUrl: APP_URL,
      iconUrl: `${APP_URL}/icon.png`,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#000000',
      heroImageUrl: `${APP_URL}/og-image.png`,
      ogTitle: 'Stack Tower',
      ogDescription: 'How high can you stack?',
      ogImageUrl: `${APP_URL}/og-image.png`,
      screenshotUrls: [
        `${APP_URL}/screenshot1.png`,
        `${APP_URL}/screenshot2.png`,
        `${APP_URL}/screenshot3.png`,
      ],
      primaryCategory: 'games',
      tags: ['game', 'stack', 'arcade', 'farcaster'],
      tagline: 'Tap to stack. How high can you go?',
      noindex: false,
      requiredChains: [],
      requiredCapabilities: [],
    },
  });
}
