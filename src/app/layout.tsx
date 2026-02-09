import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Cliff Resort Services",
  description: "In-room services for The Cliff Resort Mui Ne guests. Access restaurant, spa, room service, and more.",
  keywords: ["The Cliff Resort", "Mui Ne", "hotel services", "room service", "spa", "restaurant"],
  authors: [{ name: "The Cliff Resort" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TheCliff",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.thecliffresort.com.vn",
    title: "The Cliff Resort Services",
    description: "In-room services for The Cliff Resort Mui Ne guests",
    siteName: "The Cliff Resort",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A4D2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />

        {/* Chatwoot Chat Widget */}
        <Script id="chatwoot-widget" strategy="lazyOnload">
          {`
            (function(d,t) {
              var BASE_URL="https://chat.thecliffresort.com.vn";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'HEv7vrvRpJ1k4Hiwb8vTUF9A',
                  baseUrl: BASE_URL
                })
              }
            })(document,"script");
          `}
        </Script>
      </body>
    </html>
  );
}

