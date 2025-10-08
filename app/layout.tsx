import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Conway's Game of Life",
  description: 'Interactive implementation of Conway\'s Game of Life',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
