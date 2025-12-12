/* eslint-disable no-console */

// Validates that rows in ART_NAMES*.pdf exist in data/artworks.ts and checks key fields.
// Usage:
//   node scripts/validate_art_names_pdfs.js

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const ROOT = path.join(__dirname, '..');
const ARTWORKS_PATH = path.join(ROOT, 'data', 'artworks.ts');
const PDF_PATHS = [
  path.join(ROOT, 'data', 'ART_NAMES.pdf'),
  path.join(ROOT, 'data', 'ART_NAMES_B.pdf'),
  path.join(ROOT, 'data', 'ART_NAMES_C.pdf'),
].filter((p) => fs.existsSync(p));

const REPORT_MD_PATH = path.join(ROOT, 'data', 'art_names_validation_report.md');
const REPORT_JSON_PATH = path.join(ROOT, 'data', 'art_names_validation_report.json');

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractYearDigits(value) {
  if (!value) return null;
  const m = String(value).match(/(\d{4})/);
  return m ? Number(m[1]) : null;
}

function parseDims(value) {
  if (!value) return null;
  const s = String(value).toLowerCase();
  if (s === 'unknown') return null;

  // supports: 56 x 81.6, 60x80, 60 × 80, 60 x 80 cm
  const m = s.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  return { w: Number(m[1]), h: Number(m[2]) };
}

function parsePriceAed(value) {
  if (!value) return null;
  const s = String(value).replace(/,/g, '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(s)) return null;
  return Number(s);
}

function normalizeText(s) {
  return String(s)
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(pdfText) {
  return normalizeText(pdfText)
    .split(' ')
    .map((t) => t.trim())
    .filter(Boolean);
}

function isLikelyPriceToken(token, prev, next) {
  if (!token) return false;

  // Comma-formatted numbers are prices in these PDFs.
  // Examples: 3,350 12,500
  if (/^\d{1,3}(?:,\d{3})+$/.test(token)) return true;

  if (!/^\d+$/.test(token)) return false;
  const n = Number(token);
  if (!Number.isFinite(n)) return false;

  // Heuristic to avoid treating years as prices.
  // Years are typically 4 digits in the 1400-2099 range.
  // But prices can also be 4 digits (e.g. 2000), so only classify a 4-digit
  // value in that range as a price if it appears right after a dimension
  // (e.g. "60 x 70 2000") and is followed by a title-like token.
  if (token.length === 4 && n >= 1400 && n <= 2099) {
    const dimsEndBefore =
      prev &&
      prev.length >= 3 &&
      /^\d+(?:\.\d+)?$/.test(prev[prev.length - 1]) &&
      (prev[prev.length - 2] === 'x' || prev[prev.length - 2] === '×') &&
      /^\d+(?:\.\d+)?$/.test(prev[prev.length - 3]);

    const nextLooksLikeTitle = next ? /^[A-Za-z(]/.test(next) : false;
    return dimsEndBefore && nextLooksLikeTitle;
  }

  // Basic sanity bounds for AED prices.
  if (n < 100 || n > 100000) return false;
  return true;
}

function isYearToken(token) {
  return /^\d{4}$/.test(token);
}

function isDimsTokenStart(token) {
  return /^\d+(?:\.\d+)?$/.test(token);
}

function parseArtworksFromTs(tsContent) {
  // Extract each top-level object in ARTWORKS array using a brace counter.
  const startIdx = tsContent.indexOf('export const ARTWORKS');
  if (startIdx === -1) throw new Error('Could not find ARTWORKS export');

  const arrayStart = tsContent.indexOf('[', startIdx);
  if (arrayStart === -1) throw new Error('Could not find ARTWORKS array start');

  const artworks = [];
  let i = arrayStart;
  while (i < tsContent.length) {
    const nextObjStart = tsContent.indexOf('{', i);
    const nextArrayEnd = tsContent.indexOf('];', i);
    if (nextArrayEnd !== -1 && (nextObjStart === -1 || nextArrayEnd < nextObjStart)) break;
    if (nextObjStart === -1) break;

    // Walk from nextObjStart until brace depth returns to 0.
    let depth = 0;
    let inString = false;
    let stringQuote = null;
    let escape = false;
    let j = nextObjStart;

    for (; j < tsContent.length; j++) {
      const ch = tsContent[j];
      if (escape) {
        escape = false;
        continue;
      }
      if (inString) {
        if (ch === '\\') {
          escape = true;
          continue;
        }
        if (ch === stringQuote) {
          inString = false;
          stringQuote = null;
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = true;
        stringQuote = ch;
        continue;
      }

      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }

    const objText = tsContent.slice(nextObjStart, j);

    const getQuoted = (key) => {
      const reDouble = new RegExp(`${key}:\\s*\"([^\"]+)\"`);
      const reSingle = new RegExp(`${key}:\\s*'([^']+)'`);
      const md = objText.match(reDouble);
      if (md) return md[1];
      const ms = objText.match(reSingle);
      if (ms) return ms[1];
      return undefined;
    };

    const title = getQuoted('title');
    const artist = getQuoted('artist');
    const year = getQuoted('year');
    const originalSize = getQuoted('originalSize');
    const basePriceRaw = (objText.match(/basePrice:\s*(\d+(?:\.\d+)?)/) || [])[1];
    const currency = getQuoted('currency');
    const image = getQuoted('image');

    const options = [];
    const optionsBlockMatch = objText.match(/options:\s*\[([\s\S]*?)\]\s*,?/);
    if (optionsBlockMatch) {
      const optionsBlock = optionsBlockMatch[1];
      const re = /\{[^}]*?width:\s*(\d+(?:\.\d+)?)[^}]*?height:\s*(\d+(?:\.\d+)?)[^}]*?price:\s*(\d+(?:\.\d+)?)[^}]*?\}/g;
      let m;
      while ((m = re.exec(optionsBlock)) !== null) {
        options.push({ width: Number(m[1]), height: Number(m[2]), price: Number(m[3]) });
      }
    }

    if (title && artist) {
      artworks.push({
        title,
        artist,
        year: year || null,
        originalSize: originalSize || null,
        basePrice: basePriceRaw ? Number(basePriceRaw) : null,
        currency: currency || null,
        image: image || null,
        slug: generateSlug(title),
        options,
      });
    }

    i = j;
  }

  return artworks;
}

