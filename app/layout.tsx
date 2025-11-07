import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "@/shared/contexts/userContext";
import { PracticeProvider} from "@/shared/contexts/practiceContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "EnglishTalkAI - Pratique sua conversação em inglês",
  description:
    "Pratique suas habilidades de conversação em inglês com um tutor de IA interativo. Obtenha feedback em tempo real sobre a pronúncia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`$ ${poppins.variable} font-sans antialiased `}>
        <UserContextProvider>
          <PracticeProvider>{children}</PracticeProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
