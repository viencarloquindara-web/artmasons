'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
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
  description: "Own a museum-quality reproduction of Starry Night by Vincent van Gogh (1889), exclusively hand-painted in oils on linen canvas by European artists with academic training. Each masterpiece is created with meticulous craftsmanship, capturing the exceptional quality and authentic brushwork of the original painting.",
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

// --- SHARED HEADER COMPONENT (Simplified for this page) ---
const Header = () => (
  <header className="relative z-50 bg-white pt-6 pb-4 shadow-sm border-b border-gray-100">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-end gap-12">
      {/* Logo */}
      <div className="flex-shrink-0 flex flex-col items-center justify-end w-auto md:w-56 cursor-pointer pb-2">
        <Link href="/">
          <div className="relative w-32 h-32 md:w-44 md:h-44">
            <Image src="/artmasons_logo.png" alt="Art Masons Seal" fill className="object-contain" priority />
          </div>
        </Link>
      </div>

      {/* Navigation & Search */}
      <div className="flex-1 flex flex-col w-full justify-end">
        <div className="flex flex-col md:flex-row items-center gap-6 relative w-full">
          <div className="flex-1 w-full relative z-20">
            <div className={`flex items-center border rounded-sm overflow-hidden bg-white w-full`} style={{ borderColor: THEME_RED }}>
              <input type="text" placeholder="Search For Paintings" className="w-full px-4 py-3 outline-none text-sm placeholder-gray-400 font-serif" />
              <button className="p-3 hover:bg-gray-100 transition-colors">
                <Search size={22} className="text-black" />
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-6 self-center h-full pb-1">
             <div className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden shadow-sm border border-gray-200" title="UAE">
               <div className="absolute inset-y-0 left-0 w-1/4 bg-red-600"></div>
               <div className="absolute top-0 right-0 w-3/4 h-1/3 bg-green-600"></div>
               <div className="absolute bottom-0 right-0 w-3/4 h-1/3 bg-black"></div>
               <div className="absolute top-1/3 right-0 w-3/4 h-1/3 bg-white"></div>
             </div>
             <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
               <div className="relative">
                 <ShoppingBag size={28} color="black" strokeWidth={1.5} />
                 <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-serif">0</span>
               </div>
             </div>
          </div>
        </div>
        <div className="h-10 hidden md:block"></div>
        <div className="hidden md:block w-full">
          <nav>
            <ul className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 py-2 font-serif text-base md:text-lg tracking-wide uppercase font-bold w-full">
              {['Artists A-Z', 'Top 100 Paintings', 'Our Quality', 'Framing Paintings', 'About Us'].map((item) => (
                <li key={item} className="cursor-pointer text-[#800000] hover:text-black transition-colors relative group whitespace-nowrap">
                  <Link href={item === 'Artists A-Z' ? '/artists-a-z' : '#'}>{item}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
);

// --- FOOTER COMPONENT ---
const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 mt-20">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h4 className="font-serif text-xl mb-6">About Art Masons</h4>
        <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
          We are a small, highly specialised team of artists, academically trained according to European standards, and we never compromise on detail, technique, or materials.
        </p>
      </div>
      <div>
        <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Customer Service</h4>
        <ul className="space-y-3 font-serif text-gray-300">
          <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Contact Us</h4>
        <div className="space-y-4">
          <a href="mailto:info@artmasons.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors font-serif">
            <Mail size={18} /> info@artmasons.com
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Secure Online Payment</h4>
           <div className="flex gap-2">
             <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md"><span className="text-blue-900 font-bold text-[10px] italic font-serif">VISA</span></div>
           </div>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN PRODUCT PAGE ---
export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [selectedOption, setSelectedOption] = useState(ARTWORK_DATA.options[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-serif`}>
      <Header />

      <PageTransition>
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 md:mb-6 font-serif uppercase tracking-wide">
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
              <Image 
                src={ARTWORK_DATA.image} 
                alt={ARTWORK_DATA.title} 
                width={800} 
                height={600} 
                className="object-contain w-full h-full shadow-xl"
                priority
              />
              {/* Museum Quality Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#800000] text-white px-2 py-1 md:px-3 md:py-1.5 font-serif text-[10px] md:text-xs uppercase tracking-wide shadow-lg">
                Museum Quality
              </div>
            </div>
            
            {/* Additional Info Below Image */}
            <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
                <h3 className="font-serif text-base md:text-lg font-bold text-[#800000] mb-2 md:mb-3 uppercase">About This Artwork</h3>
                <div className="space-y-1.5 text-xs md:text-sm text-gray-700 font-serif">
                  <p><span className="font-bold text-gray-900">Artist:</span> {ARTWORK_DATA.artist} ({ARTWORK_DATA.artistLife})</p>
                  <p><span className="font-bold text-gray-900">Original Year:</span> {ARTWORK_DATA.year}</p>
                  <p><span className="font-bold text-gray-900">Current Location:</span> {ARTWORK_DATA.location}</p>
                  <p><span className="font-bold text-gray-900">Original Dimensions:</span> {ARTWORK_DATA.originalSize}</p>
                </div>
              </div>

              <div className="bg-[#800000] text-white p-4 md:p-5">
                <h3 className="font-serif text-base md:text-lg font-bold mb-2 md:mb-3 uppercase">Art Masons Assurance</h3>
                <ul className="space-y-1.5 text-xs md:text-sm font-serif">
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
                    European Academic Training
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Cart */}
          <div className="w-full space-y-4 md:space-y-6">
            
            {/* Title & Artist */}
            <div className="border-b border-gray-200 pb-4 md:pb-5">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#800000] mb-1.5">
                {ARTWORK_DATA.title}
              </h1>
              <p className="font-serif text-lg md:text-xl text-gray-600 italic mb-3">
                {ARTWORK_DATA.artist}, {ARTWORK_DATA.year}
              </p>
              <p className="text-gray-700 leading-relaxed font-serif text-sm">
                {ARTWORK_DATA.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 border border-gray-200 p-4 md:p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#800000]">
                  {selectedOption.price.toLocaleString()}
                </span>
                <span className="font-serif text-base md:text-lg text-gray-600">{ARTWORK_DATA.currency}</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 font-serif uppercase tracking-wide">
                SKU: {ARTWORK_DATA.sku}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 mb-3 uppercase">Select Canvas Size</h3>
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
                        <div className="text-sm md:text-base font-bold text-gray-900">
                          {option.width.toFixed(1)} x {option.height.toFixed(1)} cm
                        </div>
                        {option.id === 'opt1' && (
                          <span className="text-[10px] md:text-xs text-gray-500 italic">Original Size</span>
                        )}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-sm md:text-base text-gray-800">
                      {option.price.toLocaleString()} {ARTWORK_DATA.currency}
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
              <div className="mt-3 flex items-start gap-2 text-[10px] md:text-xs text-gray-600 font-serif border border-gray-200 p-2.5 md:p-3 bg-gray-50">
                <Info size={12} className="flex-shrink-0 mt-0.5" />
                <p>
                  Need a custom size? <a href="mailto:info@artmasons.com" className="text-[#800000] hover:underline font-bold">Contact us</a> for personalized dimensions.
                </p>
              </div>
            </div>

            {/* Frame Options */}
            <div>
              <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 mb-3 uppercase">Framing Options</h3>
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center justify-between p-3 md:p-4 border border-[#800000] bg-red-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#800000] flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#800000]" />
                    </div>
                    <span className="font-serif text-sm md:text-base font-bold text-gray-900">Unframed (Canvas Only)</span>
                  </div>
                  <span className="font-serif text-xs md:text-sm text-gray-600">Included</span>
                </label>
                
                <label className="flex items-center justify-between p-3 md:p-4 border border-gray-200 bg-white hover:border-gray-400 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    </div>
                    <span className="font-serif text-sm md:text-base text-gray-900">With Premium Frame</span>
                  </div>
                  <span className="font-serif text-sm md:text-base font-bold text-gray-800">+ 850 {ARTWORK_DATA.currency}</span>
                </label>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 mb-3 uppercase">Quantity</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-lg md:text-xl transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 md:w-20 h-9 md:h-10 border border-gray-300 text-center font-serif font-bold text-base md:text-lg outline-none focus:border-[#800000]"
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-300 hover:border-[#800000] flex items-center justify-center font-bold text-lg md:text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <button className="w-full bg-[#800000] hover:bg-[#600000] text-white font-serif font-bold text-sm md:text-base py-3 md:py-3.5 px-4 transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wide">
                <ShoppingCart size={18} /> 
                Add to Cart - {selectedOption.price.toLocaleString()} {ARTWORK_DATA.currency}
              </button>
              
              <button className="w-full bg-white border border-[#800000] text-[#800000] hover:bg-red-50 font-serif font-bold text-sm md:text-base py-3 md:py-3.5 px-4 transition-colors uppercase tracking-wide">
                Request Custom Quote
              </button>

              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600 font-serif pt-1">
                <Phone size={14} />
                <span className="text-center">Need Help? Call: <a href="tel:+971561704788" className="text-[#800000] font-bold hover:underline">+971 56 170 4788</a></span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <ShoppingBag size={20} className="text-[#800000] flex-shrink-0" />
                <div className="font-serif text-[10px] md:text-xs">
                  <p className="font-bold text-gray-900 leading-tight">Secure Checkout</p>
                  <p className="text-gray-600 leading-tight">Safe & Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                <Palette size={20} className="text-[#800000] flex-shrink-0" />
                <div className="font-serif text-[10px] md:text-xs">
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