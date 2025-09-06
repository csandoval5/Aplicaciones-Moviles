import './globals.css'
import 'antd/dist/reset.css'
import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'

export const metadata = {
  title: 'Feed Manager',
  description: 'Sistema de login con App Router',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  )
}