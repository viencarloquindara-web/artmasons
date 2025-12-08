"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import PageTransition from "./components/PageTransition";
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
} from "lucide-react";

// --- Fonts ---
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

// --- Theme Colors ---
const THEME_RED = "#800000";

// --- DATA ---
const ASSURANCE_POINTS = [
  "Museum Quality",
  "Hand Painted",
  "Certified Art Masons",
  "Refined Oil Paints",
  "100% Linen Canvases",
];

const FUN_FACTS_DATA = [
  "Leonardo da Vinci could write with one hand while drawing with the other",
  "Van Gogh sold only one painting in his lifetime",
  "Michelangelo disliked painting but created the Sistine Chapel ceiling anyway",
  "Picasso could draw before he could speak",
  "Monet painted the same scenes at different times of day to capture light changes",
  "The Mona Lisa has no visible eyelashes or eyebrows",
  "Rembrandt created over 90 self-portraits",
  "Salvador Dalí kept ants and crutches as recurring symbols",
  "Frida Kahlo painted most of her works lying in bed after injuries",
  "Caravaggio was known for bar fights and fleeing authorities",
  "Vermeer used optical devices like a camera obscura for precision",
  "Botticelli’s Birth of Venus was once considered too scandalous to display",
  "The Girl with a Pearl Earring is often called the “Mona Lisa of the North”",
  "Banksy’s identity is still unknown",
  "Klimt covered his studio windows because he preferred working in dim light",
  "Kandinsky believed he could hear colors and see music (synesthesia)",
  "Jackson Pollock’s drip technique came from swinging paint cans over canvas",
  "Rodin was rejected three times by the art school he dreamed of",
  "Raphael died at only 37 but left more than 100 major works",
  "The Scream’s sky was inspired by a real volcanic sunset in Norway",
  "Monet nearly went blind while painting his water lilies series",
  "Degas preferred sculpture but became famous for his ballet dancers",
  "Georgia O’Keeffe painted skyscrapers before she painted flowers",
  "Basquiat started as a graffiti artist under the name SAMO",
  "Andy Warhol kept everything he owned in “time capsules”",
  "Renoir continued painting even when arthritis twisted his hands",
  "Cézanne destroyed many of his own paintings in frustration",
  "Rembrandt went bankrupt despite his fame",
  "Leonardo dissected human bodies to understand anatomy",
  "The Last Supper survived bombings during WWII with only a wall tarp",
  "Van Gogh painted over many canvases—X-rays reveal hidden works",
  "Manet’s exhibitions were repeatedly rejected by the French Academy",
  "Hokusai changed his name more than 30 times",
  "The Thinker was originally part of a much larger doorway sculpture",
  "Botticelli burned some of his own paintings during the “Bonfire of the Vanities”",
  "Michelangelo signed only one sculpture: the Pietà",
  "Caravaggio used real street people as models for saints",
  "The Mona Lisa was stolen in 1911 and became famous because of it",
  "Monet’s garden at Giverny was man-made for his art",
  "Picasso painted over 50,000 artworks in his lifetime",
  "Van Gogh often ate paint, believing it improved his mood",
  "Frida Kahlo kept a pet deer, monkey, and parrot",
  "Klimt’s The Kiss contains real gold leaf",
  "David Hockney embraced digital painting before it was mainstream",
  "Mondrian refused curves in his artworks—even his furniture was geometric",
  "Vermeer used only about 20 pigments in all his works",
  "Turner strapped himself to ship masts during storms for inspiration",
  "Michelangelo wrote secret poems mocking his own backaches from painting ceilings",
  "Warhol survived an assassination attempt in 1968",
  "Basquiat’s crown symbol represented “kings” he admired in art and Black culture",
];

