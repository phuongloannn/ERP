import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import LanguageSwitcher from '@/components/language-switcher'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manh Hoach 4S - Fried Chicken Sales Management',
  description: 'Complete sales management system for Manh Hoach Hanoi Branch - POS, Inventory, Orders & Analytics',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fallback font để tránh lỗi */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
      </head>
      <body className="font-sans antialiased">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  )
}