import './globals.css';
import { SITE_URL } from '@/lib/site';
import Effects from '@/ui/Effects';
import Particles from '@/ui/Particles';
import { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';

const serif = Fraunces({
  axes: ['SOFT', 'opsz'],
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
});
const sans = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
});
const mono = JetBrains_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mono',
});

const DESCRIPTION =
  'Eric Tan, full-stack dev. I build small tools that do one job well. Maker of Ragdoll Mail, the mail app your AI agent can use.';

export const metadata: Metadata = {
  authors: [{ name: 'Eric Tan', url: SITE_URL }],
  creator: 'Eric Tan',
  description: DESCRIPTION,
  icons: {
    apple: `${SITE_URL}/static/favicons/apple-touch-icon.png`,
    icon: `${SITE_URL}/static/favicons/favicon-32x32.png`,
    shortcut: `${SITE_URL}/favicon.ico`,
  },
  keywords: ['Eric Tan', 'Ragdoll Mail', 'full-stack developer', 'OLTC'],
  manifest: `${SITE_URL}/static/favicons/site.webmanifest`,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: DESCRIPTION,
    images: [
      {
        alt: 'Eric Tan',
        height: 630,
        url: `${SITE_URL}/static/images/og.png`,
        width: 1200,
      },
    ],
    locale: 'en-US',
    siteName: 'Eric Tan',
    title: 'Eric Tan',
    type: 'website',
    url: SITE_URL,
  },
  publisher: 'Eric Tan',
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  themeColor: '#0f0d0b',
  title: {
    default: 'Eric Tan',
    template: '%s | Eric Tan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      lang="en"
    >
      <body>
        <a className="skip" href="#main-content">
          Skip to main content
        </a>
        <Particles />
        <Effects />
        {children}
      </body>
    </html>
  );
}
