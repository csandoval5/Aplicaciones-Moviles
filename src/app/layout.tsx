import './globals.css'
import 'antd/dist/reset.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Feed Manager',
  description: 'Sistema de login con App Router',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
