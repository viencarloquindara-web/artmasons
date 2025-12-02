'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';
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
} from 'lucide-react';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// --- Theme Colors ---
const THEME_RED = '#800000';

// --- DATA ---

const ASSURANCE_POINTS = [
  'Museum Quality', // [cite: 23]
  'Meticulously Hand Painted', // [cite: 24]
  'Certified Experienced Art Masons', // [cite: 25]
  'Refined Oil Paints', // [cite: 26]
  'Rich Pigment, Purity & Permanence', // [cite: 27]
  '100% Linen Canvases', // [cite: 28]
];

// Fun Facts [cite: 59-108]
const FUN_FACTS_DATA = [
  'Leonardo da Vinci could write with one hand while drawing with the other.',
  'Van Gogh sold only one painting in his lifetime.',
  'Michelangelo disliked painting but created the Sistine Chapel ceiling anyway.',
  'Picasso could draw before he could speak.',
  'The Mona Lisa has no visible eyelashes or eyebrows.',
  'Salvador Dalí kept ants and crutches as recurring symbols.',
  'Banksy’s identity is still unknown.',
  'Raphael died at only 37 but left more than 100 major works.',
  'The Scream’s sky was inspired by a real volcanic sunset in Norway.',
  "Andy Warhol kept everything he owned in 'time capsules.'",
  'The Last Supper survived bombings during WWII with only a wall tarp.',
];

// Testimonials [cite: 123-140]
const TESTIMONIALS_DATA = [
  'Art Masons delivered a masterpiece far beyond what I imagined.',
  'The quality from Art Masons is simply unmatched.',
  'Everyone who visits my home compliments my Art Masons painting.',
  'Art Masons truly sets the standard for museum-quality work.',
  'I’ve never seen replicas done this perfectly — Art Masons is elite.',
  'The attention to detail from Art Masons is extraordinary.',
  'Art Masons turned my space into a gallery.',
  'The colors from Art Masons feel alive — absolutely stunning.',
  'My home finally feels complete thanks to Art Masons.',
];

// UPDATED PATHS: Starting with /popular-art/
const POPULAR_ARTISTS = [
  { name: 'MONET', image: '/popular-art/monet.jpg' },
  { name: 'KLIMT', image: '/popular-art/klimt.jpg' },
  { name: 'MATISSE', image: '/popular-art/matisse.jpg' },
  { name: 'VAN GOGH', image: '/popular-art/gogh.webp' },
  { name: 'PICASSO', image: '/popular-art/picasso.jpg' },
  { name: 'DA VINCI', image: '/popular-art/davinci.jpg' },
  { name: 'STILL LIFES', image: '/popular-art/still-life.jpg' },
  { name: 'LANDSCAPES', image: '/popular-art/landscape.jpg' },
  { name: 'PORTRAITS', image: '/popular-art/portrait.jpg' },
];

