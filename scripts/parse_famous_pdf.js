const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', 'famous_art.pdf');
const ARTWORKS_PATH = path.join(__dirname, '..', 'data', 'artworks.ts');

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseArtworksTs(content) {
  const regex = /\{[\s\S]*?title:\s*"([\s\S]*?)"[\s\S]*?(?:artist:\s*"([\s\S]*?)")?/g;
  const artworks = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    const title = (m[1] || '').trim();
    const artist = (m[2] || '').trim();
    if (title) artworks.push({ title, artist, slug: generateSlug(title) });
  }
  return artworks;
}

function findBestMatch(title, artist, artworks) {
  const slug = generateSlug(title);
  let found = artworks.find((a) => a.slug === slug);
  if (found) return found;

  const lowTitle = (title || '').toLowerCase();
  const lowArtist = (artist || '').toLowerCase();

  found = artworks.find((a) => a.title.toLowerCase().includes(lowTitle) || lowTitle.includes(a.title.toLowerCase()));
  if (found) return found;

  found = artworks.find((a) => (a.artist || '').toLowerCase().includes(lowArtist) && a.title.toLowerCase().includes(lowTitle.split(' ')[0] || ''));
  if (found) return found;

  const tokens = lowTitle.split(/\s+/).filter(Boolean);
  found = artworks.find((a) => tokens.some((t) => a.title.toLowerCase().includes(t)));
  if (found) return found;

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

  console.log('Parsed lines from PDF (first 300 lines shown)');
  console.log('---');

  // build a list of known artist names from artworks.ts to help split lines
  const artistNames = Array.from(new Set(artworks.map((a) => (a.artist || '').trim()).filter(Boolean)));
  // sort by length desc so longer names match first (e.g., "Vincent Van Gogh" before "Van")
  artistNames.sort((a, b) => b.length - a.length);

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const parsedEntries = [];

  for (const line of lines.slice(0, 2000)) {
    // skip headings/categories that are uppercase short lines
    if (/^[A-Z0-9\s\-]{1,40}$/.test(line) && line === line.toUpperCase()) continue;

    let title = line;
    let artist = '';
    let artistFound = false;

    // 1) Try to find a known artist name inside the line
    for (const artistName of artistNames) {
      if (!artistName) continue;
      const re = new RegExp('\\b' + escapeRegExp(artistName) + '\\b', 'i');
      const m = line.match(re);
      if (m) {
        artist = artistName;
        // title is the part before the artist match
        const idx = m.index;
        title = line.slice(0, idx).trim();
        artistFound = true;
        break;
      }
    }

    // 2) fallback to other patterns if no known artist found
    if (!artistFound) {
      const mDash = line.match(/^(.*?)\s+[–—-]\s+(.*)$/);
      const mBy = line.match(/^(.*?)\s+by\s+(.*)$/i);
      const mComma = line.match(/^(.*?),\s*(.*)$/);
      if (mDash) {
        title = mDash[1].trim();
        artist = mDash[2].trim();
      } else if (mBy) {
        title = mBy[1].trim();
        artist = mBy[2].trim();
      } else if (mComma && /[A-Za-z]/.test(mComma[2])) {
        title = mComma[1].trim();
        artist = mComma[2].trim();
      } else {
        // attempt to strip trailing numeric/dimension/price segments
        const noNums = line.replace(/\b\d{2,4}(?:[.,]\d+)?\b/g, '').replace(/\d+x\d+/ig, '').trim();
        if (noNums && noNums.length < line.length) title = noNums;
      }
    }

    const match = findBestMatch(title, artist, artworks);

    // confidence heuristics
    let confidence = 'low';
    if (match) {
      // exact slug match
      if (generateSlug(title) === match.slug) confidence = 'high';
      else if (artistFound || (artist && (match.artist || '').toLowerCase().includes(artist.toLowerCase()))) confidence = 'high';
      else confidence = 'medium';
    }

    parsedEntries.push({ raw: line, title: title || '', artist: artist || '', matched: match ? { slug: match.slug, title: match.title, artist: match.artist } : null, confidence });
  }

  // write JSON report
  const OUT_PATH = path.join(__dirname, '..', 'data', 'famous_parsed.json');
  fs.writeFileSync(OUT_PATH, JSON.stringify(parsedEntries, null, 2), 'utf8');
  console.log('Wrote parsed output to', OUT_PATH);

  // print summary
  const total = parsedEntries.length;
  const unmatched = parsedEntries.filter((p) => !p.matched).length;
  console.log('\nSummary:');
  console.log(` Total parsed entries: ${total}`);
  console.log(` Entries without match: ${unmatched}`);
  if (unmatched > 0) {
    console.log('\nUnmatched examples (up to 20):');
    parsedEntries.filter((p) => !p.matched).slice(0, 20).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}${p.artist ? ' — ' + p.artist : ''} (raw: ${p.raw.slice(0,120)})`);
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
