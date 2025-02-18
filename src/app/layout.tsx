import '@mantine/core/styles.css'

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ApiProvider } from 'src/api/provider'

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Weather App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Suspense>
          <ApiProvider>
            <MantineProvider>{children}</MantineProvider>
          </ApiProvider>
        </Suspense>
      </body>
    </html>
  )
}
