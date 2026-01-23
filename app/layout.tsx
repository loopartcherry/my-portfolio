import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { FloatingDiagnosis } from '@/components/sections/floating-diagnosis'
import { QueryProvider } from '@/components/providers/query-provider'

import { Inter, JetBrains_Mono, Space_Grotesk as V0_Font_Space_Grotesk, IBM_Plex_Mono as V0_Font_IBM_Plex_Mono, IBM_Plex_Serif as V0_Font_IBM_Plex_Serif } from 'next/font/google'

// Initialize fonts
const _spaceGrotesk = V0_Font_Space_Grotesk({ subsets: ['latin'], weight: ["300","400","500","600","700"] })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"] })
const _ibmPlexSerif = V0_Font_IBM_Plex_Serif({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"] })

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const spaceGrotesk = V0_Font_Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'ToB可视化设计师 | 让可视化成为你的商业竞争力',
  description: '专注ToB科技企业可视化提升5年+，全栈设计师×战略咨询师×方法论研发者。服务100+企业，助力8亿+融资。',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
          <FloatingDiagnosis />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  )
}
