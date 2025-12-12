/* eslint-disable no-console */

// Applies ART_NAMES*.pdf (A/B/C) values into data/artworks.ts.
// PDFs are treated as the source of truth for:
// - year
// - originalSize (cm)
// - options (single opt1 = selling dimensions + price)
// - basePrice (set to selling price)
//
// Usage:
//   node scripts/apply_art_names_pdfs_to_artworks.js

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

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
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

function isYearToken(token) {
  return /^\d{4}$/.test(token);
}

function isDimsTokenStart(token) {
  return /^\d+(?:\.\d+)?$/.test(token);
}

function parsePriceAed(value) {
  if (!value) return null;
  const s = String(value).replace(/,/g, '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(s)) return null;
  return Number(s);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLooseArtistRegex(name) {
  const parts = String(name)
    .split('-')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => escapeRegExp(p).replace(/\s+/g, '\\s+'));

  const hyphenJoined = parts.join('\\s*-\\s*');
  return new RegExp('(?:^|\\s)' + hyphenJoined + '(?=\\s|$)', 'i');
}

function isLikelyPriceToken(token, prev, next) {
  if (!token) return false;

  if (/^\d{1,3}(?:,\d{3})+$/.test(token)) return true;

  if (!/^\d+$/.test(token)) return false;
  const n = Number(token);
  if (!Number.isFinite(n)) return false;

  // avoid years as prices
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

  if (n < 100 || n > 100000) return false;
  return true;
}

function parsePdfIntoRecords(pdfText, artistNames) {
  const t = normalizeText(pdfText);

  const headerRegex = /ART NAME A-Z ARTIST NAME YEAR ART ORIGINAL DIMENSIONS CM SELLING DIMENSIONS PRICE AED IMAGE/i;
  const stripped = headerRegex.test(t) ? t.replace(headerRegex, '').trim() : t;

  const tokens = tokenize(stripped);
  if (tokens.length === 0) return [];

  const records = [];
  let start = 0;
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

    if (i + 1 < tokens.length && isNextTitleStart(i + 1)) {
      const chunk = tokens.slice(start, i + 1);
      if (chunk.length > 4) records.push(chunk);

      start = i + 1;
      if (start < tokens.length && /^[A-Z]$/.test(tokens[start]) && isNextTitleStart(start + 1)) {
        start = start + 1;
      }
    }
  }

  const artistRegexes = artistNames.map((name) => ({ name, re: buildLooseArtistRegex(name) }));

  const out = [];
  for (const chunk of records) {
    const raw = chunk.join(' ');
    const priceToken = chunk[chunk.length - 1];
    const priceAed = parsePriceAed(priceToken);

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

    // If we can't reliably detect the artist from the system list, the rest of
    // the parsing (title/year/dims) becomes unreliable. Skip.
    if (!artist) continue;

    let title = raw;
    if (artist && artistIndex >= 0) {
      title = raw.slice(0, artistIndex).trim();
    }

    const tail = artist && artistIndex >= 0 ? raw.slice(artistIndex + artist.length).trim() : '';
    const tailTokens = tail ? tail.split(/\s+/).filter(Boolean) : [];

    let year = null;
    for (const tt of tailTokens) {
      if (isYearToken(tt)) {
        year = Number(tt);
        break;
      }
    }

    let originalDims = null;
    let sellingDims = null;

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
      return { dims: null, next: idx };
    };

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

      const s = readDimsAt(cursor);
      sellingDims = s.dims;
    }

    // Only keep rows where we can safely set price, and at least one dimension.
    // YEAR can be missing/Unknown; in that case we still update sizes/prices.
    if (priceAed == null) continue;
    if (!sellingDims && !originalDims) continue;

    out.push({ raw, title: title.trim(), artist: artist.trim(), year, originalDims, sellingDims, priceAed });
  }

  return out;
}

