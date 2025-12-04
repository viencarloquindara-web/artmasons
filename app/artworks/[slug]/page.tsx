'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Facebook,
  Mail,
  Phone,
  Video,
  Star,
  Info,
  ChevronRight,
  ShoppingCart,
  Palette
} from 'lucide-react';

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
export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [selectedOption, setSelectedOption] = useState(ARTWORK_DATA.options[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-serif text-base`}>
      <Header />

      <PageTransition>
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 md:mb-6 font-serif uppercase tracking-wide">
          <Link href="/" className="hover:text-[#800000] transition-colors">Home</Link> 
          <ChevronRight size={12} /> 
          <Link href="/artists-a-z" className="hover:text-[#800000] transition-colors">Artists</Link> 
          <ChevronRight size={12} /> 
          <span className="text-[#800000] font-bold">{ARTWORK_DATA.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* LEFT: Image */}
          <div className="w-full">
            <div className="bg-gray-50 border border-gray-200 p-3 md:p-4 flex items-center justify-center aspect-[4/3] relative group">
              <div className="relative w-full h-full">
                <Image 
                  src={ARTWORK_DATA.image} 
                  alt={ARTWORK_DATA.title} 
                  width={800} 
                  height={600} 
                  className="object-cover w-full h-full shadow-xl"
                  priority
                />
                {/* Museum Quality Diagonal Ribbon */}
                <div className="absolute top-0 left-0 w-40 md:w-48 h-40 md:h-48 overflow-hidden pointer-events-none">
                  <div className="absolute -left-12 md:-left-14 top-8 md:top-10 transform -rotate-45 bg-[#800000] text-white px-12 md:px-16 py-1.5 md:py-2 font-serif text-xs md:text-sm uppercase tracking-widest shadow-xl whitespace-nowrap text-center flex items-center justify-center">
                    Museum Quality
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Info Below Image */}
            <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
                <h3 className="font-serif text-lg md:text-xl font-bold text-[#800000] mb-2 md:mb-3 uppercase">About This Artwork</h3>
                <div className="space-y-1.5 text-sm md:text-base text-gray-700 font-serif">
                  <p><span className="font-bold text-gray-900">Artist:</span> {ARTWORK_DATA.artist} ({ARTWORK_DATA.artistLife})</p>
                  <p><span className="font-bold text-gray-900">Original Year:</span> {ARTWORK_DATA.year}</p>
                  <p><span className="font-bold text-gray-900">Current Location:</span> {ARTWORK_DATA.location}</p>
                  <p><span className="font-bold text-gray-900">Original Dimensions:</span> {ARTWORK_DATA.originalSize}</p>
                </div>
              </div>

              <div className="bg-[#800000] text-white p-4 md:p-5">
                <h3 className="font-serif text-lg md:text-xl font-bold mb-2 md:mb-3 uppercase">Art Masons Assurance</h3>
                <ul className="space-y-1.5 text-sm md:text-base font-serif">
                  <li className="flex items-center gap-2">
                    <Star size={12} className="flex-shrink-0" fill="white" />
                    100% Hand-Painted by Master Artists
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={12} className="flex-shrink-0" fill="white" />
                    Premium Linen Canvas & Oil Paints
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={12} className="flex-shrink-0" fill="white" />
                    Museum-Quality Reproduction
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={12} className="flex-shrink-0" fill="white" />
                    International Academic Training
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Cart */}
          <div className="w-full space-y-4 md:space-y-6">
            
            {/* Title & Artist */}
            <div className="border-b border-gray-200 pb-4 md:pb-5">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#800000] mb-1.5">
                {ARTWORK_DATA.title}
              </h1>
              <p className="font-serif text-xl md:text-2xl text-gray-600 italic mb-3">
                {ARTWORK_DATA.artist}, {ARTWORK_DATA.year}
              </p>
              <p className="text-gray-700 leading-relaxed font-serif text-base">
                {ARTWORK_DATA.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-4xl md:text-5xl font-bold text-[#800000] inline-flex items-end">
                  {selectedOption.price.toLocaleString().split(',').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-2xl md:text-3xl relative top-1 mx-px">,</span>}
                    </React.Fragment>
                  ))}
                </span>
                <span className="font-serif text-lg md:text-xl text-gray-600">{ARTWORK_DATA.currency}</span>
              </div>
              <p className="text-sm md:text-sm text-gray-500 font-serif uppercase tracking-wide">
                SKU: {ARTWORK_DATA.sku}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-3 uppercase">Select Canvas Size</h3>
              <div className="space-y-2 md:space-y-3">
                {ARTWORK_DATA.options.map((option) => (
                  <label 
                    key={option.id} 
                    className={`
                      flex items-center justify-between p-3 md:p-4 border cursor-pointer transition-all duration-200
                      ${selectedOption.id === option.id 
                        ? 'border-[#800000] bg-red-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedOption.id === option.id ? 'border-[#800000]' : 'border-gray-300'}
                      `}>
                        {selectedOption.id === option.id && (
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#800000]" />
                        )}
                      </div>
                      <div className="font-serif">
                        <div className="text-base md:text-lg font-bold text-gray-900">
                          {option.width.toFixed(1)} x {option.height.toFixed(1)} cm
                        </div>
                        {option.id === 'opt1' && (
                          <span className="text-sm md:text-sm text-gray-500 italic">Original Size</span>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-base md:text-lg text-gray-800 inline-flex items-end">
                      {option.price.toLocaleString().split(',').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-sm md:text-sm relative top-0.5 mx-px">,</span>}
                        </React.Fragment>
                      ))}
                      <span className="ml-1">{ARTWORK_DATA.currency}</span>
                    </span>
                    
                    <input 
                      type="radio" 
                      name="size" 
                      value={option.id} 
                      checked={selectedOption.id === option.id} 
                      onChange={() => setSelectedOption(option)} 
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
              
              {/* Custom Size Note */}
              <div className="mt-3 flex items-start gap-2 text-sm md:text-sm text-gray-600 font-serif border border-gray-200 p-2.5 md:p-3 bg-gray-50">
                <Info size={12} className="flex-shrink-0 mt-0.5" />
                <p>
                  Need a custom size? <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-bold">Contact us</a> for personalized dimensions.
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-3 uppercase">Quantity</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-xl md:text-2xl transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 md:w-20 h-9 md:h-10 border border-gray-300 text-center font-serif font-bold text-lg md:text-xl outline-none focus:border-[#800000]"
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-xl md:text-2xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <button className="w-full bg-[#800000] hover:bg-[#600000] text-white font-serif font-bold text-base md:text-lg py-3 md:py-3.5 px-4 transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wide">
                <ShoppingCart size={18} /> 
                <span className="inline-flex items-end">
                  Add to Cart - 
                  {selectedOption.price.toLocaleString().split(',').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-sm md:text-sm relative top-0.5 mx-px">,</span>}
                    </React.Fragment>
                  ))}
                  <span className="ml-1">{ARTWORK_DATA.currency}</span>
                </span>
              </button>
              
              <button className="w-full bg-white border border-[#800000] text-[#800000] hover:bg-red-50 font-serif font-bold text-base md:text-lg py-3 md:py-3.5 px-4 transition-colors uppercase tracking-wide">
                Request Custom Quote
              </button>

              <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-600 font-serif pt-1">
                <Phone size={14} />
                <span className="text-center">Need Help? <a href="https://wa.me/971561704788" target="_blank" rel="noopener noreferrer" className="text-[#800000] font-bold hover:underline inline-flex items-center gap-1">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  +971 56 170 4788
                </a></span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <ShoppingBag size={20} className="text-[#800000] flex-shrink-0" />
                <div className="font-serif text-sm md:text-sm">
                  <p className="font-bold text-gray-900 leading-tight">Secure Checkout</p>
                  <p className="text-gray-600 leading-tight">Safe & Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <Palette size={20} className="text-[#800000] flex-shrink-0" />
                <div className="font-serif text-sm md:text-sm">
                  <p className="font-bold text-gray-900 leading-tight">Handmade</p>
                  <p className="text-gray-600 leading-tight">By Master Artists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </PageTransition>

      <Footer />
    </main>
  );
}