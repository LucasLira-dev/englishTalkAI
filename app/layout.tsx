import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "EnglishTalkAI - Practice English with AI",
  description:
    "Practice your English conversation skills with an interactive AI tutor. Get real-time feedback on pronunciation and grammar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`$ ${poppins.variable} font-sans antialiased `}>{children}</body>
    </html>
  )
}