function buildArtistNames(artworks) {
  const set = new Set();
  for (const a of artworks) {
    if (a.artist) set.add(String(a.artist).trim());
  }
  const names = Array.from(set);
  names.sort((a, b) => b.length - a.length);
  return names;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLooseArtistRegex(name) {
  // Make artist matching tolerant of extra whitespace and of spaces around hyphens.
  // Example: "Alma-Tadema" should match "Alma- Tadema".
  const parts = String(name)
    .split('-')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => escapeRegExp(p).replace(/\s+/g, '\\s+'));

  const hyphenJoined = parts.join('\\s*-\\s*');
  // Don't use \b word boundaries because many artist names contain
  // punctuation like parentheses, commas, or accents which can break \b.
  // Use whitespace/string boundaries instead.
  return new RegExp('(?:^|\\s)' + hyphenJoined + '(?=\\s|$)', 'i');
}

function normalizeTitleForMatch(title) {
  return String(title)
    .toLowerCase()
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBestMatchByTitle(title, artist, artworks) {
  // If we couldn't detect the artist (because it's not in the system list),
  // matching by loose title tokens creates many false positives.
  if (!artist) return null;

  const lowArtist = String(artist).toLowerCase();
  const candidates = artworks.filter((a) => String(a.artist || '').toLowerCase() === lowArtist);
  if (candidates.length === 0) return null;

  const slug = generateSlug(title);
  let found = candidates.find((a) => a.slug === slug);
  if (found) return { artwork: found, strategy: 'slug' };

  const lowTitle = (title || '').toLowerCase();
  found = candidates.find((a) => a.title.toLowerCase() === lowTitle);
  if (found) return { artwork: found, strategy: 'title_exact' };

  const norm = normalizeTitleForMatch(title);
  found = candidates.find((a) => normalizeTitleForMatch(a.title) === norm);
  if (found) return { artwork: found, strategy: 'title_normalized' };

  return null;
}

function parsePdfIntoRecords(pdfText, artistNames) {
  const t = normalizeText(pdfText);

  // Remove common header chunk if present.
  const headerRegex = /ART NAME A-Z ARTIST NAME YEAR ART ORIGINAL DIMENSIONS CM SELLING DIMENSIONS PRICE AED IMAGE/i;
  const stripped = headerRegex.test(t) ? t.replace(headerRegex, '').trim() : t;

  const tokens = tokenize(stripped);
  if (tokens.length === 0) return [];

  const records = [];
  let start = 0;

  // If the first token is a section letter like "A" or "C", drop it.
  if (/^[A-Z]$/.test(tokens[0])) start = 1;

  const isNextTitleStart = (idx) => {
    const tok = tokens[idx];
    if (!tok) return false;
    if (/^\d/.test(tok)) return false;
    if (tok.toLowerCase() === 'x') return false;
    return /^[A-Za-z(]/.test(tok);
  };

  for (let i = start; i < tokens.length; i++) {
    const tok = tokens[i];
    const prevSlice = tokens.slice(Math.max(start, i - 6), i);
    const nextTok = i + 1 < tokens.length ? tokens[i + 1] : null;
    if (!isLikelyPriceToken(tok, prevSlice, nextTok)) continue;

    // price token ends a record if next token looks like the start of a new title/word.
    if (i + 1 < tokens.length && isNextTitleStart(i + 1)) {
      const chunk = tokens.slice(start, i + 1);
      if (chunk.length > 4) records.push(chunk);

      // next record may begin with section letter between groups; drop it.
      start = i + 1;
      if (start < tokens.length && /^[A-Z]$/.test(tokens[start]) && isNextTitleStart(start + 1)) {
        start = start + 1;
      }
    }
  }

  // Convert token chunks into structured records.
  const artistRegexes = artistNames.map((name) => ({ name, re: buildLooseArtistRegex(name) }));

  const out = [];
  for (const chunk of records) {
    const raw = chunk.join(' ');

    // price = last token
    const priceToken = chunk[chunk.length - 1];
    const priceAed = parsePriceAed(priceToken);

    // Find year token: first 4-digit after artist; fallback any 4-digit.
    let artist = '';
    let artistIndex = -1;
    for (const { name, re } of artistRegexes) {
      const m = raw.match(re);
      if (m) {
        artist = name;
        artistIndex = m.index;
        break;
      }
    }

    let title = raw;
    if (artist && artistIndex >= 0) {
      title = raw.slice(0, artistIndex).trim();
    }

    // remaining part after artist is where year/dims live
    const tail = artist && artistIndex >= 0 ? raw.slice(artistIndex + artist.length).trim() : '';
    const tailTokens = tail ? tail.split(/\s+/).filter(Boolean) : [];

    let year = null;
    for (const tt of tailTokens) {
      if (isYearToken(tt)) {
        year = Number(tt);
        break;
      }
    }

    // dims come after year, but sometimes original can be "unknown"
    let originalDims = null;
    let sellingDims = null;

    // Find dims patterns by scanning tail tokens for sequences like [num, x, num]
    // Also handle 'unknown'.
    const readDimsAt = (idx) => {
      if (idx >= tailTokens.length) return { dims: null, next: idx };
      const t0 = tailTokens[idx];
      if (!t0) return { dims: null, next: idx };
      if (t0.toLowerCase() === 'unknown') return { dims: null, next: idx + 1 };

      const t1 = tailTokens[idx + 1];
      const t2 = tailTokens[idx + 2];
      if (isDimsTokenStart(t0) && (t1 === 'x' || t1 === '×') && isDimsTokenStart(t2)) {
        return { dims: { w: Number(t0), h: Number(t2) }, next: idx + 3 };
      }
      // Sometimes extracted as "60" "x" "81.6" -> handled above
      return { dims: null, next: idx };
    };

    // Locate the year index in tailTokens then read original and selling dims after.
    // Some rows use 'Unknown' instead of a 4-digit year.
    let yearIdx = -1;
    for (let k = 0; k < tailTokens.length; k++) {
      if (isYearToken(tailTokens[k])) {
        yearIdx = k;
        break;
      }
    }
    if (yearIdx === -1) {
      for (let k = 0; k < tailTokens.length; k++) {
        if (String(tailTokens[k]).toLowerCase() === 'unknown') {
          yearIdx = k;
          break;
        }
      }
    }

    if (yearIdx >= 0) {
      let cursor = yearIdx + 1;
      const o = readDimsAt(cursor);
      originalDims = o.dims;
      cursor = o.next;

      // If original dims are unknown, cursor already advanced.
      const s = readDimsAt(cursor);
      sellingDims = s.dims;
    }

    out.push({ raw, title: title.trim(), artist: artist.trim(), year, originalDims, sellingDims, priceAed });
  }

  return out;
}

function compareRecordToArtwork(record, artwork) {
  const mismatches = [];

  // Artist
  if (record.artist) {
    const a = record.artist.toLowerCase();
    const b = String(artwork.artist || '').toLowerCase();
    if (a !== b) mismatches.push({ field: 'artist', pdf: record.artist, system: artwork.artist });
  }

  // Year
  if (record.year) {
    const systemYear = extractYearDigits(artwork.year);
    if (systemYear && systemYear !== record.year) mismatches.push({ field: 'year', pdf: record.year, system: artwork.year || null });
    if (!systemYear) mismatches.push({ field: 'year_missing', pdf: record.year, system: artwork.year || null });
  }

  // Original size
  if (record.originalDims) {
    const sysDims = parseDims(artwork.originalSize);
    if (!sysDims) {
      mismatches.push({ field: 'originalSize_missing', pdf: `${record.originalDims.w} x ${record.originalDims.h}`, system: artwork.originalSize || null });
    } else {
      const same = Math.abs(sysDims.w - record.originalDims.w) < 0.01 && Math.abs(sysDims.h - record.originalDims.h) < 0.01;
      if (!same) mismatches.push({ field: 'originalSize', pdf: `${record.originalDims.w} x ${record.originalDims.h}`, system: artwork.originalSize });
    }
  }

  // Selling size + price
  if (record.sellingDims) {
    const pdfW = record.sellingDims.w;
    const pdfH = record.sellingDims.h;

    const option = (artwork.options || []).find((o) => Math.abs(o.width - pdfW) < 0.01 && Math.abs(o.height - pdfH) < 0.01);
    if (!option) {
      mismatches.push({ field: 'sellingSize_missing', pdf: `${pdfW} x ${pdfH}`, system: (artwork.options || []).slice(0, 3).map((o) => `${o.width}x${o.height}`).join(', ') || null });
    } else if (record.priceAed != null) {
      if (Math.abs(option.price - record.priceAed) > 0.01) {
        mismatches.push({ field: 'price', pdf: record.priceAed, system: option.price });
      }
    }
  } else if (record.priceAed != null) {
    // fallback compare price to basePrice
    if (artwork.basePrice != null && Math.abs(artwork.basePrice - record.priceAed) > 0.01) {
      mismatches.push({ field: 'basePrice', pdf: record.priceAed, system: artwork.basePrice });
    }
  }

  return mismatches;
}

async function main() {
  const ts = fs.readFileSync(ARTWORKS_PATH, 'utf8');
  const artworks = parseArtworksFromTs(ts);
  const artistNames = buildArtistNames(artworks);

  if (PDF_PATHS.length === 0) {
    console.error('No PDFs found. Expected one of:', 'data/ART_NAMES.pdf', 'data/ART_NAMES_C.pdf');
    process.exit(1);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    pdfs: [],
    totals: { rows: 0, matched: 0, unmatched: 0, mismatched: 0 },
  };

  for (const pdfPath of PDF_PATHS) {
    const buf = fs.readFileSync(pdfPath);
    const parsed = await pdf(buf);
    const records = parsePdfIntoRecords(parsed.text || '', artistNames);

    const rows = [];
    let matched = 0;
    let unmatched = 0;
    let mismatched = 0;

    for (const r of records) {
      const match = findBestMatchByTitle(r.title, r.artist, artworks);
      if (!match) {
        unmatched++;
        rows.push({ record: r, matched: null, mismatches: null });
        continue;
      }

      matched++;
      const mm = compareRecordToArtwork(r, match.artwork);
      if (mm.length) mismatched++;

      rows.push({
        record: r,
        matched: { slug: match.artwork.slug, title: match.artwork.title, artist: match.artwork.artist, strategy: match.strategy },
        mismatches: mm,
      });
    }

    report.pdfs.push({
      file: path.relative(ROOT, pdfPath).replace(/\\/g, '/'),
      pages: parsed.numpages || null,
      extractedChars: (parsed.text || '').length,
      parsedRows: records.length,
      matched,
      unmatched,
      mismatched,
      rows,
    });

    report.totals.rows += records.length;
    report.totals.matched += matched;
    report.totals.unmatched += unmatched;
    report.totals.mismatched += mismatched;
  }

  // Write JSON report
  fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(report, null, 2), 'utf8');

  // Write markdown summary
  const md = [];
  md.push('# Art Names PDF Validation Report');
  md.push('');
  md.push(`Generated: ${report.generatedAt}`);
  md.push('');
  md.push('## Summary');
  md.push('');
  md.push(`- Total rows parsed: ${report.totals.rows}`);
  md.push(`- Matched to system: ${report.totals.matched}`);
  md.push(`- Unmatched: ${report.totals.unmatched}`);
  md.push(`- Matched but with field mismatches: ${report.totals.mismatched}`);
  md.push('');

  for (const p of report.pdfs) {
    md.push(`## ${p.file}`);
    md.push('');
    md.push(`- Pages: ${p.pages}`);
    md.push(`- Extracted characters: ${p.extractedChars}`);
    md.push(`- Rows parsed: ${p.parsedRows}`);
    md.push(`- Matched: ${p.matched}`);
    md.push(`- Unmatched: ${p.unmatched}`);
    md.push(`- Mismatched: ${p.mismatched}`);
    md.push('');

    const unmatchedRows = p.rows.filter((r) => !r.matched).slice(0, 30);
    if (unmatchedRows.length) {
      md.push('### Unmatched (first 30)');
      md.push('');
      for (const u of unmatchedRows) {
        md.push(`- ${u.record.title} — ${u.record.artist || '(artist not detected)'} (raw: ${u.record.raw.slice(0, 120)}…)`);
      }
      md.push('');
    }

    const mismatches = p.rows
      .filter((r) => r.matched && r.mismatches && r.mismatches.length)
      .slice(0, 40);

    if (mismatches.length) {
      md.push('### Mismatches (first 40)');
      md.push('');
      for (const m of mismatches) {
        const fields = m.mismatches.map((x) => x.field).join(', ');
        md.push(`- ${m.record.title} — ${m.record.artist || '(artist not detected)'} → matched: ${m.matched.title} (${m.matched.strategy}); fields: ${fields}`);
      }
      md.push('');
    }
  }

  md.push('## Notes');
  md.push('');
  md.push('- Matching is title/artist heuristic-based; see the JSON for raw rows and extracted fields.');
  md.push('- Year comparisons normalize to the first 4-digit year found (e.g. "c. 1900" → 1900).');
  md.push('- Size comparisons require an exact width/height match against an option; decimals in PDF sizes may not match integer option sizes.');

  fs.writeFileSync(REPORT_MD_PATH, md.join('\n') + '\n', 'utf8');

  console.log('Wrote report:', path.relative(ROOT, REPORT_MD_PATH));
  console.log('Wrote report JSON:', path.relative(ROOT, REPORT_JSON_PATH));
  console.log('Summary:', report.totals);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
