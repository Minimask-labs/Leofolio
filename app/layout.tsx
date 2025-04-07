import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leofolio',
  description: 'Created with leofolio',
  generator: 'leofolio.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