function parseArtworksObjectsWithSpans(tsContent) {
  const startIdx = tsContent.indexOf('export const ARTWORKS');
  if (startIdx === -1) throw new Error('Could not find ARTWORKS export');

  const arrayStart = tsContent.indexOf('[', startIdx);
  if (arrayStart === -1) throw new Error('Could not find ARTWORKS array start');

  const objects = [];
  let i = arrayStart;
  while (i < tsContent.length) {
    const nextObjStart = tsContent.indexOf('{', i);
    const nextArrayEnd = tsContent.indexOf('];', i);
    if (nextArrayEnd !== -1 && (nextObjStart === -1 || nextArrayEnd < nextObjStart)) break;
    if (nextObjStart === -1) break;

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

    if (title && artist) {
      objects.push({
        start: nextObjStart,
        end: j,
        text: objText,
        title,
        artist,
        slug: generateSlug(title),
      });
    }

    i = j;
  }

  return objects;
}

function buildArtistNames(artworkObjects) {
  const set = new Set();
  for (const a of artworkObjects) {
    if (a.artist) set.add(String(a.artist).trim());
  }
  const names = Array.from(set);
  names.sort((a, b) => b.length - a.length);
  return names;
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

function formatDim(n) {
  if (!Number.isFinite(n)) return '';
  const s = String(n);
  if (s.includes('.')) {
    // keep existing precision but trim trailing zeros
    return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }
  return s;
}

function formatDims(dims) {
  if (!dims) return null;
  return `${formatDim(dims.w)} x ${formatDim(dims.h)} cm`;
}

function escapeDoubleQuotedString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
}

function removePropLines(objText, key) {
  // Remove all occurrences of a top-level property line like:
  //   year: "1882",
  //   basePrice: 650,
  // Keeps surrounding content intact.
  // Match a whole property line and its line break, but do NOT consume
  // indentation of the following line.
  // Supports both LF and CRLF.
  const re = new RegExp(`(^|\\r?\\n)[\\t ]*${key}:\\s*[^\\r\\n]*,\\r?\\n`, 'g');
  return objText.replace(re, '$1');
}

function insertPropLineAfter(objText, anchorKey, key, rhsText) {
  const anchorRe = new RegExp(`(^|\\r?\\n)([\\t ]*)${anchorKey}:\\s*[^\\r\\n]*,`, 'm');
  const m = objText.match(anchorRe);
  if (!m) return objText;
  const indent = m[2] || '    ';
  const line = `${indent}${key}: ${rhsText},`;
  return objText.replace(anchorRe, (full) => `${full}\n${line}`);
}

function setQuotedStringProp(objText, key, value, preferredAnchorKey) {
  const safe = escapeDoubleQuotedString(value);
  const rhs = `\"${safe}\"`;
  let out = removePropLines(objText, key);

  // Prefer inserting after the provided anchor key if present.
  const anchors = [preferredAnchorKey, 'title', 'artist', 'sku', 'image'].filter(Boolean);
  for (const a of anchors) {
    const candidate = insertPropLineAfter(out, a, key, rhs);
    if (candidate !== out) return candidate;
  }
  return out;
}

function setNumberProp(objText, key, value, preferredAnchorKey) {
  let out = removePropLines(objText, key);
  const rhs = String(value);

  const anchors = [preferredAnchorKey, 'sku', 'artist', 'image'].filter(Boolean);
  for (const a of anchors) {
    const candidate = insertPropLineAfter(out, a, key, rhs);
    if (candidate !== out) return candidate;
  }
  return out;
}

