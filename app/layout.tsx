import './globals.css'
import type { Metadata } from 'next'
import { Viewport } from 'next/dist/lib/metadata/types/extra-types'
import { Inter } from 'next/font/google'

import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SubPayNG - DSTV & SLTV Subscription Management',
  description: 'Manage DSTV and GoTV subscriptions for clients in Ghana',
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
       <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="196x196" href="/favicon-196.png"/>
        <link rel="apple-touch-icon" href="/apple-icon-180.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
           <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={inter.className}>
         <ToastProvider>

        {children}
         </ToastProvider>
        </body>
    </html>
  )
}