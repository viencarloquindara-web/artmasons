/* eslint-disable no-console */

// Reports duplicates in data/artworks.ts
// Usage:
//   node scripts/find_duplicate_artworks.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTWORKS_PATH = path.join(ROOT, 'data', 'artworks.ts');

function generateSlug(title) {
	return String(title)
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

function lineOf(text, idx) {
	return text.slice(0, idx).split(/\r?\n/).length;
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
		const sku = getQuoted('sku') ?? null;
		const image = getQuoted('image') ?? null;

		if (title && artist) {
			objects.push({
				start: nextObjStart,
				end: j,
				line: lineOf(tsContent, nextObjStart),
				title,
				artist,
				slug: generateSlug(title),
				sku,
				image,
			});
		}

		i = j;
	}

	return objects;
}

function groupBy(items, keyFn) {
	const map = new Map();
	for (const item of items) {
		const key = keyFn(item);
		if (!map.has(key)) map.set(key, []);
		map.get(key).push(item);
	}
	return map;
}

function printGroup(title, entries) {
	console.log(`\n${title}: ${entries.length}`);
	for (const [key, arr] of entries) {
		console.log(`\n- ${key} (${arr.length})`);
		for (const o of arr) {
			console.log(`  • ${o.artist} — ${o.title} | sku: ${o.sku ?? '-'} | image: ${o.image ?? '-'} | line ${o.line}`);
		}
	}
}

function main() {
	const ts = fs.readFileSync(ARTWORKS_PATH, 'utf8');
	const artworks = parseArtworksObjectsWithSpans(ts);

	const dupTitleSlug = [...groupBy(artworks, (o) => o.slug).entries()].filter(([, arr]) => arr.length > 1);

	const dupArtistTitle = [...groupBy(artworks, (o) => `${generateSlug(o.artist)}::${o.slug}`).entries()].filter(
		([, arr]) => arr.length > 1
	);

	const dupSku = [...groupBy(artworks, (o) => (o.sku ? String(o.sku).toLowerCase() : '')).entries()].filter(
		([k, arr]) => k && arr.length > 1
	);

	const dupImage = [...groupBy(artworks, (o) => (o.image ? String(o.image).toLowerCase() : '')).entries()].filter(
		([k, arr]) => k && arr.length > 1
	);

	console.log('Total artworks parsed:', artworks.length);
	printGroup('Duplicate title slug (global)', dupTitleSlug);
	printGroup('Duplicate artist+title (slug-based)', dupArtistTitle);
	printGroup('Duplicate SKU', dupSku);
	printGroup('Duplicate image path', dupImage);
}

main();