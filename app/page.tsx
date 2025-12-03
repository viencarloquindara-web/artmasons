'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import PageTransition from './components/PageTransition';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// --- Theme Colors ---
const THEME_RED = '#800000';

// --- DATA ---
const ASSURANCE_POINTS = [
  'Museum Quality',
  'Hand Painted',
  'Certified Art Masons',
  'Refined Oil Paints',
  '100% Linen Canvases',
];

const FUN_FACTS_DATA = [
  'Leonardo da Vinci could write with one hand while drawing with the other',
  'Van Gogh sold only one painting in his lifetime',
  'Michelangelo disliked painting but created the Sistine Chapel ceiling anyway',
  'Picasso could draw before he could speak',
  'Monet painted the same scenes at different times of day to capture light changes',
  'The Mona Lisa has no visible eyelashes or eyebrows',
  'Rembrandt created over 90 self-portraits',
  'Salvador Dalí kept ants and crutches as recurring symbols',
  'Frida Kahlo painted most of her works lying in bed after injuries',
  'Caravaggio was known for bar fights and fleeing authorities',
  'Vermeer used optical devices like a camera obscura for precision',
  'Botticelli’s Birth of Venus was once considered too scandalous to display',
  'The Girl with a Pearl Earring is often called the “Mona Lisa of the North”',
  'Banksy’s identity is still unknown',
  'Klimt covered his studio windows because he preferred working in dim light',
  'Kandinsky believed he could hear colors and see music (synesthesia)',
  'Jackson Pollock’s drip technique came from swinging paint cans over canvas',
  'Rodin was rejected three times by the art school he dreamed of',
  'Raphael died at only 37 but left more than 100 major works',
  'The Scream’s sky was inspired by a real volcanic sunset in Norway',
  'Monet nearly went blind while painting his water lilies series',
  'Degas preferred sculpture but became famous for his ballet dancers',
  'Georgia O’Keeffe painted skyscrapers before she painted flowers',
  'Basquiat started as a graffiti artist under the name SAMO',
  'Andy Warhol kept everything he owned in “time capsules”',
  'Renoir continued painting even when arthritis twisted his hands',
  'Cézanne destroyed many of his own paintings in frustration',
  'Rembrandt went bankrupt despite his fame',
  'Leonardo dissected human bodies to understand anatomy',
  'The Last Supper survived bombings during WWII with only a wall tarp',
  'Van Gogh painted over many canvases—X-rays reveal hidden works',
  'Manet’s exhibitions were repeatedly rejected by the French Academy',
  'Hokusai changed his name more than 30 times',
  'The Thinker was originally part of a much larger doorway sculpture',
  'Botticelli burned some of his own paintings during the “Bonfire of the Vanities”',
  'Michelangelo signed only one sculpture: the Pietà',
  'Caravaggio used real street people as models for saints',
  'The Mona Lisa was stolen in 1911 and became famous because of it',
  'Monet’s garden at Giverny was man-made for his art',
  'Picasso painted over 50,000 artworks in his lifetime',
  'Van Gogh often ate paint, believing it improved his mood',
  'Frida Kahlo kept a pet deer, monkey, and parrot',
  'Klimt’s The Kiss contains real gold leaf',
  'David Hockney embraced digital painting before it was mainstream',
  'Mondrian refused curves in his artworks—even his furniture was geometric',
  'Vermeer used only about 20 pigments in all his works',
  'Turner strapped himself to ship masts during storms for inspiration',
  'Michelangelo wrote secret poems mocking his own backaches from painting ceilings',
  'Warhol survived an assassination attempt in 1968',
  'Basquiat’s crown symbol represented “kings” he admired in art and Black culture',
];

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
  'Art Masons delivered flawless craftsmanship.',
  'I trust Art Masons with every commission — they never disappoint.',
  'Art Masons brings old masterpieces back to life.',
  'The texture and realism from Art Masons are unbelievable.',
  'Art Masons exceeded all my expectations.',
  'I feel like I own a museum piece — thank you, Art Masons.',
  'Art Masons has the very best artists I’ve ever worked with.',
  'Every stroke shows the passion behind Art Masons.',
  'Brilliant work — Art Masons truly understands fine art.',
  'Art Masons delivered my painting in perfect condition and perfect quality.',
  'You can immediately see the expertise at Art Masons.',
  'My Art Masons piece is now the centerpiece of my living room.',
  'Exceptional craftsmanship — Art Masons is world class.',
  'The painting looks identical to the original reference — Art Masons nailed it.',
  'If you want premium art, Art Masons is the only choice.',
  'Art Masons created a piece that feels alive with emotion.',
  'I trust Art Masons because their quality is consistent and outstanding.',
  'My Art Masons painting has transformed the entire room.',
  'The realism is so powerful — Art Masons are true masters.',
  'Art Masons made the entire process smooth and professional.',
  'Every detail is perfect. Art Masons is the real deal.',
  'The texture, color, and depth from Art Masons are incredible.',
  'Art Masons delivered exactly what I envisioned and more.',
  'A truly luxurious experience — Art Masons understands art lovers.',
  'I own three pieces from Art Masons and each one is perfection.',
  'The quality from Art Masons rivals any gallery I’ve visited.',
  'Art Masons captured the spirit of the original painting beautifully.',
  'The craftsmanship at Art Masons is second to none.',
  'I am blown away by the accuracy of my Art Masons replica.',
  'Professional, talented, and reliable — Art Masons is exceptional.',
  'My Art Masons artwork feels like a treasure I will keep forever.',
  'The gold-leaf work from Art Masons is absolutely exquisite.',
  'Art Masons makes art collectors out of everyone.',
  'From communication to delivery, Art Masons was perfect.',
  'This is the best replica art I’ve ever purchased — thank you, Art Masons.',
  'Every Art Masons painting feels rich, elegant, and timeless.',
  'I can’t stop staring at my Art Masons piece — it’s mesmerizing.',
  'Art Masons delivers gallery-level quality at an incredible standard.',
  'I instantly knew my Art Masons artwork was something special.',
  'Art Masons brings luxury and authenticity together beautifully.'
];

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
    title: 'Starry Night',
    artist: 'VINCENT VAN GOGH',
    image: '/image/starry-night.webp', 
    slug: 'starry-night-vincent-van-gogh',
  },
];

