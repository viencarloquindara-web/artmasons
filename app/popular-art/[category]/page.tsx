import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Playfair_Display } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
import { ARTWORKS, generateSlug, getArtworkBySlug, type Artwork } from '../../../data/artworks';
import { getCategorySlugs } from '../../../data/popularCategories';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

function humanize(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function matchesCategory(artwork: Artwork, slug?: string) {
  if (!slug) return false;
  const lower = String(slug).replace(/-/g, ' ').toLowerCase();
  const title = (artwork.title ?? '').toLowerCase();
  const artist = (artwork.artist ?? '').toLowerCase();
  const desc = (artwork.description ?? '').toLowerCase();

  // Direct artist match (e.g., "monet", "van gogh")
  if (artist.includes(lower)) return true;
  // match against artist slugified tokens (e.g., "van-gogh")
  try {
    const artistSlug = generateSlug(artwork.artist ?? '');
    if (artistSlug.includes(lower.replace(/\s+/g, '-'))) return true;
  } catch {}

  // Direct title match
  if (title.includes(lower)) return true;
  if (desc.includes(lower)) return true;

  // Common category heuristics
  if (lower.includes('portrait')) {
    return title.includes('portrait') || title.includes('portrait of');
  }

  if (lower.includes('still') || lower.includes('life')) {
    return title.includes('still life');
  }

  if (lower.includes('landscap') || lower.includes('landscape')) {
    const landscapeKeywords = ['landscape', 'valley', 'sea', 'view', 'nile', 'bay', 'river', 'field', 'sunrise', 'wheat', 'beach', 'shore', 'harbor', 'yosemite'];
    return landscapeKeywords.some((k) => title.includes(k));
  }

  // Fallback: check if artist contains last word of slug
  const slugLast = lower.split(' ').slice(-1)[0];
  if (slugLast && artist.includes(slugLast)) return true;

  return false;
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>, searchParams?: Promise<{ sort?: string }> }) {
  const { category } = await params;
  const slug = category ?? '';
  const sp = searchParams ? await searchParams : {} as { sort?: string };
  const sort = (sp && sp.sort) || 'default';

  // Try curated lists first (exact controlled lists from `data/popularCategories.ts`)
  const curatedSlugs = getCategorySlugs(slug);
  let filtered: Artwork[] = [];

  if (curatedSlugs && curatedSlugs.length > 0) {
    filtered = curatedSlugs
      .map((s) => getArtworkBySlug(s))
      .filter((a): a is Artwork => Boolean(a));
  } else {
    filtered = ARTWORKS.filter((a) => matchesCategory(a, slug));
  }

  const title = slug ? humanize(slug) : 'Popular Art';

  // Apply sorting (server-side) — default preserves curated order
  if (sort === 'title') {
    filtered = filtered.slice().sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
  } else if (sort === 'artist') {
    filtered = filtered.slice().sort((a, b) => (a.artist ?? '').localeCompare(b.artist ?? ''));
  }

  // Render full list (no hero thumbnail)
  const gridItems = filtered;

  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black font-serif`}>
      <PageTransition>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Popular Art', href: '/' }, { label: title, href: `/popular-art/${slug}` }]} />
          </div>

          <header className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-[#800000]">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">Browse curated {title.toLowerCase()} paintings from our collection.</p>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center gap-4">
              <div className="font-serif text-sm text-gray-600">{filtered.length} items</div>
              <div className="font-serif text-sm text-gray-600">
                <span className="mr-2">Sort:</span>
                <Link href={`/popular-art/${slug}`} className={`px-2 ${sort==='default'?'font-semibold text-black':''}`}>Default</Link>
                <Link href={`/popular-art/${slug}?sort=title`} className={`px-2 ${sort==='title'?'font-semibold text-black':''}`}>Title</Link>
                <Link href={`/popular-art/${slug}?sort=artist`} className={`px-2 ${sort==='artist'?'font-semibold text-black':''}`}>Artist</Link>
              </div>
            </div>
          </header>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-serif text-xl font-bold text-gray-700">No artworks found</h2>
              <p className="text-gray-500 mt-2">We couldn&apos;t find artworks for “{title}”.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gridItems.map((art) => (
                <article key={art.title} className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow rounded-md overflow-hidden">
                  <Link href={`/artworks/${generateSlug(art.title)}`} className="block group">
                    <div className="relative w-full h-56 md:h-44 lg:h-48">
                      <Image src={art.image} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-sm font-semibold text-gray-900 truncate">{art.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">{art.artist}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </main>
  );
}
