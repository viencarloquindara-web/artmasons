'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { Trophy, Search, Grid, List } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { ARTWORKS, generateSlug, Artwork } from '../../data/artworks';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// --- THEME COLORS ---
const THEME_RED = '#800000';

// Type for collection painting
type CollectionPainting = {
  rank: number;
  title: string;
  artist: string;
  year: string;
  period: string;
  image: string;
  slug: string;
};

// Helper function to extract period/era from artist life dates or year
const getPeriod = (artistLife?: string, year?: string): string => {
  if (!artistLife && !year) return 'Historical';
  
  const yearMatch = year?.match(/\d{4}/);
  const lifeMatch = artistLife?.match(/(\d{4})-(\d{4})/);
  
  let refYear = 0;
  if (yearMatch) refYear = parseInt(yearMatch[0]);
  else if (lifeMatch) refYear = parseInt(lifeMatch[1]) + 30; // Approximate mid-career
  
  if (refYear < 1400) return 'Medieval';
  if (refYear < 1600) return 'Renaissance';
  if (refYear < 1700) return 'Baroque';
  if (refYear < 1800) return 'Rococo';
  if (refYear < 1850) return 'Neoclassicism';
  if (refYear < 1880) return 'Romanticism';
  if (refYear < 1900) return 'Impressionism';
  if (refYear < 1920) return 'Post-Impressionism';
  if (refYear < 1950) return 'Modern';
  return 'Contemporary';
};

// Map artworks from the system to collection format with ranking
const COLLECTION_PAINTINGS: CollectionPainting[] = ARTWORKS.map((artwork: Artwork, index: number) => ({
  rank: index + 1,
  title: artwork.title,
  artist: artwork.artist,
  year: artwork.year || 'Unknown',
  period: getPeriod(artwork.artistLife, artwork.year),
  image: artwork.image,
  slug: generateSlug(artwork.title)
}));

export default function Top100Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');

  // Get unique periods
  const periods = useMemo(() => {
    const uniquePeriods = Array.from(new Set(COLLECTION_PAINTINGS.map((p: CollectionPainting) => p.period)));
    return ['All', ...uniquePeriods.sort()];
  }, []);

  // Filter paintings based on search and period
  const filteredPaintings = useMemo(() => {
    let filtered = COLLECTION_PAINTINGS;

    if (selectedPeriod !== 'All') {
      filtered = filtered.filter((p: CollectionPainting) => p.period === selectedPeriod);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: CollectionPainting) => 
        p.title.toLowerCase().includes(query) || 
        p.artist.toLowerCase().includes(query) ||
        p.period.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedPeriod]);

  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black font-serif`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Top 100 Paintings', href: '/top-100' }]} />
        </div>

        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-[#800000]" size={48} strokeWidth={1.5} />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#800000]">
              Top 100 Paintings
            </h1>
          </div>
          <p className="font-serif text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our curated collection of the most celebrated masterpieces. 
            Each painting is hand-painted by certified Art Masons using museum-quality materials on 100% linen canvas.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div 
                className="flex items-center border rounded-sm overflow-hidden bg-white"
                style={{ borderColor: THEME_RED }}
              >
                <input
                  type="text"
                  placeholder="Search by title, artist, or period..."
                  className="w-full px-4 py-3 outline-none text-base placeholder-gray-400 font-serif"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-3 hover:bg-gray-100 transition-colors">
                  <Search size={22} className="text-black" />
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#800000] text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000]'
                }`}
              >
                <List size={20} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#800000] text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000]'
                }`}
              >
                <Grid size={20} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex flex-wrap gap-2">
            {periods.map((period: string) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-sm font-serif text-sm transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000] hover:text-[#800000]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-serif text-xl text-gray-700">
            Showing <span className="font-bold text-[#800000] text-2xl">{filteredPaintings.length}</span> {filteredPaintings.length === 1 ? 'painting' : 'paintings'}
          </p>
        </div>

        {/* Paintings List/Grid */}
        {filteredPaintings.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredPaintings.map((painting: CollectionPainting) => {
                return (
                  <Link 
                    key={painting.rank}
                    href={`/artworks/${painting.slug}`}
                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:border-[#800000] group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-md ${
                          painting.rank <= 10 
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' 
                            : painting.rank <= 25
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 shadow-md'
                            : painting.rank <= 50
                            ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md'
                            : 'bg-[#800000] text-white'
                        }`}>
                          #{painting.rank}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="flex-shrink-0 relative w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <Image 
                          src={painting.image} 
                          alt={painting.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 160px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-2xl font-bold text-[#800000] mb-2 group-hover:underline">
                          {painting.title}
                        </h3>
                        <p className="font-serif text-lg text-gray-700 mb-3 font-medium">
                          by <span className="font-semibold">{painting.artist}</span>
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-4 py-1.5 bg-gray-100 rounded-full font-serif text-gray-700">
                            {painting.year}
                          </span>
                          <span className="px-4 py-1.5 bg-[#800000]/10 text-[#800000] rounded-full font-serif font-medium">
                            {painting.period}
                          </span>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="hidden sm:flex flex-shrink-0 text-[#800000] opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPaintings.map((painting: CollectionPainting) => {
                return (
                  <div 
                    key={painting.rank}
                    className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Image with Rank Badge */}
                    <Link href={`/artworks/${painting.slug}`} className="block">
                      <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                        <Image 
                          src={painting.image} 
                          alt={painting.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                        
                        {/* Rank Badge - Simple white circle with black text */}
                        <div className="absolute top-3 left-3 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center font-bold text-sm shadow-lg border border-gray-200">
                          <span className="text-black">{painting.rank}</span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-5">
                      {/* Title - Clickable */}
                      <Link href={`/artworks/${painting.slug}`}>
                        <h3 className="font-serif text-base font-bold text-[#800000] mb-1.5 line-clamp-2 leading-snug min-h-[2.8rem] hover:underline cursor-pointer">
                          {painting.title}
                        </h3>
                      </Link>
                      
                      {/* Year */}
                      <p className="font-serif text-sm text-gray-500 mb-1.5">
                        {painting.year}
                      </p>
                      
                      {/* Artist */}
                      <p className="font-serif text-sm text-[#4A5568] mb-3 font-medium line-clamp-1">
                        {painting.artist}
                      </p>
                      
                      {/* Star Rating */}
                      <div className="flex gap-0.5 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>

                      {/* Product Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all">
                          <div className="font-serif text-xs text-gray-600 mb-1">Oil Painting</div>
                          <div className="font-serif text-base font-bold text-[#800000]">€836</div>
                        </button>
                        <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all">
                          <div className="font-serif text-xs text-gray-600 mb-1">Custom Size</div>
                          <div className="font-serif text-base font-bold text-[#800000]">€58.32</div>
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="text-xs font-serif text-gray-500 leading-relaxed space-y-1 pt-3 border-t border-gray-100">
                        <p className="font-medium text-gray-600">SKU: {painting.slug.toUpperCase().substring(0, 8)}-{painting.rank}</p>
                        <p className="line-clamp-1">{painting.artist}</p>
                        <p className="line-clamp-1">Original Size: 73.7 x 92.1 cm</p>
                        <p className="line-clamp-1 text-gray-400">Museum of Modern Art, New York, USA</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <Trophy className="text-gray-300 mb-4" size={64} strokeWidth={1} />
            <p className="text-xl font-serif text-gray-400 mb-2">No paintings found</p>
            <p className="font-serif text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
