'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Inter } from 'next/font/google';
import { 
  ArrowRight, 
  Instagram, 
  Mail, 
  Facebook, 
  Brush,
  Play,
  Star,
  Phone,
  CheckCircle
} from 'lucide-react';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// --- Mock Data ---
const ART_OF_THE_DAY = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "VINCENT VAN GOGH",
    desc: "A moderate interpretation of the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence.",
    image: "/image/1.jpg" 
  },
  {
    id: 2,
    title: "Girl with a Pearl Earring",
    artist: "JOHANNES VERMEER",
    desc: "Often referred to as the 'Mona Lisa of the North', this tronie depicts a European girl wearing an exotic dress.",
    image: "/image/2.jpg"
  }
];

const FUN_FACTS = [
  "Did you know? Van Gogh only sold one painting during his lifetime.",
  "Picasso could draw before he could walk.",
  "The Mona Lisa has her own mailbox in the Louvre because she receives so many love letters."
];

const FAMOUS_WORKS = [
  { id: 1, title: "Mona Lisa", date: "1503", src: "/image/1.jpg" },
  { id: 2, title: "The Kiss", date: "1908", src: "/image/2.jpg" },
  { id: 3, title: "Guernica", date: "1937", src: "/image/3.jpg" },
  { id: 4, title: "Creation of Adam", date: "1512", src: "/image/4.jpg" },
  { id: 5, title: "Mona Lisa", date: "1503", src: "/image/5.jpg" },
  { id: 6, title: "The Kiss", date: "1908", src: "/image/6.jpg" },
  { id: 7, title: "Guernica", date: "1937", src: "/image/7.jpg" },
  { id: 8, title: "Creation of Adam", date: "1512", src: "/image/8.jpg" },
    { id: 9, title: "Mona Lisa", date: "1503", src: "/image/9.jpg" },
  { id: 10, title: "The Kiss", date: "1908", src: "/image/10.jpg" },
  { id: 11, title: "Guernica", date: "1937", src: "/image/11.jpg" },
  { id: 12, title: "Creation of Adam", date: "1512", src: "/image/12.jpg" },
];

const PLACED_ART = [
  { id: 1, type: 'video', title: "Villa in Jumeirah", location: "Dubai", src: "/image/a.1.jpg" },
  { id: 2, type: 'image', title: "Modern Loft", location: "New York", src: "/image/a.2.jpg" },
  { id: 3, type: 'image', title: "Private Study", location: "London", src: "/image/a.3.jpg" },
];

