// import type { Metadata } from 'next'
// import './globals.css'
// import { ThemeProvider } from '@/components/theme-provider';

// export const metadata: Metadata = {
//   title: 'Leofolio',
//   description: 'Created with leofolio',
//   generator: 'leofolio.dev',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }
import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Leofolio - Privacy-preserving Freelancer Platform',
  description:
    'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to prevent flickering when loading in dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              document.documentElement.classList.add('dark');
            })();
          `
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
