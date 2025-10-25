import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meeting Scheduler - Enterprise Meeting Management',
  description: 'Modern enterprise meeting scheduling application with calendar integration and room booking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div id="root">{children}</div>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}