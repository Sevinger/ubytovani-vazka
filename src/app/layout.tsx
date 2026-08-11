import type { Metadata } from "next";
import { Archivo, Bodoni_Moda } from "next/font/google";

import { contact, operator, site } from "@/lib/content";
import "./globals.css";

/**
 * latin-ext carries ě š č ř ž ý á í é ů ú ň ť ď. Without it Czech text falls
 * back to a system face mid-word and the display type looks broken.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ubytování Vážka — penzion Mohelnice",
    template: "%s | Ubytování Vážka",
  },
  description:
    "Penzion v Mohelnici. Apartmány s vlastní kuchyní a pokoje od 350 Kč za osobu a noc. Olomoucká 1364/75, kousek od D35 a Jeseníků.",
  keywords: [
    "ubytování Mohelnice",
    "penzion Mohelnice",
    "apartmán Mohelnice",
    "levné ubytování Mohelnice",
    "ubytování Olomoucký kraj",
  ],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: site.url,
    siteName: site.name,
    title: "Ubytování Vážka — penzion Mohelnice",
    description:
      "Apartmány s vlastní kuchyní a pokoje od 350 Kč za osobu a noc v Mohelnici.",
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

/** Structured data, so a search result can show address, price and phone. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  url: site.url,
  telephone: `+420 ${contact.phone}`,
  email: contact.email,
  priceRange: "350–750 Kč",
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.city,
    postalCode: contact.zip,
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: contact.lat,
    longitude: contact.lon,
  },
  petsAllowed: false,
  legalName: operator.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${bodoni.variable} ${archivo.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled data. `<` is escaped anyway so a stray
          // "</script>" in any future value can never close this tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#ubytovani"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-bone focus:px-5 focus:py-2.5 focus:text-sm focus:text-ink"
        >
          Přejít na obsah
        </a>
        {children}
      </body>
    </html>
  );
}
