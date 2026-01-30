import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { FloatingDiagnosis } from '@/components/sections/floating-diagnosis'
import { QueryProvider } from '@/components/providers/query-provider'
import { LangProvider } from '@/components/providers/lang-provider'
import { PublicHeaderLayout } from '@/components/layout/public-header-layout'

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
  title: 'LoopArt Studio —— Make Visual POWER.',
  description: 'LoopArt Studio —— Make Visual POWER. 专注ToB科技企业可视化提升，全栈设计×战略咨询×方法论研发。',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
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
          <LangProvider>
            <PublicHeaderLayout>{children}</PublicHeaderLayout>
            <FloatingDiagnosis />
            <Analytics />
          </LangProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
