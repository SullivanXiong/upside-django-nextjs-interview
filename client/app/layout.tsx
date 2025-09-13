import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'A modern dashboard with chart and table components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
			  {children}
		  </ThemeProvider>
      </body>
    </html>
  )
}
