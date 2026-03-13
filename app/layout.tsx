import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Silent Peak Trail — Ladakh Travel Agency",
    template: "%s | Silent Peak Trail"
  },
  description: "Specializing in premium, off-beat Ladakh expeditions since 2009. From Hanle stargazing to Nubra Valley adventures, we create authentic Himalayan journeys.",
  keywords: [
    "Ladakh Travel Agency",
    "Leh Ladakh tours",
    "Hanle stargazing",
    "Nubra Valley adventure",
    "Pangong Lake trip",
    "Ladakh bike trip",
    "Premium Ladakh packages",
    "Ladakh local guides",
    "best places to visit in ladakh",
    "sham valley"
  ],
  metadataBase: new URL("https://silentpeaktrail.com"), // User should update this when live
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Silent Peak Trail — Ladakh Travel Agency",
    description: "Authentic, safe, and premium Ladakh travel experiences. Native guides and perfectly perfected routes.",
    url: "https://silentpeaktrail.com",
    siteName: "Silent Peak Trail",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Needs to be generated or placed in public
        width: 1200,
        height: 630,
        alt: "Silent Peak Trail - Ladakh Landscapes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Peak Trail — Ladakh Travel Agency",
    description: "Award-winning Ladakh travel specialists since 2009. Authentic Himalayan expeditions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

import NextTopLoader from "nextjs-toploader";
import InitialLoader from "@/components/ui/InitialLoader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=Montserrat:wght@300;400;500;700;800;900&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextTopLoader color="#2563eb" showSpinner={false} shadow="0 0 10px #2563eb,0 0 5px #2563eb" />
        <InitialLoader />
        {children}
      </body>
    </html>
  );
}
