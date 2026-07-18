import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OrgRide — Enterprise Carpooling Platform",
  description:
    "OrgRide connects verified employees travelling along compatible routes, helping organisations build a more coordinated, affordable and trusted commuting network.",
  keywords: ["carpooling", "enterprise", "employee commute", "ride sharing", "workplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-surface text-neutral-900">
        {children}
      </body>
    </html>
  );
}
