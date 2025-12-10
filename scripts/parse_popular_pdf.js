const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', 'popular_art.pdf');
const ARTWORKS_PATH = path.join(__dirname, '..', 'data', 'artworks.ts');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'popularCategories.ts');

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseArtworksTs(content) {
  // Match objects with title and artist fields
  const regex = /\{[\s\S]*?title:\s*"([\s\S]*?)"[\s\S]*?(?:artist:\s*"([\s\S]*?)")?/g;
  const artworks = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    const title = (m[1] || '').trim();
    const artist = (m[2] || '').trim();
    if (title) {
      artworks.push({ title, artist, slug: generateSlug(title) });
    }
  }
  return artworks;
}

function findBestMatch(title, artist, artworks) {
  const slug = generateSlug(title);
  let found = artworks.find((a) => a.slug === slug);
  if (found) return found.slug;

  const lowTitle = (title || '').toLowerCase();
  const lowArtist = (artist || '').toLowerCase();

  // Try exact title includes
  found = artworks.find((a) => a.title.toLowerCase().includes(lowTitle) || lowTitle.includes(a.title.toLowerCase()));
  if (found) return found.slug;

  // Try artist + title includes
  found = artworks.find((a) => (a.artist || '').toLowerCase().includes(lowArtist) && a.title.toLowerCase().includes(lowTitle.split(' ')[0] || ''));
  if (found) return found.slug;

  // Try partial token match
  const tokens = lowTitle.split(/\s+/).filter(Boolean);
  found = artworks.find((a) => tokens.some((t) => a.title.toLowerCase().includes(t)));
  if (found) return found.slug;

  return null;
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF not found at', PDF_PATH);
    process.exit(1);
  }

  const data = fs.readFileSync(PDF_PATH);
  const textData = await pdf(data);
  const text = textData.text || '';

  const artworksTs = fs.readFileSync(ARTWORKS_PATH, 'utf8');
  const artworks = parseArtworksTs(artworksTs);

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const knownCategories = [
    'MONET','KLIMT','MATISSE','VAN GOGH','PICASSO','DA VINCI','STILL LIFES','LANDSCAPES','PORTRAITS'
  ];

  const categories = {};
  let current = null;
  for (const line of lines) {
    const up = line.toUpperCase();
    if (knownCategories.includes(up)) {
      current = generateSlug(up);
      categories[current] = [];
      continue;
    }

    // If line looks like a heading (all caps and short) treat as category
    if (/^[A-Z0-9\s-]{2,40}$/.test(line) && line === line.toUpperCase() && line.split(' ').length <= 4) {
      current = generateSlug(line);
      categories[current] = [];
      continue;
    }

    if (!current) continue;

    // Parse title and artist from line
    let title = line;
    let artist = '';
    const mDash = line.match(/^(.*?)\s+[–—-]\s+(.*)$/);
    const mBy = line.match(/^(.*?)\s+by\s+(.*)$/i);
    const mComma = line.match(/^(.*?),\s*(.*)$/);
    if (mDash) {
      title = mDash[1].trim();
      artist = mDash[2].trim();
    } else if (mBy) {
      title = mBy[1].trim();
      artist = mBy[2].trim();
    } else if (mComma) {
      // sometimes "Title, Artist"
      title = mComma[1].trim();
      artist = mComma[2].trim();
    }

    const match = findBestMatch(title, artist, artworks);
    if (match) {
      categories[current].push(match);
    } else {
      // store slugified title as fallback
      categories[current].push(generateSlug(title));
    }
  }

  // Write out TypeScript map
  const linesOut = [];
  linesOut.push("import { ARTWORKS } from './artworks';");
  linesOut.push('');
  linesOut.push('export const POPULAR_CATEGORY_MAP: Record<string, string[]> = {');
  for (const k of Object.keys(categories)) {
    const arr = categories[k];
    linesOut.push(`  '${k}': [${arr.map((s) => `'${s}'`).join(', ')}],`);
  }
  linesOut.push('};');
  linesOut.push('');
  linesOut.push("export function getCategorySlugs(categorySlug: string) { return POPULAR_CATEGORY_MAP[categorySlug] || []; }");

  fs.writeFileSync(OUTPUT_PATH, linesOut.join('\n') + '\n', 'utf8');
  console.log('Wrote curated categories to', OUTPUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