function replaceOptionsWithSingleOpt1(objText, sellingDims, priceAed) {
  if (!sellingDims || priceAed == null) return objText;

  const lineMatch = objText.match(/(^|\r?\n)([\t ]*)options\s*:/m);
  const indent = lineMatch ? lineMatch[2] : '    ';
  const itemIndent = indent + '  ';
  const block =
    `${indent}options: [\n` +
    `${itemIndent}{ id: 'opt1', width: ${sellingDims.w}, height: ${sellingDims.h}, price: ${priceAed}, label: 'Original Size' },\n` +
    `${indent}],`;

  const optionsKeyIdx = objText.search(/(^|\r?\n)[\t ]*options\s*:/m);
  if (optionsKeyIdx !== -1) {
    const optionsIdx = objText.indexOf('options', optionsKeyIdx);
    const bracketStart = objText.indexOf('[', optionsIdx);
    if (bracketStart !== -1) {
      let depth = 0;
      let inString = false;
      let stringQuote = null;
      let escape = false;
      let endBracket = -1;

      for (let i = bracketStart; i < objText.length; i++) {
        const ch = objText[i];
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

        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringQuote = ch;
          continue;
        }

        if (ch === '[') depth++;
        if (ch === ']') {
          depth--;
          if (depth === 0) {
            endBracket = i;
            break;
          }
        }
      }

      if (endBracket !== -1) {
        const lineStart = objText.lastIndexOf('\n', optionsIdx);
        const replaceStart = lineStart === -1 ? 0 : lineStart + 1;

        let replaceEnd = endBracket + 1;
        // Consume trailing spaces and optional comma after the options array.
        while (replaceEnd < objText.length && (objText[replaceEnd] === ' ' || objText[replaceEnd] === '\t')) replaceEnd++;
        if (objText[replaceEnd] === ',') replaceEnd++;

        return objText.slice(0, replaceStart) + block + objText.slice(replaceEnd);
      }
    }
  }

  // If options doesn't exist (unexpected), add it near end before closing brace.
  const closeIdx = objText.lastIndexOf('}');
  if (closeIdx === -1) return objText;
  const before = objText.slice(0, closeIdx).trimEnd();
  const after = objText.slice(closeIdx);
  return `${before}\n${block}\n${after}`;
}