const NAV_ITEMS = [
  { label: 'Artists A-Z', href: '/artists-a-z' },
  { label: 'Top 100 Paintings', href: '#' },
  { label: 'Our Quality', href: '#' },
  { label: 'Frame & Size Art', href: '#' },
  { label: 'About Us', href: '#' },
];

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const extendedArtists = [...POPULAR_ARTISTS, ...POPULAR_ARTISTS];

  useEffect(() => {
    setIsClient(true);
    
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    setCurrentArtIndex(dayOfYear % ART_OF_THE_DAY.length);
    setCurrentFactIndex(dayOfYear % FUN_FACTS_DATA.length);

    const testimonialTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 3) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scrollStep = () => {
      if (!isCarouselPaused) {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1; 
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isCarouselPaused]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const currentTestimonials = [0, 1, 2].map((offset) => {
    const index = (testimonialIndex + offset) % TESTIMONIALS_DATA.length;
    return TESTIMONIALS_DATA[index];
  });

  const currentArt = ART_OF_THE_DAY[currentArtIndex];

  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black font-serif lining-nums`}>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- HEADER SECTION --- */}
      <header className="relative z-50 bg-white pt-6 pb-4 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-end gap-12">
          
          <div className="flex-shrink-0 flex flex-col items-center justify-end w-auto md:w-56 cursor-pointer pb-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-32 h-32 md:w-44 md:h-44">
              <Image src="/artmasons_logo.png" alt="Art Masons Seal" fill className="object-contain" priority />
            </div>
          </div>

          <div className="flex-1 flex flex-col w-full justify-end">
            <div className="flex flex-col md:flex-row items-center gap-6 relative w-full">
              <div className="flex-1 w-full relative z-20">
                <div className={`flex items-center border rounded-sm overflow-hidden bg-white w-full`} style={{ borderColor: THEME_RED }}>
                  <input
                    type="text"
                    placeholder="Search For Paintings"
                    className="w-full px-4 py-3 outline-none text-sm placeholder-gray-400 font-serif"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="p-3 hover:bg-gray-100 transition-colors">
                    <Search size={22} className="text-black" />
                  </button>
                </div>
                
                <div className="absolute top-full left-0 w-full text-[10px] text-gray-400 mt-2 text-center hidden md:block font-serif">
                  Type Artist Name or Art Name to find from Top 100 Gallery & Artists A-Z
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

                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>

            <div className="h-10 hidden md:block"></div>

            <div className={`w-full ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              <nav>
                <ul className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 py-2 font-serif text-base md:text-lg tracking-wide uppercase font-bold w-full">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label} className="cursor-pointer text-[#800000] hover:text-black transition-colors relative group whitespace-nowrap">
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <PageTransition>
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col md:flex-row w-full min-h-[600px] border-b border-gray-200">
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
              {isClient && (
                <div className="w-full h-full bg-gray-200 relative">
                  <Image src={currentArt.image} alt={currentArt.title} fill className="object-cover" priority />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 w-full bg-white/90 py-4 text-center z-20 backdrop-blur-sm border-t border-gray-200">
            <span className="font-serif text-xs uppercase tracking-[0.2em] block text-gray-500 mb-1">Art of the Day</span>
            <h2 className="font-serif text-2xl text-black">
              {isClient ? currentArt.title : ''}
            </h2>
          </div>

          <Link href={isClient ? `/artworks/${currentArt.slug}` : '#'} className="absolute inset-0 z-30 cursor-pointer">
             <div className="w-full h-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white p-6 border-2 border-white">
                  <p className="font-serif text-3xl italic mb-2">
                    {isClient ? currentArt.artist : ''}
                  </p>
                  <p className="font-serif text-xs uppercase tracking-widest">Click to View Details</p>
                </div>
             </div>
          </Link>
        </div>
      </section>

      {/* --- POPULAR ART STRIP --- */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="relative group w-full">
            <button 
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <ChevronLeft size={32} />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar w-full"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              onTouchStart={() => setIsCarouselPaused(true)}
              onTouchEnd={() => setIsCarouselPaused(false)}
            >
              {extendedArtists.map((artist, i) => (
                <div key={`${artist.name}-${i}`} className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute top-2 left-2 bg-[#800000] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-20 shadow-sm rounded-sm">
                    Popular Art
                  </div>
                  <Image src={artist.image} alt={artist.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-3">
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="relative z-10 text-white font-serif font-bold tracking-wider text-sm text-center">{artist.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </section>

      {/* --- FUN FACTS & ABOUT US --- */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2">
          <h3 className="font-serif text-2xl font-bold mb-6 text-center md:text-left uppercase">FUN ART FACTS</h3>
          <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center text-center relative bg-white border-4 border-[#800000] shadow-sm">
            <div className="absolute top-2 left-2 text-[#800000] opacity-20">
              <span className="font-serif text-6xl">“</span>
            </div>
            {isClient && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-2xl md:text-3xl leading-relaxed text-[#800000] font-bold"
              >
                {FUN_FACTS_DATA[currentFactIndex]}
              </motion.p>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h3 className="font-serif text-2xl font-bold mb-6 text-center md:text-left uppercase">About Us</h3>
          <div className="space-y-6 font-serif text-gray-600 leading-relaxed text-justify">
            <p>
              You can have a Monet or Renoir in your own home or office which can be exactly like the original masterpiece in the museum. ART MASONS reproductions are your opportunity that comes as near to the original masterpiece as possible!
            </p>
            <p>
              Our artworks are absolutely and completely hand-painted with oil on a blank linen canvas. Everybody in our team of artists is an exceptional master in his own field, and this makes it possible for us reproduce our paintings to the level of perfection and style of the old masters.
            </p>
            <p>
              We have recorded on video the process of reproduction of hundreds of paintings created in our studio. You can watch these videos and be persuaded in the high quality of our work. We are not wholesalers, and we do not have varying levels of quality like our competitors. 
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Updated to fix Animation Warning) --- */}
      <section className="py-20 container mx-auto px-4">
        <h3 className="font-serif text-3xl text-center mb-12">Collector Testimonials</h3>
        
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {currentTestimonials.map((text, i) => (
                <div
                  key={i}
                  className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex text-[#800000] mb-4">★★★★★</div>
                    <p className="font-serif italic text-gray-700">"{text}"</p>
                  </div>
                  <p className="mt-4 font-serif text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Collector</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      </PageTransition>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1a1a1a] text-white pt-20 pb-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-serif text-xl mb-6">About Art Masons</h4>
            <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
              We are a small, highly specialised team of artists, academically trained according to European standards, and we never compromise on detail, technique, or materials.
            </p>
            <div className="flex gap-4">
              <Instagram className="text-gray-400 hover:text-white cursor-pointer" size={20} />
              <Facebook className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Customer Service</h4>
            <ul className="space-y-3 font-serif text-gray-300">
              <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/delivery-information" className="hover:text-white transition-colors">Delivery Information</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="mailto:info@artmasons.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors font-serif">
                <Mail size={18} /> info@artmasons.com
              </a>
              <div className="flex items-center gap-3 text-gray-300 font-serif">
                <Phone size={18} /> +971 56 170 4788
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Secure Online Payment</h4>
              <div className="flex gap-2">
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <span className="text-blue-900 font-bold text-[10px] italic font-serif">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <div className="flex -space-x-1 relative">
                    <div className="w-3 h-3 rounded-full bg-red-600 opacity-90"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-500 opacity-90"></div>
                  </div>
                </div>
                <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                  <span className="text-blue-500 font-bold text-[8px] uppercase font-serif">AMEX</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Newsletter</h4>
              <div className="flex flex-col gap-3">
                <input type="email" placeholder="Your email" className="bg-white text-black px-4 py-2 outline-none rounded-sm w-full font-serif text-sm" />
                <button className="bg-[#800000] text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-[#600000] transition-colors rounded-sm font-serif">Subscribe*</button>
                <p className="text-[10px] text-gray-500 font-serif leading-tight">*Subscribe to receive special offers, updates and news.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-serif">Trade Mark 1990/2026 Art Masons. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-widest font-serif">Follow Us</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="https://instagram.com/Theartmasons" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Video size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}