const TESTIMONIALS_DATA = [
  "Art Masons delivered a masterpiece far beyond what I imagined.",
  "The quality from Art Masons is simply unmatched.",
  "Everyone who visits my home compliments my Art Masons painting.",
  "Art Masons truly sets the standard for museum-quality work.",
  "I’ve never seen replicas done this perfectly — Art Masons is elite.",
  "The attention to detail from Art Masons is extraordinary.",
  "Art Masons turned my space into a gallery.",
  "The colors from Art Masons feel alive — absolutely stunning.",
  "My home finally feels complete thanks to Art Masons.",
  "Art Masons delivered flawless craftsmanship.",
  "I trust Art Masons with every commission — they never disappoint.",
  "Art Masons brings old masterpieces back to life.",
  "The texture and realism from Art Masons are unbelievable.",
  "Art Masons exceeded all my expectations.",
  "I feel like I own a museum piece — thank you, Art Masons.",
  "Art Masons has the very best artists I’ve ever worked with.",
  "Every stroke shows the passion behind Art Masons.",
  "Brilliant work — Art Masons truly understands fine art.",
  "Art Masons delivered my painting in perfect condition and perfect quality.",
  "You can immediately see the expertise at Art Masons.",
  "My Art Masons piece is now the centerpiece of my living room.",
  "Exceptional craftsmanship — Art Masons is world class.",
  "The painting looks identical to the original reference — Art Masons nailed it.",
  "If you want premium art, Art Masons is the only choice.",
  "Art Masons created a piece that feels alive with emotion.",
  "I trust Art Masons because their quality is consistent and outstanding.",
  "My Art Masons painting has transformed the entire room.",
  "The realism is so powerful — Art Masons are true masters.",
  "Art Masons made the entire process smooth and professional.",
  "Every detail is perfect. Art Masons is the real deal.",
  "The texture, color, and depth from Art Masons are incredible.",
  "Art Masons delivered exactly what I envisioned and more.",
  "A truly luxurious experience — Art Masons understands art lovers.",
  "I own three pieces from Art Masons and each one is perfection.",
  "The quality from Art Masons rivals any gallery I’ve visited.",
  "Art Masons captured the spirit of the original painting beautifully.",
  "The craftsmanship at Art Masons is second to none.",
  "I am blown away by the accuracy of my Art Masons replica.",
  "Professional, talented, and reliable — Art Masons is exceptional.",
  "My Art Masons artwork feels like a treasure I will keep forever.",
  "The gold-leaf work from Art Masons is absolutely exquisite.",
  "Art Masons makes art collectors out of everyone.",
  "From communication to delivery, Art Masons was perfect.",
  "This is the best replica art I’ve ever purchased — thank you, Art Masons.",
  "Every Art Masons painting feels rich, elegant, and timeless.",
  "I can’t stop staring at my Art Masons piece — it’s mesmerizing.",
  "Art Masons delivers gallery-level quality at an incredible standard.",
  "I instantly knew my Art Masons artwork was something special.",
  "Art Masons brings luxury and authenticity together beautifully.",
];

const POPULAR_ARTISTS = [
  { name: "MONET", image: "/popular-art/monet.jpg" },
  { name: "KLIMT", image: "/popular-art/klimt.jpg" },
  { name: "MATISSE", image: "/popular-art/matisse.jpg" },
  { name: "VAN GOGH", image: "/popular-art/gogh.webp" },
  { name: "PICASSO", image: "/popular-art/picasso.jpg" },
  { name: "DA VINCI", image: "/popular-art/davinci.jpg" },
  { name: "STILL LIFES", image: "/popular-art/still-life.jpg" },
  { name: "LANDSCAPES", image: "/popular-art/landscape.jpg" },
  { name: "PORTRAITS", image: "/popular-art/portrait.jpg" },
];

// Simple slug generator (matches the one in `data/artworks.ts`)
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const ART_OF_THE_DAY = [
  { title: "The Breakfast", artist: "Wilem Van Aelst", image: "/image/the_breakfast.jpg" },
  { title: "Last Supper", artist: "Valentin De Boulogne", image: "/image/b/last_supper.jpg" },
  { title: "Still Life Grapes, A Roemer, A Silver Ewer And A Plate", artist: "Wilem Van Aelst", image: "/image/a/grapes_roemer.jpg" },
  { title: "Sunrise In Yalta", artist: "Ivan Konstantinovich Aivazovsky", image: "/image/a/sunrise_in_yalta.jpg" },
  { title: "The Bathers", artist: "Paul Cezanne", image: "/image/c/the_bathers.jpg" },
  { title: "Monte Sainte-Victoire", artist: "Paul Cezanne", image: "/image/c/sainte_victoire.jpg" },
  { title: "Piazzetta And The Doge's Palace", artist: "Giovanni Antonio Canal Canaletto", image: "/image/c/piazzetta.jpg" },
  { title: "The Market Scene", artist: "Pieter Aertsen", image: "/image/a/market_scene.jpg" },
  { title: "Venice Façade", artist: "William Merritt Chase", image: "/image/c/venice_facade.jpg" },
  { title: "Portrait of My Daughters", artist: "Frank Weston Benson", image: "/image/b/portrait_daughters.jpg" },
].map((a) => ({ ...a, slug: generateSlug(a.title) }));

