import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./watermark-overrides.css";
import PageLoader from "./components/PageLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Art Masons",
  description: "Museum-Quality Oil Painting Reproductions - Hand-Painted by Master Artists",
  icons: {
    icon: [
      { url: '/artmasons_logo.png' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: '/artmasons_logo.png',
    shortcut: '/artmasons_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageLoader />
        <ToastProvider>
          <CartProvider>
            <Header />
            {children}
            <BackToTop />
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
