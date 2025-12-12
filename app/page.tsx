"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import PageTransition from "./components/PageTransition";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Fonts ---
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

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
  { title: "Mona Lisa", artist: "Leonardo da Vinci", image: "/image/famous-art/mona_lisa.webp" },
  { title: "Starry Night", artist: "Vincent van Gogh", image: "/image/famous-art/starry_night.webp" },
  { title: "The Scream", artist: "Edvard Munch", image: "/image/famous-art/the_scream.webp" },
  { title: "Girl With A Pearl Earring", artist: "Johannes Vermeer", image: "/image/famous-art/pearl_earing.jpg" },
  { title: "The Kiss", artist: "Gustav Klimt", image: "/image/famous-art/the_kiss.jpg" },
  { title: "The Birth of Venus", artist: "Sandro Botticelli", image: "/image/famous-art/primavera.webp" },
  { title: "Impression Sunrise", artist: "Claude Monet", image: "/image/famous-art/impression_sunrise.jpg" },
  { title: "Water Lilies", artist: "Claude Monet", image: "/image/famous-art/water_lilies.jpg" },
  { title: "The Last Supper", artist: "Leonardo da Vinci", image: "/image/famous-art/calling_matthew.jpg" },
  { title: "The Creation of Adam", artist: "Michelangelo", image: "/image/famous-art/sistine_madonna.jpg" },
  { title: "Guernica", artist: "Pablo Picasso", image: "/image/famous-art/picasso054.jpg" },
  { title: "American Gothic", artist: "Grant Wood", image: "/image/famous-art/horse_head.jpg" },
  { title: "The Persistence of Memory", artist: "Salvador Dalí", image: "/image/famous-art/the_dream.jpg" },
  { title: "The Night Watch", artist: "Rembrandt", image: "/image/famous-art/wanderer_mist.jpg" },
  { title: "Las Meninas", artist: "Diego Velázquez", image: "/image/famous-art/lady_godiva.jpg" },
  { title: "The Great Wave off Kanagawa", artist: "Katsushika Hokusai", image: "/image/famous-art/sea_gaiilee.jpg" },
  { title: "Sunflowers", artist: "Vincent van Gogh", image: "/image/famous-art/fourteen_sunflowers.webp" },
  { title: "Irises", artist: "Vincent van Gogh", image: "/image/famous-art/irises.jpg" },
  { title: "Café Terrace at Night", artist: "Vincent van Gogh", image: "/image/famous-art/cafe_terrace.webp" },
  { title: "Wheat Field with Crows", artist: "Vincent van Gogh", image: "/image/famous-art/wheat_field.webp" },
  { title: "Portrait of Joseph Roulin", artist: "Vincent van Gogh", image: "/image/famous-art/joseph_roulin.jpg" },
  { title: "A Pair of Shoes", artist: "Vincent van Gogh", image: "/image/famous-art/shoes.jpg" },
  { title: "Vase with Irises", artist: "Vincent van Gogh", image: "/image/famous-art/vase_irises.jpg" },
  { title: "Vase with Roses", artist: "Vincent van Gogh", image: "/image/famous-art/vase_roses.jpg" },
  { title: "The Dance", artist: "Henri Matisse", image: "/image/famous-art/the_dance.jpg" },
  { title: "Red Room (Harmony in Red)", artist: "Henri Matisse", image: "/image/famous-art/red_room.jpg" },
  { title: "Goldfish", artist: "Henri Matisse", image: "/image/famous-art/goldfish.jpg" },
  { title: "The Red Nude", artist: "Henri Matisse", image: "/image/famous-art/red_nude.jpg" },
  { title: "Open Window", artist: "Henri Matisse", image: "/image/famous-art/open_window.jpg" },
  { title: "The Tree of Life", artist: "Gustav Klimt", image: "/image/famous-art/tree_life.jpg" },
  { title: "Hope II", artist: "Gustav Klimt", image: "/image/famous-art/hope_II.jpg" },
  { title: "Music I", artist: "Gustav Klimt", image: "/image/famous-art/music_I.jpg" },
  { title: "The Dancer", artist: "Gustav Klimt", image: "/image/famous-art/the_dancer_1.jpg" },
  { title: "Composition VIII", artist: "Wassily Kandinsky", image: "/image/famous-art/composition_8.jpg" },
  { title: "The Garden of Earthly Delights", artist: "Hieronymus Bosch", image: "/image/famous-art/earthly_delights.jpg" },
  { title: "Luncheon on the Grass", artist: "Édouard Manet", image: "/image/famous-art/lunch_grass.jpg" },
  { title: "A Bar at the Folies-Bergère", artist: "Édouard Manet", image: "/image/famous-art/folies_begere.jpg" },
  { title: "The Swing", artist: "Jean-Honoré Fragonard", image: "/image/famous-art/the_swing.webp" },
  { title: "Bal du Moulin de la Galette", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/moulin_galette.jpg" },
  { title: "Two Sisters (On the Terrace)", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/two_sisters.jpg" },
  { title: "The Skiff", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/the_skiff.jpg" },
  { title: "Madame Monet and Her Son", artist: "Pierre-Auguste Renoir", image: "/image/famous-art/madame_monet.webp" },
  { title: "Haystacks", artist: "Claude Monet", image: "/image/famous-art/hay_stacks.jpg" },
  { title: "Water Lily Pond", artist: "Claude Monet", image: "/image/famous-art/water_lily.webp" },
  { title: "The Grand Canal Venice", artist: "Claude Monet", image: "/image/famous-art/grand_canal.jpg" },
  { title: "Flaming June", artist: "Frederic Leighton", image: "/image/famous-art/flaming_june.jpg" },
  { title: "The Lady of Shalott", artist: "John William Waterhouse", image: "/image/famous-art/lady_shalotte.webp" },
  { title: "Lady Godiva", artist: "John Collier", image: "/image/famous-art/lady_godiva.jpg" },
  { title: "Wanderer Above the Sea of Fog", artist: "Caspar David Friedrich", image: "/image/famous-art/wanderer_mist.jpg" },
  { title: "The Sleeping Gypsy", artist: "Henri Rousseau", image: "/image/famous-art/sleeping_gypsy.jpg" },
  { title: "The Dream", artist: "Henri Rousseau", image: "/image/famous-art/the_dream.jpg" },
  { title: "The Hunt in the Forest", artist: "Claude Monet", image: "/image/famous-art/the_hunt.jpg" },
  { title: "Madame X", artist: "John Singer Sargent", image: "/image/famous-art/madame_x.jpg" },
  { title: "The Angelus", artist: "Jean-François Millet", image: "/image/famous-art/the_angelus.jpg" },
  { title: "Napoleon Crossing the Alps", artist: "Jacques-Louis David", image: "/image/famous-art/napoleon_crossing.jpg" },
  { title: "View of Toledo", artist: "El Greco", image: "/image/famous-art/view_toledo.jpg" },
  { title: "Storm on the Sea of Galilee", artist: "Rembrandt", image: "/image/famous-art/sea_gaiilee.jpg" },
  { title: "The Calling of Saint Matthew", artist: "Caravaggio", image: "/image/famous-art/calling_matthew.jpg" },
  { title: "Nude Descending a Staircase", artist: "Marcel Duchamp", image: "/image/famous-art/nude_descending.jpg" },
  { title: "Dancers in Blue", artist: "Edgar Degas", image: "/image/famous-art/dancers_blue.jpg" },
  { title: "Crouching Woman", artist: "Egon Schiele", image: "/image/famous-art/crouching_woman.jpg" },
].map((a) => ({ ...a, slug: generateSlug(a.title) }));

// Placeholder Top 100 list. Images not yet available; logic implemented.
const TOP_100_ARTS = Array.from({ length: 100 }).map((_, i) => ({
  title: `Artwork #${i + 1}`,
  artist: `Artist #${i + 1}`,
  image: `/image/placeholder-${(i % 10) + 1}.webp`,
  slug: `artwork-${i + 1}`,
}));

export default function ArtMasonsLanding() {
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [playTop100Random] = useState(false);
  const [isTop100AutoPlay, setIsTop100AutoPlay] = useState(true);
  const [currentFactIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [famousAutoPlay, setFamousAutoPlay] = useState(true);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const top100Order = React.useMemo(() => {
    const indices = Array.from({ length: TOP_100_ARTS.length }, (_, i) => i);
    return isClient ? shuffle(indices) : indices;
  }, [isClient]);

  // You might need to import useRef from 'react'
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const extendedArtists = [...POPULAR_ARTISTS, ...POPULAR_ARTISTS];

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 3) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => {
      clearInterval(testimonialTimer);
    };
  }, []);

  // Famous art carousel autoplay (advances every 5s when enabled)
  useEffect(() => {
    if (!isClient) return;
    if (playTop100Random) return; // don't autoplay famous when Top100 mode is active
    if (!famousAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentArtIndex((prev) => (prev + 1) % ART_OF_THE_DAY.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient, playTop100Random, famousAutoPlay]);

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
    let lastTime = 0;
    const speed = 40; // pixels per second (adjust for comfortable scroll speed)

    const step = (time: number) => {
      if (document.hidden || isCarouselPaused) {
        // Do not advance while tab is hidden or carousel is paused
        lastTime = time;
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000; // seconds elapsed
      const deltaPx = speed * delta;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += deltaPx;
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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

  const goPrevArt = () => {
    setIsTop100AutoPlay(false);
    setFamousAutoPlay(false);
    setCurrentArtIndex((prev) => (prev - 1 + currentArray.length) % currentArray.length);
  };

  const goNextArt = () => {
    setIsTop100AutoPlay(false);
    setFamousAutoPlay(false);
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
                <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2 ml-2 md:ml-4">
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
                {/* Render hero image on initial render (SSR-friendly). This removes the isClient gating
                    so famous art shows on mobile immediately rather than waiting for client mount. */}
                <div className="w-full h-full bg-gray-200 relative">
                  <Image
                    src={currentArt.image}
                    alt={currentArt.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

              <div className="absolute bottom-0 w-full bg-white/90 py-4 text-center z-20 backdrop-blur-sm border-t border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-xs uppercase tracking-[0.2em] block text-[#800000] mb-1">
                  FAMOUS ART
                </span>
              </div>
              <h2 className="font-serif text-2xl text-black">
                {currentArt?.title ?? ""}
              </h2>
              <p className="font-serif text-sm text-gray-600 mt-1">
                {currentArt?.artist ?? ""}
              </p>
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

            {/* Full-area clickable overlay (covers the hero image) */}
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

            {/* BUY NOW ribbon - sits above the full-area Link and stops propagation */}
            <Link
              href={isClient ? `/artworks/${currentArt.slug}` : "#"}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label="Buy now"
              className="absolute z-50 inline-flex items-center justify-center bg-[#800000] text-white w-24 h-24 rounded-full font-bold uppercase tracking-wider shadow-lg hover:bg-[#9a0000] transition text-sm bottom-20 right-6 md:left-1/2 md:bottom-[105px] md:transform md:-translate-x-1/2"
            >
              BUY NOW
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
                  <Link
                    key={`${artist.name}-${i}`}
                    href={`/popular-art/${generateSlug(artist.name)}`}
                    className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group"
                    onMouseEnter={() => setIsCarouselPaused(true)}
                    onMouseLeave={() => setIsCarouselPaused(false)}
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
                  </Link>
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
              {/* Opening quote aligned to first line */}
              <div
                className="absolute left-6 text-[#800000] opacity-90"
                style={{ top: '30%', transform: 'translateY(-50%)' }}
              >
                <span className="font-serif text-6xl leading-none">“</span>
              </div>

              {isClient && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-700 -mt-3"
                >
                  {FUN_FACTS_DATA[currentFactIndex]}
                </motion.p>
              )}

              {/* Closing quote aligned to second line */}
              <div
                className="absolute right-6 text-[#800000] opacity-90"
                style={{ top: '70%', transform: 'translateY(-50%)' }}
              >
                <span className="font-serif text-6xl leading-none">”</span>
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
                        “{text}”
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