// Placeholder Top 100 list. Images not yet available; logic implemented.
const TOP_100_ARTS = Array.from({ length: 100 }).map((_, i) => ({
  title: `Artwork #${i + 1}`,
  artist: `Artist #${i + 1}`,
  image: `/image/placeholder-${(i % 10) + 1}.webp`,
  slug: `artwork-${i + 1}`,
}));

const NAV_ITEMS = [
  { label: "Artists A-Z", href: "/artists-a-z" },
  { label: "Top 100 Paintings", href: "/top-100" },
  { label: "Our Quality", href: "/our-quality" },
  { label: "Frame & Size Art", href: "#" },
  { label: "About Us", href: "#" },
];

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [playTop100Random, setPlayTop100Random] = useState(false);
  const [top100Order, setTop100Order] = useState<number[]>([]);
  const [isTop100AutoPlay, setIsTop100AutoPlay] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dailyAutoPaused, setDailyAutoPaused] = useState(false);

  // You might need to import useRef from 'react'
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

    // Default behavior: pick art of the day by day of year
    setCurrentArtIndex(dayOfYear % ART_OF_THE_DAY.length);
    // Initialize Top100 order (shuffled) but don't activate until user toggles
    setTop100Order(shuffle(Array.from({ length: TOP_100_ARTS.length }, (_, i) => i)));
    setCurrentFactIndex(dayOfYear % FUN_FACTS_DATA.length);

    const testimonialTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 3) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  // Ensure the featured art updates at local midnight each day while the page is open.
  useEffect(() => {
    if (!isClient) return;

    // If user has manually navigated, daily auto updates are paused until refresh
    if (dailyAutoPaused) return;

    const updateDailyIndex = () => {
      if (dailyAutoPaused) return;
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      setCurrentArtIndex(dayOfYear % ART_OF_THE_DAY.length);
      setCurrentFactIndex(dayOfYear % FUN_FACTS_DATA.length);
    };

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      updateDailyIndex();
      const dailyInterval = setInterval(updateDailyIndex, 24 * 60 * 60 * 1000);
      (window as any).__artMasons_dailyInterval = dailyInterval;
    }, msUntilMidnight);

    return () => {
      clearTimeout(midnightTimeout);
      if ((window as any).__artMasons_dailyInterval) {
        clearInterval((window as any).__artMasons_dailyInterval);
        delete (window as any).__artMasons_dailyInterval;
      }
    };
  }, [isClient, dailyAutoPaused]);

  // When top100 random playback is active, set up auto-advance timer
  useEffect(() => {
    if (!playTop100Random || !isTop100AutoPlay) return;

    const interval = setInterval(() => {
      setCurrentArtIndex((prev) => {
        const next = prev + 1;
        return next % TOP_100_ARTS.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [playTop100Random, isTop100AutoPlay]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // FIX 1: Explicitly type this as a number
    let animationFrameId: number;

    const scrollStep = () => {
      if (!isCarouselPaused) {
        // These errors will disappear once Step 1 is done
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
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  const currentTestimonials = [0, 1, 2].map((offset) => {
    const index = (testimonialIndex + offset) % TESTIMONIALS_DATA.length;
    return TESTIMONIALS_DATA[index];
  });

  // Helper to resolve current array depending on mode
  const currentArray = playTop100Random ? TOP_100_ARTS : ART_OF_THE_DAY;
  const currentArt = playTop100Random
    ? TOP_100_ARTS[top100Order[currentArtIndex] ?? currentArtIndex]
    : ART_OF_THE_DAY[currentArtIndex];

  function shuffle<T>(arr: T[]) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Programmatic toggle for Top 100 random mode (no UI button)
  function toggleTop100Random(enabling?: boolean) {
    const enable = typeof enabling === "boolean" ? enabling : !playTop100Random;
    setPlayTop100Random(enable);
    setIsTop100AutoPlay(true);
    setCurrentArtIndex(0);
    if (enable && top100Order.length === 0) {
      setTop100Order(shuffle(Array.from({ length: TOP_100_ARTS.length }, (_, i) => i)));
    }
  }

  const goPrevArt = () => {
    setIsTop100AutoPlay(false);
    setDailyAutoPaused(true);
    setCurrentArtIndex((prev) => (prev - 1 + currentArray.length) % currentArray.length);
  };

  const goNextArt = () => {
    setIsTop100AutoPlay(false);
    setDailyAutoPaused(true);
    setCurrentArtIndex((prev) => (prev + 1) % currentArray.length);
  };

  return (
    <main
      className={`${playfair.variable} min-h-screen bg-white text-black font-serif lining-nums`}
    >
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <PageTransition>
        {/* --- HERO SECTION --- */}
        {/* Added md:pr-8 lg:pr-16 to add space on the right side of the screen */}
        <section className="flex flex-col md:flex-row w-full min-h-[600px] border-b border-gray-200 md:pr-8 lg:pr-16">
          <div className="w-full md:w-1/3 bg-white p-8 md:py-12 md:pl-12 md:pr-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[330px] text-left mx-auto">
              <div className="mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2">
                  ART MASONS
                </h2>
                <h3 className="font-serif text-xl md:text-2xl text-[#800000]">
                  SEAL OF ASSURANCE
                </h3>
              </div>

              <ul className="space-y-4 font-serif text-lg text-gray-800">
                {ASSURANCE_POINTS.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
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
                    <Image
                      src={currentArt.image}
                      alt={currentArt.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 w-full bg-white/90 py-4 text-center z-20 backdrop-blur-sm border-t border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-xs uppercase tracking-[0.2em] block text-gray-500 mb-1">
                  FAMOUS ART
                </span>
              </div>
              <h2 className="font-serif text-2xl text-black">
                {isClient ? currentArt.title : ""}
              </h2>
            </div>

            {/* Left/Right manual navigation for hero */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goPrevArt();
              }}
              aria-label="Previous art"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goNextArt();
              }}
              aria-label="Next art"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/70 rounded-full hover:bg-white"
            >
              <ChevronRight size={28} />
            </button>

            {/* BUY NOW ribbon - sits above the full-area Link and stops propagation */}
            <Link
              href={isClient ? `/artworks/${currentArt.slug}` : "#"}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute bottom-6 right-6 z-50 inline-flex items-center justify-center bg-[#800000] text-white w-24 h-24 rounded-full font-bold uppercase tracking-wider shadow-lg hover:bg-[#9a0000] transition text-sm"
              aria-label="Buy now"
            >
              BUY NOW
            </Link>

            <Link
              href={isClient ? `/artworks/${currentArt.slug}` : "#"}
              className="absolute inset-0 z-30 cursor-pointer"
            >
              <div className="w-full h-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center text-white p-6 border-2 border-white">
                  <p className="font-serif text-3xl italic mb-2">
                    {isClient ? currentArt.artist : ""}
                  </p>
                  <p className="font-serif text-xs uppercase tracking-widest">
                    Click to View Details
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* --- POPULAR ART STRIP --- */}
        <section className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="font-serif text-2xl font-bold mb-6 text-center uppercase">
              POPULAR ART
            </h3>
            <div className="relative w-full">
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
                  <div
                    key={`${artist.name}-${i}`}
                    className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-3">
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="relative z-10 text-white font-serif font-bold tracking-wider text-sm text-center">
                        {artist.name}
                      </span>
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
            <h3 className="font-serif text-2xl font-bold mb-6 text-center md:text-left uppercase">
              FUN FACTS
            </h3>
            <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center text-center relative bg-white shadow-sm">
              {isClient && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-700"
                >
                  {FUN_FACTS_DATA[currentFactIndex]}
                </motion.p>
              )}
              <div className="absolute bottom-2 right-2 text-gray-400 opacity-40">
                <span className="font-serif text-6xl leading-none">"</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="font-serif text-2xl font-bold mb-6 text-center md:text-left uppercase">
              About Us
            </h3>
            <div className="space-y-6 font-serif text-gray-600 leading-relaxed text-justify">
              <p>
                You can have a Monet or Renoir in your own home or office which
                can be exactly like the original masterpiece in the museum. ART
                MASONS reproductions are your opportunity that comes as near to
                the original masterpiece as possible!
              </p>
              <p>
                Our artworks are absolutely and completely hand-painted with oil
                on a blank linen canvas. Everybody in our team of artists is an
                exceptional master in his own field, and this makes it possible
                for us reproduce our paintings to the level of perfection and
                style of the old masters.
              </p>
              <p>
                We have recorded on video the process of reproduction of
                hundreds of paintings created in our studio. You can watch these
                videos and be persuaded in the high quality of our work. We are
                not wholesalers, and we do not have varying levels of quality
                like our competitors.
              </p>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS (Updated to fix Animation Warning) --- */}
        <section className="py-20 container mx-auto px-4">
          <h3 className="font-serif text-3xl text-center mb-12">
            Collector Testimonials
          </h3>

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
                      <p className="font-serif italic text-gray-700">
                        "{text}"
                      </p>
                    </div>
                    <p className="mt-4 font-serif text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Verified Collector
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </PageTransition>
    </main>
  );
}
