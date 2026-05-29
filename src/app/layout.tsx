import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';

const miniAppEmbed = {
  version: '1',
  imageUrl: `${APP_URL}/opengraph-image`,
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
};

export const metadata: Metadata = {
  title: 'Stack Tower',
  description: 'Tap to stack blocks as high as you can. Share your score on Farcaster.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'Stack Tower',
    description: 'How high can you stack?',
    type: 'website',
    images: ['/og-image.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
    'base:app_id': '6a180c5fa104516d71898a64',
    'talentapp:project_verification': '1d24df17e37ad13b8928b4b914dc9502e6b2db11c4363cae711ccbd9b9c460ed43f1ebe5cb9904fbef5a9d9b7ecb037b0ed3b9c3496ac7e4fe2ea2d78e60f228',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
