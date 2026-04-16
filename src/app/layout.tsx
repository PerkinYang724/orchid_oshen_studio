import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "../components/motion-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://oshenstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Still Human — Who Are You Without AI?",
    template: "%s | Oshen Studio",
  },
  description:
    "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.",
  keywords: [
    "AI automation",
    "AI systems builder",
    "automation workflows",
    "n8n automation",
    "Still Human Podcast",
    "AI and humanity",
    "Oshen Studio",
    "future of work",
    "AI storytelling",
    "student entrepreneur AI",
    "Supabase automation",
    "AI for creators",
  ],
  authors: [{ name: "Perkin", url: siteUrl }],
  creator: "Perkin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Oshen Studio",
    title: "Still Human — Who Are You Without AI?",
    description:
      "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Oshen Studio — AI Automation & Storytelling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Still Human — Who Are You Without AI?",
    description:
      "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.",
    creator: "@oshen_studio",
    images: [`${siteUrl}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icon-180.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "WhUGBjtZn51Svv7QS9FBRJDmzbsIE-ATUCmevsB90Cg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Perkin",
      url: siteUrl,
      jobTitle: "AI Systems Builder & Founder",
      sameAs: [
        "https://www.linkedin.com/in/perkin0909/",
        "https://www.instagram.com/oshen_studio/",
        "https://substack.com/@perkin0909",
        "https://youtube.com/@oshen.studio",
        "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Oshen Studio",
        url: siteUrl,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Oshen Studio",
      description:
        "AI-powered automation systems and storytelling for creators and businesses.",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "PodcastSeries",
      name: "Still Human Podcast",
      url: "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN",
      description:
        "Exploring the intersection of AI and humanity. Conversations about staying human in an accelerating world.",
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
