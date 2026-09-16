import Footer from '../ui/Footer';
import './globals.css';
import Providers from './providers';
import { cn } from '@/lib/className';
import { SITE_URL } from '@/lib/site';
import AnimateEnter from '@/ui/AnimateEnter';
import RollingMenu from '@/ui/RollingMenu';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  authors: [{ name: 'Eric Tan', url: SITE_URL }],
  creator: 'Eric Tan',
  description: 'Eric Tan. Overseas sales in Shanghai. Small tools on the side.',
  icons: {
    apple: `${SITE_URL}/static/favicons/apple-touch-icon.png`,
    icon: `${SITE_URL}/static/favicons/favicon-32x32.png`,
    shortcut: `${SITE_URL}/favicon.ico`,
  },
  keywords: ['Eric Tan', 'Huaming', 'Shanghai', 'OLTC'],
  manifest: `${SITE_URL}/static/favicons/site.webmanifest`,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: 'Eric Tan. Overseas sales in Shanghai.',
    images: [
      {
        alt: 'Eric Tan',
        height: 1080,
        url: `${SITE_URL}/static/images/og.png`,
        width: 1920,
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
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: '#171717', media: '(prefers-color-scheme: dark)' },
  ],
  title: {
    default: 'Eric Tan - Software Engineer',
    template: '%s | Eric Tan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${inter.className}`,
          'relative min-h-screen w-full',
          'bg-white py-6 dark:bg-gray-900 sm:py-10',
          'motion-reduce:transform-none motion-reduce:transition-none',
        )}
      >
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 dark:focus:bg-gray-900"
          href="#main-content"
        >
          Skip to main content
        </a>
        {/* Tailwind safelist for RollingMenu colors. Do not delete.
        <div className="absolute z-10 flex flex-col items-center bg-gray-200 dark:bg-gray-800 w-fit space-y-2 rounded-t-2xl rounded-xl p-1.5"></div>
        <div className="p-2  sticky left-5 bottom-5 w-12 h-14 flex text-xs text-white flex-col bg-[#7786FE] bg-[#9CB7FF] hover:bg-opacity-80 transition-all duration-200 items-center space-y-1 cursor-pointer transition-all duration-200 rounded-t-xl rounded-b-lg rounded-lg" />
        <div className="bg-[#ADC9FA] p-2 w-12 h-14 flex flex-col items-center justify-center cursor-crosshair rounded-b-xl rounded-t-lg" />
        <div className="bg-[#CC697D] bg-[#E19DC2]" />
        <div className="bg-[#BC7BFD] bg-[#D5ACFF] font-semibold" />
        <div className="sticky    py-2 z-[1] bottom-2 top-2 md:top-4  mx-auto flex rounded-full justify-center items-center " />
        <div className="px-2 mt-24 pb-24 pt-4"></div>
        <article className="prose prose-quoteless prose-neutral dark:prose-invert"></article>
        <div className="pl-2 select-none pt-4 underline underline-offset-[3px] hover:no-underline hover:bg-[url('/static/squiggle.svg')]"></div>
        <div className="flip-card-inner bg-[#1DB954] text-lg opacity-70 bg-[#C4150C] w-1/2 bg-[#214D72] w-1/2 bg-[#171515] bg-indigo-400 bg-orange-500 cursor-pointer  rotate-y-180 select-none flip-card bg-[#00acee] rotate-180 h-full font-semibold flip-card  rounded-lg flex items-center rounded-lg h-96 bg-green-500 flex flex-col gap-0 p-6 items-center justify-center p-6 flip-card-back justify-center gap-2 flip-card-front  text-2xl text-gray-100 text-center"></div>
        <div className="bg-blue-500 p-4"></div>
        <div className="mx-0.5 h-8 w-8 items-center rounded-full bg-black p-3 text-white dark:bg-white dark:text-black"></div>
        <div className=" ml-0.5 w-3 bg-[#228B22]  bg-[#EC605A] bg-[#EC605A] bg-[#5D0F07] bg-[#F7D358] bg-[#673D13] bg-[#61C167] bg-[#0D2805] bg-[#63C7FA] bg-[#63C7FA] bg-[#102E62] bg-[#EC79F9] bg-[#EC79F9] bg-[#5C0E63] bg-[#9f3e1b] bg-[#FF7F50] text-[#9f3e1b] text-[#5D0F07] text-[#673D13] text-[#102E62] text-[#5C0E63] text-[#0D2805]"></div>
        */}
        <Providers>
          <nav className="fixed bottom-4 left-2 z-50 sm:left-4 md:left-6">
            <RollingMenu />
          </nav>
          <AnimateEnter>
            <>
              {children}
              <Footer />
            </>
          </AnimateEnter>
        </Providers>
      </body>
    </html>
  );
}
