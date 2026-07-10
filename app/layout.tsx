import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://fairbanks.io"),
  title: "Jon Fairbanks — Cloud Infrastructure & Developer Tooling",
  description:
    "Jon Fairbanks builds resilient cloud platforms, thoughtful automation, and developer tools.",
  openGraph: {
    title: "Jon Fairbanks — Cloud Infrastructure & Developer Tooling",
    description:
      "Resilient platforms, thoughtful automation, and tools that make complex work dependable.",
    type: "website",
    url: "https://fairbanks.io",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 921,
        alt: "Jon Fairbanks — Resilient platforms for teams that ship.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jon Fairbanks — Cloud Infrastructure & Developer Tooling",
    description:
      "Resilient platforms, thoughtful automation, and tools that make complex work dependable.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <head>
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
        <link rel="manifest" href="site.webmanifest" />
      </head>
      <body className={`${inter.className} overflow-hidden`}>{children}</body>
      <GoogleAnalytics gaId="G-0CZYE06KYC" />
    </html>
  );
}
