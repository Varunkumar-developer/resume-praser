import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Resume Parser",
  description: "AI-powered resume parsing using Gemini API",
  metadataBase: new URL("https://resume-praser.vercel.app/"),
  authors: [{ name: "Varun Kumar" }],
  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "Resume Parser",
    description: "AI-powered resume parsing using Gemini API",
    url: "https://resume-praser.vercel.app/",
    siteName: "Resume Parser",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resume Parser OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resume Parser",
    description: "AI-powered resume parsing using Gemini API",
    images: ["/og-image.png"],
    creator: "Varun Kumar",
  },

  // For Instagram, LinkedIn, Facebook → They all use Open Graph (above)
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
