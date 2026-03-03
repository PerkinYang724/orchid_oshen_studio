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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://oshenstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Oshen Studio — AI Automation & Storytelling | Perkin",
    template: "%s | Oshen Studio",
  },
  description:
    "Perkin builds AI-powered automation systems and explores the intersection of technology and humanity through the Still Human Podcast. Automation, AI, and intentional storytelling for creators and businesses.",
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
    title: "Oshen Studio — AI Automation & Storytelling | Perkin",
    description:
      "Perkin builds AI-powered automation systems and explores the intersection of technology and humanity through the Still Human Podcast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oshen Studio — AI Automation & Storytelling | Perkin",
    description:
      "Perkin builds AI-powered automation systems and explores the intersection of technology and humanity through the Still Human Podcast.",
    creator: "@oshen_studio",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
