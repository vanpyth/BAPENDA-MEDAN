import { Metadata } from "next";

export function constructMetadata({
  title = "SIPADA Medan — Sistem Informasi Pendapatan Daerah",
  description = "Portal resmi Badan Pendapatan Daerah (Bapenda) Kota Medan. Layanan digital untuk pembayaran pajak daerah, cek tagihan PBB, PKB, dan informasi perpajakan.",
  image = "/thumbnail.jpg",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: ["Bapenda Medan", "Pajak Daerah Medan", "PBB Medan", "SIPADA", "e-Government Medan", "Medan Berkah"],
    authors: [{ name: "Bapenda Kota Medan" }],
    creator: "Badan Pendapatan Daerah Kota Medan",
    publisher: "Pemerintah Kota Medan",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://bapenda.pemkomedan.go.id"),
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://bapenda.pemkomedan.go.id",
      title,
      description,
      siteName: "SIPADA Medan",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@bapenda_medan",
    },
    icons,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
