import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nationwide Educational Services",
  description: "Indias best in class educational services, we provide a wide range of services to help you achieve your goals.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Nationwide Educational Services", "Nationwide", "Educational Services", "Educational", "Services"],
  authors: [{ name: "Nationwide Educational Services", url: "https://nationwideeducationalservices.com" }],
  creator: "Nationwide Educational Services",
  publisher: "Nationwide Educational Services",
  openGraph: {
    title: "Nationwide Educational Services",
    description: "Indias best in class educational services",
    url: "https://nationwideeducationalservices.com",
    siteName: "Nationwide Educational Services",
    images: [{ url: "/favicon.ico" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nationwide Educational Services",
    description: "Indias best in class educational services",
    images: [{ url: "/favicon.ico" }],
  },
  alternates: {
    canonical: "https://nationwideeducationalservices.com",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
  },
  verification: {
    google: "google-site-verification=1234567890",
  },
  manifest: "/manifest.json",
  category: "education",
  product: "education",
  rating: 4.5,
  price: 0,
  currency: "INR",
  deliveryTime: 10,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
         <main className=" md:pt-[65px]">{children}</main>
      </body>
    </html>
  );
}
