import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
import Breadcrumbs from '../../components/Breadcrumbs';
import ClientProductDetails from '../ClientProductDetails';
import { type Artwork, getArtworkBySlug } from '../../../data/artworks';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// Artwork details are loaded from `data/artworks.ts` by slug

// Header is provided by shared component (app/components/Header.tsx)

// Footer is provided by shared component (app/components/Footer.tsx)

// --- MAIN PRODUCT PAGE ---
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug as string) as Artwork | null;

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-serif text-base`}>
      <PageTransition>
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-4 md:mb-6">
            <Breadcrumbs
              items={[
                { label: 'Artists A-Z', href: '/artists-a-z' },
                { label: artwork ? artwork.title : 'Artwork', href: `/artworks/${slug}` },
              ]}
            />
          </div>

          {/* Client-rendered product details (interactive) */}
          {artwork ? (
            <ClientProductDetails artwork={artwork} slug={slug as string} />
          ) : (
            <div className="py-20 text-center">
              <h2 className="font-serif text-2xl font-bold text-gray-700">Artwork not found</h2>
              <p className="text-gray-500 mt-2">The artwork you requested could not be located.</p>
            </div>
          )}
        </div>
      </PageTransition>
    </main>
  );
}