const REVIEWS = [
  { id: 1, user: "Sarah Jenkins", location: "Dubai", text: "The linen canvas quality is undeniable. It transformed my living room entirely.", rating: 5 },
  { id: 2, user: "Marcus T.", location: "Abu Dhabi", text: "Professional service from start to finish. The custom sizing was perfect for my wall.", rating: 5 },
  { id: 3, user: "Elena R.", location: "London", text: "Arrived safely and looks like a museum piece. Highly recommended.", rating: 5 },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // --- Rotators ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % ART_OF_THE_DAY.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- Actions ---
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    alert("Added to cart! (Demo)");
    setCartCount(prev => prev + 1);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    // In a real app, this would filter the list below
    alert(`Filtering artists by letter: ${letter}`);
  };

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#F9F7F2] text-black`}>
      
      {/* --- Navigation --- */}
      <nav className="flex justify-between items-center px-8 py-6 border-b-2 border-black sticky top-0 bg-[#F9F7F2] z-50">
        <h1 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-3xl font-serif font-bold tracking-tighter cursor-pointer"
        >
          ART MASONS.
        </h1>
        <div className="hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase">
          <button onClick={() => handleScrollTo('famous-works')} className="hover:underline decoration-2 underline-offset-4 transition-all">Gallery</button>
          <button onClick={() => handleScrollTo('artists')} className="hover:underline decoration-2 underline-offset-4 transition-all">Artists</button>
          <button onClick={() => handleScrollTo('reviews')} className="hover:underline decoration-2 underline-offset-4 transition-all">Reviews</button>
          <button onClick={() => handleScrollTo('in-situ')} className="hover:underline decoration-2 underline-offset-4 transition-all">In Situ</button>
        </div>
        <button 
          onClick={() => alert("Cart is currently empty (Demo)")}
          className="border-2 border-black px-6 py-2 font-sans text-sm font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
        >
          CART ({cartCount})
        </button>
      </nav>

      {/* --- Hero: Art of the Day --- */}
      <section className="relative w-full h-[85vh] flex flex-col md:flex-row border-b-2 border-black">
        <div className="relative w-full md:w-2/3 h-full overflow-hidden bg-[#EAEAEA] border-r-2 border-black group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArtIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image 
                src={ART_OF_THE_DAY[currentArtIndex].image} 
                alt={ART_OF_THE_DAY[currentArtIndex].title}
                fill
                className="object-cover"
                priority
              />
              {/* Texture Overlay */}
              <div className="absolute inset-0 bg-black/5 pointer-events-none mix-blend-multiply" />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute top-4 left-4 bg-black/80 px-4 py-1 text-xs text-white uppercase tracking-widest backdrop-blur-md z-10 border border-white/20">
            Art of the Day
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-center px-8 py-12 md:px-12 bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArtIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-5xl md:text-6xl italic leading-tight mb-4">
                {ART_OF_THE_DAY[currentArtIndex].title}
              </h2>
              <p className="font-sans text-sm font-bold tracking-[0.2em] mb-8 text-gray-500">
                {ART_OF_THE_DAY[currentArtIndex].artist}
              </p>
              <p className="font-serif text-lg leading-relaxed text-gray-800 mb-8 border-l-2 border-black pl-4">
                {ART_OF_THE_DAY[currentArtIndex].desc}
              </p>
              <button 
                onClick={handleAddToCart}
                className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest group border-b border-black pb-1 hover:pb-2 transition-all hover:text-orange-700 hover:border-orange-700"
              >
                Purchase Print <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform"/>
              </button>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-8 left-12 flex gap-2">
            {ART_OF_THE_DAY.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentArtIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentArtIndex ? 'bg-black' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Fun Facts Widget --- */}
      <section className="bg-black text-[#F9F7F2] py-4 overflow-hidden border-b-2 border-black">
        <div className="container mx-auto px-4 flex justify-center items-center text-center">
            <span className="font-serif italic text-xl mr-4 opacity-50 flex items-center gap-2">
              <Brush size={18} /> Note:
            </span>
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentFactIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-sans text-sm md:text-base tracking-wide"
                >
                    {FUN_FACTS[currentFactIndex]}
                </motion.p>
            </AnimatePresence>
        </div>
      </section>

      {/* --- A-Z Artists --- */}
      <section id="artists" className="py-20 px-4 md:px-12 border-b-2 border-black bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-serif text-3xl mb-10 text-center flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-black"></span> 
            Artist Directory 
            <span className="w-12 h-[1px] bg-black"></span>
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET.map((letter) => (
              <button 
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`
                  w-10 h-10 md:w-12 md:h-12 border font-serif text-xl flex items-center justify-center transition-all duration-200
                  ${selectedLetter === letter 
                    ? 'bg-black text-white border-black scale-110 shadow-lg' 
                    : 'border-gray-300 hover:border-black hover:bg-black hover:text-white'}
                `}
              >
                {letter}
              </button>
            ))}
          </div>
          <p className="text-center mt-6 text-xs text-gray-400 font-sans uppercase tracking-widest">
            {selectedLetter ? `Showing artists for '${selectedLetter}'` : 'Select a letter to view artists'}
          </p>
        </div>
      </section>

      {/* --- 100 Famous Artworks --- */}
      <section id="famous-works" className="py-24 px-4 bg-[#F9F7F2] border-b-2 border-black scroll-mt-20">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-4">
                <h3 className="font-serif text-4xl md:text-5xl">Famous Artworks</h3>
                <a href="#" className="hidden md:flex items-center gap-2 font-sans text-xs font-bold hover:opacity-70 transition-opacity">
                   VIEW ALL 100 <ArrowRight size={14} />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FAMOUS_WORKS.map((work) => (
                    <div 
                      key={work.id} 
                      onClick={() => alert(`Opening details for ${work.title}`)}
                      className="group relative aspect-[3/4] overflow-hidden border-2 border-transparent hover:border-black transition-all duration-300 p-3 bg-white shadow-sm hover:shadow-xl cursor-pointer"
                    >
                        <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                             <Image 
                                src={work.src} 
                                alt={work.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4 text-center z-10">
                                <span className="font-serif text-2xl italic mb-2">{work.title}</span>
                                <span className="font-sans text-xs tracking-widest">{work.date}</span>
                                <span className="mt-4 px-4 py-2 border border-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                  View Details
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Mobile View All Button */}
            <div className="mt-12 text-center md:hidden">
              <button className="border-2 border-black px-8 py-3 font-sans text-xs font-bold uppercase w-full">View All</button>
            </div>
        </div>
      </section>

      {/* --- Placed Art / In Situ --- */}
      <section id="in-situ" className="py-24 px-4 bg-white border-b-2 border-black scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl italic mb-4">Art in Situ</h3>
            <p className="font-sans text-gray-500 tracking-widest text-xs uppercase">Curated Homes & Installations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLACED_ART.map((item) => (
              <div 
                key={item.id} 
                onClick={() => item.type === 'video' ? alert("Playing video demo...") : alert("Zooming image...")}
                className="relative group cursor-pointer"
              >
                {/* Frame Effect */}
                <div className="aspect-square bg-[#EAEAEA] border-2 border-black p-4 relative overflow-hidden transition-colors group-hover:bg-gray-900">
                  <div className="w-full h-full bg-gray-200 relative overflow-hidden">
                    <Image 
                      src={item.src} 
                      alt={item.title} 
                      fill 
                      className="object-cover opacity-90 group-hover:opacity-60 transition-opacity"
                    />
                    
                    {/* Video Play Button Overlay if Type is Video */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                          <Play size={20} className="ml-1 text-black" fill="black" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Caption */}
                <div className="mt-4 flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-serif text-lg">{item.title}</span>
                  <span className="font-sans text-xs uppercase text-gray-500">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Reviews --- */}
      <section id="reviews" className="py-20 px-4 bg-[#F9F7F2] border-b-2 border-black scroll-mt-20">
        <div className="max-w-7xl mx-auto">
           <h3 className="font-serif text-3xl mb-12 text-center">Collector Reviews</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {REVIEWS.map((review) => (
                <div key={review.id} className="flex flex-col text-center p-6 border border-gray-300 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                   <div className="flex justify-center gap-1 mb-4 text-black">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="black" />
                      ))}
                   </div>
                   <p className="font-serif text-lg italic leading-relaxed mb-6">"{review.text}"</p>
                   <div className="mt-auto">
                     <p className="font-sans text-xs font-bold uppercase tracking-widest">{review.user}</p>
                     <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                        {review.location} <CheckCircle size={10} className="text-blue-500"/>
                     </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-white pt-20 pb-10 border-t-4 border-[#333]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
            
            {/* Brand / About */}
            <div className="space-y-6">
                <h4 className="font-serif text-2xl font-bold">ART MASONS.</h4>
                <p className="font-sans text-gray-400 text-sm leading-relaxed max-w-xs">
                    Hand-painted, museum-quality art on linen canvas. Customizable sizes, affordable prices.
                </p>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
                <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Explore</h5>
                <ul className="space-y-3 font-serif text-lg text-gray-300">
                    <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white hover:translate-x-2 inline-block transition-transform">Home</button></li>
                    <li><button onClick={() => handleScrollTo('famous-works')} className="hover:text-white hover:translate-x-2 inline-block transition-transform">Famous Artworks</button></li>
                    <li><button onClick={() => handleScrollTo('in-situ')} className="hover:text-white hover:translate-x-2 inline-block transition-transform">In Situ Gallery</button></li>
                    <li><a href="mailto:contact@artmasons.com" className="hover:text-white hover:translate-x-2 inline-block transition-transform">Contact</a></li>
                </ul>
            </div>

            {/* Social / Contact */}
            <div className="space-y-6">
                 <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">Connect</h5>
                 
                 {/* Updated Phone Number */}
                 <div className="flex items-center gap-3 group cursor-pointer">
                   <Phone size={18} className="text-white group-hover:rotate-12 transition-transform"/>
                   <a href="tel:+971561704788" className="font-serif text-xl hover:underline underline-offset-4">+971 56 170 4788</a>
                 </div>

                 <p className="font-serif italic text-gray-400">DM for more info!</p>
                 
                 <div className="flex gap-4">
                    <a href="#" className="p-2 border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all rounded-full">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="p-2 border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all rounded-full">
                        <Facebook size={20} />
                    </a>
                    <a href="#" className="p-2 border border-gray-700 hover:border-white hover:bg-white hover:text-black transition-all rounded-full">
                        <Mail size={20} />
                    </a>
                 </div>
            </div>
        </div>
        
        {/* Bottom Bar: Copyright & Payment Methods */}
        <div className="max-w-7xl mx-auto mt-20 px-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-sans">
            <p>© {new Date().getFullYear()} Art Masons. All rights reserved.</p>
            
            {/* Payment Methods Indicators */}
            <div className="flex items-center gap-6 mt-4 md:mt-0">
               <div className="flex items-center gap-2">
                  <span className="uppercase tracking-widest text-[10px]">We Accept:</span>
                  <div className="flex gap-2 text-white">
                    <div className="px-2 py-1 border border-gray-700 rounded bg-gray-900 font-bold italic">VISA</div>
                    <div className="px-2 py-1 border border-gray-700 rounded bg-gray-900 font-bold">MC</div>
                    <div className="px-2 py-1 border border-gray-700 rounded bg-gray-900 font-bold">AMEX</div>
                  </div>
               </div>
            </div>
        </div>
      </footer>
    </main>
  );
}