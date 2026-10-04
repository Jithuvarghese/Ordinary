import type { Metadata, Viewport } from "next";
import { Anek_Malayalam, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
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

const socialImage = {
  url: "/opengraph.jpg",
  width: 1200,
  height: 675,
  alt: siteConfig.name,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [socialImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#d9251c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
