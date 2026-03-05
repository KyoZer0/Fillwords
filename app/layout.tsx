import type { Metadata } from "next";
import Script from 'next/script';
import { Lora, Playfair_Display, Righteous } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-sans", // We'll keep the variable name generic or change it
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-arcade",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FillWords – Free Online Word Puzzle Game",
    template: "%s | FillWords",
  },
  description:
    "Play FillWords online! Swipe through a grid of letters to discover hidden words. A fun, addictive word puzzle game with 500+ words across 5 categories.",
  keywords: [
    "FillWords",
    "word puzzle",
    "word search game",
    "online word game",
    "free word game",
    "brain games",
    "fill words puzzle",
    "word categories",
    "swipe word game",
    "letter grid puzzle",
  ],
  authors: [{ name: "FillWords Team" }],
  creator: "FillWords",
  publisher: "FillWords",
  metadataBase: new URL("https://fillwords.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FillWords",
    title: "FillWords – Free Online Word Puzzle Game",
    description:
      "Play FillWords online! Swipe through letters to find hidden words. 500+ words across 5 categories.",
    url: "https://fillwords.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FillWords – Free Online Word Puzzle Game",
    description:
      "Swipe through a grid of letters to discover hidden words. Play free online with 500+ words!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function getPublisherId() {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  if (!raw) return '';
  return raw.startsWith('ca-pub-') ? raw : `ca-pub-${raw}`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publisherId = getPublisherId();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {publisherId ? (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FillWords",
              url: "https://fillwords.com",
              description:
                "Free online word puzzle game. Swipe through a grid of letters to find hidden words across 5 categories.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://fillwords.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${lora.variable} ${playfair.variable} ${righteous.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
