'use client';

// import type { Metadata } from 'next';
import React, { useMemo } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import {
  DecryptPermission,
  WalletAdapterNetwork
} from '@demox-labs/aleo-wallet-adapter-base';
import { Toaster } from 'react-hot-toast';
import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter
} from 'aleo-adapters';
 const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Leofolio - Privacy-preserving Freelancer Platform',
//   description:
//     'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.'
// };

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Leofolio - Privacy-preserving Freelancer Platform'
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          [WalletAdapterNetwork.TestnetBeta]: ['token_registry.aleo']
        },
        appName: 'Aleo app',
        appDescription: 'A privacy-focused DeFi app',
        appIconUrl: ''
      }),
      new FoxWalletAdapter({
        appName: 'Leofolio - Privacy-preserving Freelancer Platform'
      }),
      new SoterWalletAdapter({
        appName: 'Leofolio - Privacy-preserving Freelancer Platform'
      })
    ],
    []
  );
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
        <ThemeProvider>
          <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.MainnetBeta}
            autoConnect
          >
            <WalletModalProvider>
              <Toaster position="top-center" reverseOrder={true} />

              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
