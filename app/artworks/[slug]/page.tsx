import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
import Breadcrumbs from '../../components/Breadcrumbs';
import ClientProductDetails from '../ClientProductDetails';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// --- Theme Colors ---
const THEME_RED = '#800000';

// --- MOCK DATA FOR "STARRY NIGHT" ---
const ARTWORK_DATA = {
  title: "Starry Night",
  year: "1889",
  artist: "Vincent van Gogh",
  artistLife: "1853-1890",
  location: "Museum of Modern Art, New York",
  originalSize: "73.7 x 92.1 cm",
  description: "Own a museum-quality reproduction of Starry Night by Vincent van Gogh (1889), exclusively hand-painted in oils on linen canvas by International artists with academic training. Each masterpiece is created with meticulous craftsmanship, capturing the exceptional quality and authentic brushwork of the original painting.",
  sku: "AM-VG-SN-001",
  basePrice: 3579,
  currency: "AED",
  image: "/image/starry-night.webp",
  options: [
    { id: 'opt1', width: 73.7, height: 92.1, price: 3579, label: 'Original Size' },
    { id: 'opt2', width: 90.0, height: 112.5, price: 4650, label: 'Large' },
    { id: 'opt3', width: 120.0, height: 150.0, price: 6200, label: 'Extra Large' },
  ]
};

// Header is provided by shared component (app/components/Header.tsx)

// Footer is provided by shared component (app/components/Footer.tsx)

// --- MAIN PRODUCT PAGE ---
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-serif text-base`}>
      <PageTransition>
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-4 md:mb-6">
            <Breadcrumbs
              items={[
                { label: 'Artists A-Z', href: '/artists-a-z' },
                { label: ARTWORK_DATA.title, href: `/artworks/${slug}` },
              ]}
            />
          </div>

          {/* Client-rendered product details (interactive) */}
          <ClientProductDetails artwork={ARTWORK_DATA} slug={slug} />
        </div>
      </PageTransition>
    </main>
  );
}