function getMaxSkuNumber(tsContent, prefix) {
  const re = new RegExp(`sku:\\s*(?:\"${escapeRegExp(prefix)}-(\\d{3})\"|'${escapeRegExp(prefix)}-(\\d{3})')`, 'g');
  let m;
  let max = 0;
  while ((m = re.exec(tsContent)) !== null) {
    const n = Number(m[1] || m[2]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

function buildArtworkObjectText({ title, artist, year, originalSize, sellingDims, priceAed, image, sku }) {
  const lines = [];
  lines.push('  {');
  lines.push(`    title: "${String(title).replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}",`);
  lines.push(`    artist: "${String(artist).replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}",`);
  if (year) lines.push(`    year: "${year}",`);
  if (originalSize) lines.push(`    originalSize: "${originalSize}",`);
  lines.push(`    image: "${image}",`);
  lines.push(`    sku: "${sku}",`);
  lines.push(`    basePrice: ${priceAed},`);
  lines.push('    currency: "AED",');
  lines.push('    options: [');
  lines.push(`      { id: 'opt1', width: ${sellingDims.w}, height: ${sellingDims.h}, price: ${priceAed}, label: 'Original Size' },`);
  lines.push('    ],');
  lines.push('  },');
  return lines.join('\n');
}

async function main() {
  if (PDF_PATHS.length === 0) {
    console.error('No PDFs found. Expected one or more of:', 'data/ART_NAMES.pdf', 'data/ART_NAMES_B.pdf', 'data/ART_NAMES_C.pdf');
    process.exit(1);
  }

  const ts = fs.readFileSync(ARTWORKS_PATH, 'utf8');
  const artworkObjects = parseArtworksObjectsWithSpans(ts);
  const artistNames = buildArtistNames(artworkObjects);

  const allRecords = [];
  for (const pdfPath of PDF_PATHS) {
    const buf = fs.readFileSync(pdfPath);
    const parsed = await pdf(buf);
    const records = parsePdfIntoRecords(parsed.text || '', artistNames);
    for (const r of records) allRecords.push(r);
  }

  const edits = [];
  const unmatched = [];
  const updatedSlugs = new Set();

  for (const record of allRecords) {
    const match = findBestMatchByTitle(record.title, record.artist, artworkObjects);
    if (!match) {
      unmatched.push(record);
      continue;
    }

    // Only accept high-confidence matches to avoid overlapping edits.
    if (match.strategy !== 'slug' && match.strategy !== 'title_exact' && match.strategy !== 'title_normalized') {
      unmatched.push(record);
      continue;
    }

    if (updatedSlugs.has(match.artwork.slug)) continue;
    updatedSlugs.add(match.artwork.slug);

    const obj = match.artwork;
    let nextText = obj.text;

    if (record.year) nextText = setQuotedStringProp(nextText, 'year', String(record.year), 'title');

    const orig = formatDims(record.originalDims);
    if (orig) nextText = setQuotedStringProp(nextText, 'originalSize', orig, 'year');

    if (record.priceAed != null) {
      nextText = setNumberProp(nextText, 'basePrice', record.priceAed, 'sku');
      nextText = setQuotedStringProp(nextText, 'currency', 'AED', 'basePrice');
    }

    if (record.sellingDims && record.priceAed != null) {
      nextText = replaceOptionsWithSingleOpt1(nextText, record.sellingDims, record.priceAed);
    }

    if (nextText !== obj.text) {
      edits.push({ start: obj.start, end: obj.end, replacement: nextText });
    }
  }

  // Apply edits from end to start.
  edits.sort((a, b) => b.start - a.start);
  let nextTs = ts;
  for (const e of edits) {
    nextTs = nextTs.slice(0, e.start) + e.replacement + nextTs.slice(e.end);
  }

  // Add Dora Wheeler (known unmatched) if present.
  const dora = unmatched.find((r) => generateSlug(r.title) === generateSlug('Dora Wheeler') && /chase/i.test(r.artist));
  if (dora && dora.sellingDims && dora.priceAed != null) {
    const already = nextTs.toLowerCase().includes('title: "dora wheeler"') || nextTs.toLowerCase().includes("title: 'dora wheeler'");
    if (!already) {
      const maxC = getMaxSkuNumber(nextTs, 'AM-C');
      const nextSku = `AM-C-${String(maxC + 1).padStart(3, '0')}`;

      const newObj = buildArtworkObjectText({
        title: 'Dora Wheeler',
        artist: dora.artist,
        year: dora.year ? String(dora.year) : null,
        originalSize: formatDims(dora.originalDims),
        sellingDims: dora.sellingDims,
        priceAed: dora.priceAed,
        image: '/image/starry-night.webp',
        sku: nextSku,
      });

      // Insert after the *object* for "A Corner Of My Studio" if present.
      const anchorSlug = generateSlug('A Corner Of My Studio');
      const objsAfter = parseArtworksObjectsWithSpans(nextTs);
      const anchorObj = objsAfter.find((o) => generateSlug(o.title) === anchorSlug);

      if (anchorObj) {
        let insertPos = anchorObj.end;
        // anchorObj.end is just after the closing '}' of the object.
        if (nextTs[insertPos] === ',') insertPos++;
        nextTs = nextTs.slice(0, insertPos) + `\n${newObj}\n` + nextTs.slice(insertPos);
      } else {
        const arrayEnd = nextTs.lastIndexOf('];');
        if (arrayEnd !== -1) nextTs = nextTs.slice(0, arrayEnd) + `\n${newObj}\n` + nextTs.slice(arrayEnd);
      }

      console.log(`Added new artwork: Dora Wheeler (sku ${nextSku})`);
    }
  }

  fs.writeFileSync(ARTWORKS_PATH, nextTs, 'utf8');

  console.log('Done. Summary:');
  console.log(`- PDFs processed: ${PDF_PATHS.length}`);
  console.log(`- PDF records: ${allRecords.length}`);
  console.log(`- Updated existing artworks: ${edits.length}`);
  console.log(`- Unmatched records remaining: ${unmatched.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
