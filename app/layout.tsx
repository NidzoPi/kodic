import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kodić | Digitalne nagradne igre i popusti",
  description:
    "Grebi, osvoji i uštedi. Kodić povezuje kupce i brendove kroz digitalne nagradne igre, kupone i posebne ponude.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Kodić | Digitalne nagradne igre",
    description:
      "Učestvuj u digitalnim nagradnim igrama, osvoji kupone i posebne popuste.",
    url: "https://kodic.ba",
    siteName: "Kodić",
    locale: "sr_BA",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Kodić",
      },
    ],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
