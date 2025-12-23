import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Plus_Jakarta_Sans } from "next/font/google"
import LanguageSwitcher from "@/components/language-switcher"
import Image from "next/image"
import "./globals.css"

// Tối ưu Font: Plus Jakarta Sans trông hiện đại và chuyên nghiệp hơn Inter cho hệ thống quản lý
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

export const metadata: Metadata = {
  title: "Gà Rán Mạnh Hoạch | Manh Hoach 4S",
  description:
    "Complete fried chicken sales management solution with POS, inventory tracking, online ordering, and analytics.",
  applicationName: "Manh Hoach 4S",
  authors: [{ name: "Manh Hoach 4S" }],
  generator: "Next.js",
}

// Cấu hình Viewport để giao diện mobile không bị co giãn lỗi
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`scroll-smooth ${jakarta.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-[#fcfcfc] text-slate-900">
        
        {/* NÚT CHUYỂN NGÔN NGỮ - Glassmorphism style */}
        <div className="fixed top-6 right-6 z-[60]">
          <div className="backdrop-blur-md bg-white/20 p-1.5 rounded-2xl shadow-2xl border border-white/30 transition-transform hover:scale-105">
            <LanguageSwitcher />
          </div>
        </div>

        {/* BRAND HEADER – Sử dụng Next.js Image để tối ưu hiệu năng */}
        <header className="relative w-full overflow-hidden border-b border-gray-100">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/back.jpg"
              alt="Manh Hoach Background"
              fill
              className="object-cover object-center scale-105"
              priority
            />
            {/* Overlay Gradient đa tầng: Giúp chuyển màu mượt từ ảnh sang trắng nội dung */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fcfcfc]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-200 uppercase tracking-widest">Hanoi Branch</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
              Manh Hoach <span className="text-yellow-400">4S</span>
            </h1>

            <p className="text-xl md:text-2xl font-bold text-white/90">
              Sales Management System
            </p>

            <p className="max-w-xl text-base md:text-lg text-gray-300 leading-relaxed font-medium">
              Giải pháp quản lý bán hàng toàn diện tích hợp POS, theo dõi kho hàng, 
              đặt món trực tuyến và báo cáo doanh thu thông minh.
            </p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="relative z-20">
          {children}
        </main>

        <Analytics />
      </body>
    </html>
  )
}