const ART_OF_THE_DAY = [
  {
    title: 'The Peasant Wedding',
    artist: 'PIETER BRUEGEL',
    image: '/image/bruegel_placeholder.jpg',
  },
  {
    title: 'Water Lilies',
    artist: 'CLAUDE MONET',
    image: '/image/monet_water_placeholder.jpg',
  },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // --- Rotators ---
  useEffect(() => {
    const artTimer = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % ART_OF_THE_DAY.length);
    }, 10000);

    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % FUN_FACTS_DATA.length);
    }, 6000);

    return () => {
      clearInterval(artTimer);
      clearInterval(factTimer);
    };
  }, []);

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-white text-black font-sans`}>
      {/* --- HEADER SECTION --- */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Row: Logo | Search | Icons */}
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative">
          {/* LEFT: Logo [cite: 5] */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex flex-col items-center group">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image src="/artmasons_logo.png" alt="Art Masons Seal" fill className="object-contain" priority />
              </div>
              <span className="mt-2 font-serif text-base md:text-lg font-bold tracking-widest text-[#800000] text-center">ART MASONS</span>
            </div>
          </div>

          {/* CENTER: Search Bar [cite: 7] */}
          <div className="flex-1 w-full relative group z-20">
            <div className={`flex items-center border rounded-sm overflow-hidden bg-white w-full`} style={{ borderColor: THEME_RED }}>
              <input
                type="text"
                placeholder="Search For Paintings"
                className="w-full px-4 py-3 outline-none text-sm placeholder-gray-400 font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="p-3 hover:bg-gray-100 transition-colors">
                <Search size={22} className="text-black" />
              </button>
            </div>

            {/* Helper Text - Positioned Absolutely to fix alignment bug [cite: 12] */}
            <div className="absolute top-full left-0 w-full text-[10px] text-gray-400 mt-1 text-center hidden md:block">
              Type Artist Name or Art Name to find from Top 100 Gallery & Artists A-Z
            </div>
          </div>

          {/* RIGHT: UAE Flag & Cart [cite: 14] */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden shadow-sm border border-gray-200" title="UAE">
              <div className="absolute inset-y-0 left-0 w-1/4 bg-red-600"></div>
              <div className="absolute top-0 right-0 w-3/4 h-1/3 bg-green-600"></div>
              <div className="absolute bottom-0 right-0 w-3/4 h-1/3 bg-black"></div>
              <div className="absolute top-1/3 right-0 w-3/4 h-1/3 bg-white"></div>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
              <div className="relative">
                <ShoppingBag size={28} color="black" strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* 2nd Row: Navigation Menu [cite: 17] */}
        <div className={`bg-white border-t border-gray-100 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 py-3 font-serif text-sm md:text-base tracking-wide uppercase text-gray-800">
              {['Artists A-Z', 'Top 100 Paintings', 'Our Quality', 'Framing Paintings', 'About Us'].map((item) => (
                <li key={item} className="cursor-pointer hover:text-[#800000] transition-colors relative group">
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#800000] transition-all duration-300 group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION [cite: 18-32] --- */}
      <section className="flex flex-col md:flex-row w-full min-h-[600px] border-b border-gray-200">
        {/* LEFT: Seal of Assurance Text [cite: 19] */}
        <div className="w-full md:w-1/3 bg-white p-8 md:p-12 flex flex-col justify-center border-r border-gray-200">
          <div className="mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2">ART OF MASONS</h2>
            <h3 className="font-serif text-xl md:text-2xl italic text-[#800000]">SEAL OF ASSURANCE</h3>
          </div>

          <ul className="space-y-4 font-serif text-lg text-gray-800">
            {ASSURANCE_POINTS.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#800000] flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Art of the Day [cite: 29] */}
        <div className="w-full md:w-2/3 relative bg-gray-50 group overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArtIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="w-full h-full bg-gray-200 relative">
                <Image src={ART_OF_THE_DAY[currentArtIndex].image} alt={ART_OF_THE_DAY[currentArtIndex].title} fill className="object-cover" priority />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 w-full bg-white/90 py-4 text-center z-20 backdrop-blur-sm border-t border-gray-200">
            <span className="font-sans text-xs uppercase tracking-[0.2em] block text-gray-500 mb-1">Art of the Day</span>
            <h2 className="font-serif text-2xl text-black">{ART_OF_THE_DAY[currentArtIndex].title}</h2>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer">
            <div className="text-center text-white p-6 border-2 border-white">
              <p className="font-serif text-3xl italic mb-2">{ART_OF_THE_DAY[currentArtIndex].artist}</p>
              <p className="font-sans text-xs uppercase tracking-widest">Click to View Details</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- POPULAR ART STRIP [cite: 33] --- */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h3 className="text-center font-sans text-xl tracking-widest uppercase mb-6 font-bold">Popular Art</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {POPULAR_ARTISTS.map((artist, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group cursor-pointer">
                <Image src={artist.image} alt={artist.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                {/* Label Positioning: Bottom Inside */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-3">
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="relative z-10 text-white font-serif font-bold tracking-wider text-sm text-center">{artist.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FUN FACTS & ABOUT US [cite: 57-117] --- */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
        {/* LEFT: Fun Facts (Bold Deep Red, No Border) [cite: 58] */}
        <div className="w-full md:w-1/2">
          <h3 className="font-sans text-2xl font-bold mb-6 text-center md:text-left uppercase">Fun Facts</h3>
          <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center text-center relative bg-white shadow-lg">
            <div className="absolute top-2 left-2 text-[#800000] opacity-20">
              <span className="font-serif text-6xl">“</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFactIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-2xl md:text-3xl leading-relaxed text-[#800000] font-bold"
              >
                {FUN_FACTS_DATA[currentFactIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: About Us [cite: 110] */}
        <div className="w-full md:w-1/2">
          <h3 className="font-sans text-2xl font-bold mb-6 text-center md:text-left uppercase">About Us</h3>
          <div className="space-y-6 font-serif text-gray-600 leading-relaxed text-justify">
            <p>
              You can have a Monet or Renoir in your own home or office which can be exactly like the original masterpiece in the museum. ART MASONS reproductions are your opportunity that comes as near to the original masterpiece as possible! [cite: 111]
            </p>
            <p>
              Our artworks are absolutely and completely hand-painted with oil on a blank linen canvas. Everybody in our team of artists is an exceptional master in his own field, and this makes it possible for us reproduce our paintings to the level of perfection and style of the old masters. [cite: 112]
            </p>
            <p>
              We have recorded on video the process of reproduction of hundreds of paintings created in our studio. You can watch these videos and be persuaded in the high quality of our work. We are not wholesalers, and we do not have varying levels of quality like our competitors. [cite: 115]
            </p>
          </div>
        </div>
      </section>

      {/* --- ARTISTS A-Z [cite: 258] --- */}
      <section className="bg-gray-50 py-20 border-t border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-3xl md:text-4xl mb-4">Explore Our Curated Collection of Artists</h3>
          <p className="max-w-3xl mx-auto font-sans text-sm text-gray-500 mb-12 leading-relaxed">
            Discover a rich collection of art from renowned painters throughout history, organized by the artist's last name for your convenience. Browse through masterpieces by iconic figures such as Renoir, van Gogh, and Caravaggio. [cite: 260]
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`
                  w-10 h-10 md:w-12 md:h-12 border font-serif text-xl flex items-center justify-center transition-all duration-200 rounded-sm
                  ${selectedLetter === letter ? 'bg-[#800000] text-white border-[#800000] shadow-md' : 'border-gray-300 bg-white hover:border-[#800000] hover:text-[#800000]'}
                `}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS [cite: 122] --- */}
      <section className="py-20 container mx-auto px-4">
        <h3 className="font-serif text-3xl text-center mb-12">Collector Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.slice(0, 3).map((text, i) => (
            <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-[#800000] mb-4">★★★★★</div>
              <p className="font-serif italic text-gray-700">"{text}"</p>
              <p className="mt-4 font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Collector</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER [cite: 172-257] --- */}
      <footer className="bg-[#1a1a1a] text-white pt-20 pb-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* 1. About Info [cite: 198] */}
          <div>
            <h4 className="font-serif text-xl mb-6">About Art Masons</h4>
            <p className="font-sans text-gray-400 text-sm leading-relaxed mb-6">
              We are a small, highly specialised team of artists, academically trained according to European standards, and we never compromise on detail, technique, or materials. [cite: 176]
            </p>
            <div className="flex gap-4">
              <Instagram className="text-gray-400 hover:text-white cursor-pointer" size={20} />
              <Facebook className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            </div>
          </div>

          {/* 2. Customer Service [cite: 173] */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Customer Service</h4>
            <ul className="space-y-3 font-serif text-gray-300">
              <li>
                <Link href="/faqs" className="hover:text-white cursor-pointer transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white cursor-pointer transition-colors">Return Policy</Link>
              </li>
              <li>
                <Link href="/delivery-information" className="hover:text-white cursor-pointer transition-colors">Delivery Information</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* 3. Contact [cite: 236] */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="mailto:info@artmasons.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <Mail size={18} /> info@artmasons.com
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} /> +971 56 170 4788
              </div>
            </div>
          </div>

          {/* 4. Payment & Newsletter [cite: 242-257] */}
          <div className="flex flex-col gap-8">
            {/* Secure Online Payment */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Secure Online Payment</h4>
              <div className="flex gap-2">
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <span className="text-blue-900 font-bold text-[10px] italic">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <div className="flex -space-x-1 relative">
                    <div className="w-3 h-3 rounded-full bg-red-600 opacity-90"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-500 opacity-90"></div>
                  </div>
                </div>
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <span className="text-blue-500 font-bold text-[8px] uppercase">AMEX</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Newsletter</h4>
              <div className="flex flex-col gap-3">
                <input type="email" placeholder="Your email" className="bg-white text-black px-4 py-2 outline-none rounded-sm w-full font-sans text-sm" />
                <button className="bg-[#800000] text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-[#600000] transition-colors rounded-sm font-sans">Subscribe*</button>
                <p className="text-[10px] text-gray-500 font-sans leading-tight">*Subscribe to receive special offers, updates and news.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Follow Us [cite: 246] */}
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Trade Mark */}
          <p className="text-xs text-gray-500 font-sans">Trade Mark 1990/2026 Art Masons. All rights reserved.</p>

          {/* Right: Follow Us Section */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-widest">Follow Us</span>
            <div className="flex items-center gap-4">
              {/* Facebook Placeholder */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook (Coming Soon)">
                <Facebook size={18} />
              </a>

              {/* Instagram */}
              <a href="https://instagram.com/Theartmasons" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1" title="@Theartmasons">
                <Instagram size={18} />
              </a>

              {/* TikTok Placeholder */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="TikTok (Coming Soon)">
                <Video size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}