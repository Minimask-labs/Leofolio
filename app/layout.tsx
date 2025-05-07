"use client";
// import type { Metadata } from 'next';
import React, { useMemo } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
// import { Toaster } from 'react-hot-toast';
import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
} from "aleo-adapters";
import { Toaster } from "@/components/ui/toaster";
import "@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css";
import { PuzzleWalletProvider } from '@puzzlehq/sdk';

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'Leofolio - Privacy-preserving Freelancer Platform',
//   description:
//     'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.'
// };
// export const metadata: Metadata = {
//   title: 'Leofolio - Privacy-preserving Freelancer Platform',
//   description:
//     'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.',
//   metadataBase: new URL('https://leofolio.minimasklabs.xyz/'),
//   keywords: [
//     'zk',
//     'aleo',
//     'blockchain',
//     'freelancer',
//     'privacy',
//     'zero-knowledge',
//     'proofs'
//   ],
//   icons: {
//     // icon: '/fav.png',
//     // shortcut: '/fav.png',
//     // apple: '/fav.png'
//   },
//   applicationName: 'leofolio',
//   authors: [
//     {
//       name: 'Minimask Labs',
//       url: 'https://minimasklabs.xyz'
//     },
//     {
//       name: 'Kufre-abasi Bassey',
//       url: ''
//     }
//   ],
//   referrer: 'origin',
//   creator: 'Kufre-abasi Bassey',
//   publisher: 'leofolio',
//   robots: { index: true, follow: true },
//   alternates: { canonical: 'https://leofolio.minimasklabs.xyz/' },
//   // manifest: "/manifest.json",

//   openGraph: {
//     type: 'website',
//     url: 'https://leofolio.minimasklabs.xyz/',
//     title: 'leofolio',
//     description:
//       'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.',
//     siteName: 'leofolio',
//     images: [
//       {
//         url: 'https://res.cloudinary.com/domua8ie0/image/upload/v1731307677/OG_image_pzxwg7.png'
//       }
//     ]
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@',
//     creator: '@kufreabasiBass1',
//     // images: '/logo.svg',
//     description:
//       'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.',
//     title: 'leofolio'
//   },
//   verification: {
//     google: ''
//   },
//   abstract:
//     'Connect with verified freelancers and clients while maintaining privacy through zero-knowledge proofs on Aleo.'
// };

export default function RootLayout({
  children,
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
          [WalletAdapterNetwork.TestnetBeta]: [
            'escrow_contract.aleo',
            'escrow_contract_v1.aleo',
            'escrow_contract_v2.aleo',
            'escrow_contract_v3.aleo',
            'zk_privacy_escrow.aleo',
            'escrow_contract11.aleo'
          ]
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
          {/* <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.TestnetBeta}
          > */}
          <PuzzleWalletProvider>{children}</PuzzleWalletProvider>

          {/*            autoConnect
           */}
          {/* <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider> */}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
