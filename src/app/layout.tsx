import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { MotionProvider } from "../components/motion-provider";
import { DiamondBackground } from "../components/DiamondBackground";
import { ConsentBanner } from "../components/consent-banner";
import { GA_MEASUREMENT_ID, gaScriptSrc } from "../lib/ga";
import { LocaleProvider } from "../i18n/client";
import { getLocale, getMessages } from "../i18n/server";

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

// EEA, plus the UK and Switzerland, which have equivalent regimes. Consent
// Mode applies the region-scoped default to these and the global default
// everywhere else, so visitors outside them are measured without waiting on
// a banner click.
const CONSENT_DENIED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

// Queues the consent defaults and the GA config before gtag.js can read the
// dataLayer. This has to be a real inline <script> in <head>: next/script
// renders inline children into the RSC payload and runs them after hydration,
// which is far too late to gate a tag that is already loading. Executes during
// parse, so the async library cannot get there first.
const gaBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  security_storage: 'granted'
});
gtag('consent', 'default', {
  analytics_storage: 'denied',
  region: ${JSON.stringify(CONSENT_DENIED_REGIONS)},
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`;

const KEYWORDS = [
  "Still Human Podcast",
  "AI podcast",
  "identity and AI",
  "creativity podcast",
  "what it means to be human",
  "AI and humanity",
  "Perkin Yang",
  "Oshen Studio",
  "future of work",
  "AI storytelling",
  "human in the age of AI",
  "AI conversations",
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = await getMessages();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: m.meta.homeTitle,
      template: m.meta.titleTemplate,
    },
    description: m.meta.homeDescription,
    keywords: KEYWORDS,
    authors: [{ name: "Perkin", url: siteUrl }],
    creator: "Perkin",
    openGraph: {
      type: "website",
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
      url: siteUrl,
      siteName: m.meta.siteName,
      title: m.meta.homeTitle,
      description: m.meta.homeDescription,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: m.meta.homeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.meta.homeTitle,
      description: m.meta.homeDescription,
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
      languages: {
        en: siteUrl,
        "zh-Hant-TW": siteUrl,
        "x-default": siteUrl,
      },
    },
    verification: {
      google: "WhUGBjtZn51Svv7QS9FBRJDmzbsIE-ATUCmevsB90Cg",
    },
  };
}

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
        "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "PodcastSeries",
      "@id": `${siteUrl}/#podcast`,
      name: "Still Human Podcast",
      url: "https://open.spotify.com/show/2JdDo1zeJ2fyO5wxxS7ikN",
      description:
        "A podcast exploring identity, creativity, and what it means to be human at the intersection of AI. Hosted by Perkin Yang.",
      author: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const htmlLang = locale === "zh-TW" ? "zh-Hant-TW" : "en";

  return (
    <html lang={htmlLang} className="dark">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Still Human Podcast" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Still Human — Blog" href="https://perkin0909.substack.com/feed" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        {process.env.NODE_ENV === "production" && (
          <script dangerouslySetInnerHTML={{ __html: gaBootstrap }} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <div
          className="fixed inset-0 pointer-events-none z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(41,151,255,0.05) 0%, transparent 60%), transparent",
          }}
        />
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          <DiamondBackground />
        </div>
        <LocaleProvider locale={locale} messages={messages}>
          <MotionProvider>{children}</MotionProvider>
          <ConsentBanner />
        </LocaleProvider>

        {/* Google Analytics. This root layout wraps every route, so the tag
            loads on all of them. Production only: otherwise every `next dev`
            session and every refresh while drafting show notes lands in the
            reporting. afterInteractive keeps it off the critical path. */}
        {/* Only the library load stays on next/script; the dataLayer, consent
            defaults and config are queued by gaBootstrap in <head> above.
            src is /metrics/ on our own domain unless GA_USE_GATEWAY=0. */}
        {process.env.NODE_ENV === "production" && (
          <Script
            src={gaScriptSrc}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
