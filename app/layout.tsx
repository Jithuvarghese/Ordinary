import type { Metadata } from "next";
import { Anek_Malayalam, Space_Grotesk } from "next/font/google";
import "./globals.css";

const malayalam = Anek_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["800"],
  display: "swap",
});

const ui = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Limited Stop",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${malayalam.variable} ${ui.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
