import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "VeriCert - Secure JWT Certificate Verification by BroCode",
  description: "Verify cryptographically signed JWT certificates with RS256 encryption. Modern platform for digital certificate authentication and validation.",
  keywords: [
    "certificate verification",
    "JWT",
    "RS256 encryption",
    "digital certificates",
    "cryptography",
    "certificate authentication",
    "BroCode",
    "secure verification"
  ],
  authors: [
    {
      name: "BroCode Tech Community",
      url: "https://brocode-tech.netlify.app",
    },
  ],
  creator: "BroCode Tech Community",
  publisher: "BroCode Tech Community",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vericert.app",
    siteName: "VeriCert",
    title: "VeriCert - Secure JWT Certificate Verification",
    description: "Verify cryptographically signed JWT certificates with industry-standard RS256 encryption. Beautiful, secure, and easy to use.",
    images: [
      {
        url: "https://vericert.app/brocode-logo.jpg",
        width: 1200,
        height: 630,
        alt: "VeriCert Certificate Verification Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VeriCert - Secure JWT Certificate Verification",
    description: "Verify cryptographically signed JWT certificates with RS256 encryption",
    images: ["https://vericert.app/brocode-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://vericert.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VeriCert",
              description: "Secure JWT Certificate Verification Platform",
              url: "https://vericert.app",
              applicationCategory: "UtilityApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "BroCode Tech Community",
                url: "https://brocode-tech.netlify.app",
                logo: "https://vericert.app/brocode-logo.jpg",
              },
            }),
          }}
        />

        {/* No-JS Fallback Stylesheet */}
        <noscript>
          <style>{`
            .noscript-container {
              display: flex !important;
            }
            .vortex-container {
              display: none !important;
            }
            .certificate-content {
              display: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JavaScript Disabled Fallback */}
        <noscript>
          <div className="noscript-container w-full min-h-screen bg-black text-white flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-6 py-12 text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  VeriCert
                </h1>
                <p className="text-xl text-gray-300">JWT Certificate Verification Platform</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-400">⚠️ JavaScript Required</h2>
                <p className="text-gray-300 leading-relaxed">
                  VeriCert requires JavaScript to be enabled for certificate verification and validation.
                  Please enable JavaScript in your browser settings to access this application.
                </p>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4 text-left text-sm space-y-2">
                  <p className="font-semibold text-white">How to Enable JavaScript:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li><strong>Chrome/Edge:</strong> Settings → Privacy and security → Site Settings → JavaScript → Allow</li>
                    <li><strong>Firefox:</strong> about:config → Search "javascript.enabled" → Toggle to true</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → "Enable JavaScript"</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Explore BroCode Ecosystem</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* BroCode */}
                  <a
                    href="https://brocode-tech.netlify.app/"
                    className="bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-lg p-6 text-white font-semibold transition-colors block"
                  >
                    <div className="text-3xl mb-2">🎓</div>
                    <div>BroCode Tech</div>
                    <div className="text-xs font-normal text-gray-100 mt-2">Learning & Courses</div>
                  </a>

                  {/* Event Horizon */}
                  <a
                    href="https://events.neopanda.tech/"
                    className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg p-6 text-white font-semibold transition-colors block"
                  >
                    <div className="text-3xl mb-2">📅</div>
                    <div>Event Horizon</div>
                    <div className="text-xs font-normal text-gray-100 mt-2">Community Events</div>
                  </a>

                  {/* Bromine */}
                  <a
                    href="https://bromine.vercel.app/"
                    className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg p-6 text-white font-semibold transition-colors block"
                  >
                    <div className="text-3xl mb-2">📝</div>
                    <div>Bromine</div>
                    <div className="text-xs font-normal text-gray-100 mt-2">Community Blogs</div>
                  </a>
                </div>

                <p className="text-gray-400 text-sm">
                  Once you enable JavaScript, you'll have access to VeriCert's full certificate verification capabilities.
                </p>
              </div>
            </div>
          </div>
        </noscript>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
