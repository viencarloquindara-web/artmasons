const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', 'ART_DETAILS_L.pdf');

// Known image filenames from user (normalized)
const knownImages = [
  'a boat on the marne',
  'a favorite greyhound of prince albert',
  'children in the meadow',
  'chloe',
  'flaming june',
  'hhareem life constantinople',
  'monarch of the glen',
  'mrs james guthrie',
  'nude lying',
  'pavonia',
  'phoebe',
  'portrait of eugine-louis-napoleon bonaparte',
  'the fisherman and the syren',
  'the grasshopper',
  'the green coat',
  'the japanese bathrobe',
  'the nymph of the river',
  'the painters honeymoon',
  'the resting in saint tropez',
  'the roman lady (la nana)',
  "there's no place like home",
  'wedded'
];

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF not found at', PDF_PATH);
    process.exit(1);
  }

  const data = fs.readFileSync(PDF_PATH);
  const textData = await pdf(data);
  const text = textData.text || '';

  console.log('Extracting text from PDF...\n');
  
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  
  // Manual parsing based on observed structure
  const artworks = [];
  
  // Pattern observed:
  // Line: Title
  // Line: Artist First/Middle
  // Line: Artist Last + Year or just Artist Last
  // Line: Year (if not on previous line)
  // Lines: Dimensions (can be split)
  // Lines: More dimensions
  // Line: Price
  // Line: Birth year + dash
  // Line: Death year
  
  let i = 1; // Skip "L"
  
  while (i < lines.length) {
    const currentLine = lines[i];
    const normalized = normalizeTitle(currentLine);
    
    // Check if this is one of our known titles
    const matchedImage = knownImages.find(img => {
      const imgNorm = normalizeTitle(img);
      return normalized.includes(imgNorm) || imgNorm.includes(normalized) || normalized === imgNorm;
    });
    
    if (matchedImage) {
      const artwork = {
        title: currentLine,
        artist: '',
        artistLife: '',
        year: '',
        originalSize: '',
        price: 0
      };
      
      i++;
      
      // Manually extract based on example patterns
      // Collect all lines until we hit the next title or birth-death years
      const dataLines = [];
      while (i < lines.length) {
        const line = lines[i];
        
        // Check if we hit artist life years (end of entry)
        if (line.match(/^\d{4}\s*-?\s*$/)) {
          const birthYear = line.replace(/-/, '').trim();
          i++;
          if (i < lines.length && lines[i].match(/^\d{4}$/)) {
            artwork.artistLife = `${birthYear}-${lines[i]}`;
            i++;
          }
          break;
        }
        
        // Check if next line is a title (would be start of new entry)
        const nextNorm = normalizeTitle(line);
        const isNextTitle = knownImages.find(img => {
          const imgNorm = normalizeTitle(img);
          return nextNorm.includes(imgNorm) || imgNorm.includes(nextNorm);
        });
        
        if (isNextTitle) {
          break;
        }
        
        dataLines.push(line);
        i++;
      }
      
      // Now parse dataLines
      let artistParts = [];
      let foundYear = false;
      let dimensions = [];
      
      for (const line of dataLines) {
        // Year: 4-digit number or "Unknown"
        if (!foundYear && (line.match(/^\d{4}$/) || line === 'Unknown')) {
          artwork.year = line;
          foundYear = true;
          continue;
        }
        
        // Dimensions: number followed by "x" or justalone number
        if (line.match(/^\d+(\.\d+)?\s*x?\s*$/)) {
          dimensions.push(line);
          continue;
        }
        
        // Price: 3+ digit number, possibly with comma
        if (line.match(/^\d{3,}(?:,\d+)?$/) && !artwork.price) {
          artwork.price = parseInt(line.replace(/,/g, ''));
          continue;
        }
        
        // Artist name: before year is found
        if (!foundYear && line.match(/^[A-Za-z]/)) {
          artistParts.push(line);
        }
      }
      
      artwork.artist = artistParts.join(' ');
      
      // Parse dimensions
      if (dimensions.length >= 2) {
        const width = dimensions[0].replace(/\s*x\s*$/, '').trim();
        const height = dimensions[1].trim();
        if (width && height && width.match(/^\d/) && height.match(/^\d/)) {
          artwork.originalSize = `${width} x ${height} cm`;
        }
      }
      
      artworks.push(artwork);
    } else {
      i++;
    }
  }

  console.log(`\nExtracted ${artworks.length} artworks\n`);
  
  // Output in the requested format
  console.log('const artworks = [');
  artworks.forEach((artwork, idx) => {
    const comma = idx < artworks.length - 1 ? ',' : '';
    console.log(`  { title: "${artwork.title}", artist: "${artwork.artist}", artistLife: "${artwork.artistLife}", year: "${artwork.year}", originalSize: "${artwork.originalSize}", price: ${artwork.price} }${comma}`);
  });
  console.log('];');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
