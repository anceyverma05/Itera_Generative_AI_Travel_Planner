import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Itera Planner",
  description: "Premium AI Travel Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We enforce the 'dark' class and load the custom font variables
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}