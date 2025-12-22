const fs = require('fs');
const pdf = require('pdf-parse');

// Function to convert title to image filename
function titleToFilename(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to calculate price based on dimensions
function calculatePrice(width, height) {
  const area = width * height;
  if (area <= 2000) return 1200;
  if (area <= 4000) return 3000;
  if (area <= 6000) return 5000;
  if (area <= 8000) return 7000;
  if (area <= 10000) return 9000;
  if (area <= 15000) return 12000;
  if (area <= 20000) return 15000;
  return Math.ceil(area / 1000) * 800;
}

(async () => {
  const dataBuffer = fs.readFileSync('data/ART_DETAILS_F.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;

  // Parse the PDF data - each row has: Title, Artist, Year, OrigSize1, OrigSize2, Size1, Size2, Price, ArtistLife
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && l !== 'F');
  
  const artworks = [];
  let currentArtwork = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header-like lines
    if (line.match(/^\d{4}-$/)) continue;
    
    // Look for artwork title patterns - typically long strings that are not just numbers
    if (!line.match(/^\d+(\.\d+)?$/) && !line.match(/^\d{4}$/)) {
      // Check if this could be a title
      if (currentArtwork && currentArtwork.title && !currentArtwork.artist) {
        // This might be the artist name
        currentArtwork.artist = line;
      } else if (currentArtwork && currentArtwork.artist && !currentArtwork.year) {
        // This might be year or we have incomplete data, try to determine
        if (line.match(/^\d{4}$/) || line.toLowerCase() === 'unknown') {
          currentArtwork.year = line === 'Unknown' ? 'Unknown' : line;
        }
      } else {
        // Start a new artwork
        if (currentArtwork && currentArtwork.title && currentArtwork.artist) {
          artworks.push(currentArtwork);
        }
        currentArtwork = { title: line };
      }
    }
  }
  
  // Add last artwork
  if (currentArtwork && currentArtwork.title && currentArtwork.artist) {
    artworks.push(currentArtwork);
  }

  // Now parse more carefully using regex
  const rawText = text.replace(/\n+/g, ' ');
  
  // Better parsing approach - extract structured data
  const artworkData = [];
  const imageFiles = fs.readdirSync('public/image/f/').filter(f => f.endsWith('.jpg'));
  
  // Manual parsing based on the PDF structure
  const entries = [
    { title: "The Goldfinch", artist: "Carel Fabritius", year: "1654", width: 33.4, height: 22.8, price: 1671, artistLife: "1622-1654", image: "the-goldfinch.jpg" },
    { title: "The Beheading Of Saint John The Baptist", artist: "Carel Fabritius", year: "1640", width: 149, height: 121, price: 16841, artistLife: "1622-1654", image: "the-beheading-of-saint-john-the-baptist.jpg" },
    { title: "The Sentry", artist: "Carel Fabritius", year: "1654", width: 67, height: 58, price: 1654, artistLife: "1622-1654", image: "the-sentry.jpg" },
    { title: "Roses And Lilies", artist: "Henri Fantin Latour", year: "1888", width: 59.7, height: 45.7, price: 4122, artistLife: "1836-1904", image: "rose-and-lilies.jpg" },
    { title: "Still Life With Roses And Fruit", artist: "Henri Fantin Latour", year: "1868", width: 34.6, height: 41.6, price: 3276, artistLife: "1836-1904", image: "still-life-with-roses-and-fruit.jpg" },
    { title: "The Reader", artist: "Henri Fantin Latour", year: "1861", width: 100, height: 83, price: 4964, artistLife: "1836-1904", image: "the-reader.jpg" },
    { title: "The Dressed Table", artist: "Henri Fantin Latour", year: "1866", width: 60, height: 74, price: 6065, artistLife: "1836-1904", image: "the-dressed-table.jpg" },
    { title: "Peaches And Grapes", artist: "Henri Fantin Latour", year: "1894", width: 27.3, height: 36.4, price: 2875, artistLife: "1836-1904", image: "peaches-and-grapes.jpg" },
    { title: "Nanna", artist: "Anselm Feuerbach", year: "1861", width: 91, height: 66, price: 5651, artistLife: "1829-1880", image: "nanna.jpg" },
    { title: "Nanna", artist: "Anselm Feuerbach", year: "1861", width: 74.5, height: 62, price: 5240, artistLife: "1829-1880", image: "nanna-1.jpg" },
    { title: "Self Portrait", artist: "Anselm Feuerbach", year: "1854", width: 92, height: 73, price: 5612, artistLife: "1829-1880", image: "self-portrait.jpg" },
    { title: "Mandolin Player", artist: "Anselm Feuerbach", year: "1868", width: 137, height: 98.5, price: 8568, artistLife: "1829-1880", image: "mandolin-player.jpg" },
    { title: "Portrait Of Princess Zinaida Yusupova With Two Sons At Arkhangelskoe", artist: "Francois Flameng", year: "1894", width: 75, height: 59, price: 6988, artistLife: "1856-1923", image: "portrait-of-princess-zinaida-yusupova-with-two-sons-at-arkhangelskoe.jpg" },
    { title: "Family Portrait Of A Boy And His Two Sisters", artist: "Francois Flameng", year: "1900", width: 65, height: 54, price: 3854, artistLife: "1856-1923", image: "family-portrait-of-a-boy-and-his-two-sisters.jpg" },
    { title: "Nude Youth Sitting By The Sea", artist: "Hippolyte Flandrin", year: "1836", width: 98, height: 124, price: 8633, artistLife: "1809-1864", image: "nude-youth-sitting-by-the-sea.jpg" },
    { title: "Madam Hippolyte Flandrin", artist: "Hippolyte Flandrin", year: "1846", width: 83, height: 66, price: 7800, artistLife: "1809-1864", image: "madam-hippolyte-flandrin.jpg" },
    { title: "Maria-Anne De Bourbon Duchesse De Vendome", artist: "Hippolyte Flandrin", year: "1839", width: 77, height: 59, price: 8113, artistLife: "1809-1864", image: "maria-anne-de-bourbon-duchesse-de-vendome.jpg" },
    { title: "Still Life With Bread And Confectinary", artist: "Georg Flegel", year: "Unknown", width: 21.9, height: 17.1, price: 6026, artistLife: "1566-1638", image: "still-life-with-bread-and-confectinary.jpg" },
    { title: "Still Life Pretzels, Nuts and Almonds", artist: "Georg Flegel", year: "1637", width: 19.3, height: 14.6, price: 9348, artistLife: "1566-1638", image: "still-life-pretzels-nuts-and-almonds.jpg" },
    { title: "Snack With Fried Eggs", artist: "Georg Flegel", year: "1630", width: 23.6, height: 20.2, price: 9845, artistLife: "1566-1638", image: "snack-with-fried-eggs.jpg" },
    { title: "Meal With Pike Head", artist: "Georg Flegel", year: "Unknown", width: 31.4, height: 40, price: 17932, artistLife: "1566-1638", image: "meal-with-pike-head.jpg" },
    { title: "Swans In The Reeds", artist: "Caspar David Friedrich", year: "1820", width: 34, height: 44, price: 3698, artistLife: "1774-1840", image: "swans-in-the-reeds.jpg" },
    { title: "Caroline On The Stairs", artist: "Caspar David Friedrich", year: "1825", width: 73.6, height: 52, price: 3844, artistLife: "1774-1840", image: "caroline-on-the-stairs.jpg" },
    { title: "Ship In The Polar Sea", artist: "Caspar David Friedrich", year: "1798", width: 29.6, height: 21.9, price: 3011, artistLife: "1774-1840", image: "ship-in-the-polar-sea.jpg" },
  ];

  // Generate TypeScript code
  let tsCode = 'export const fArtworks = [\n';
  let skuCounter = 1;
  
  // Track duplicate titles
  const titleCounts = {};
  
  for (const entry of entries) {
    const imagePath = `/image/f/${entry.image}`;
    
    // Check if image exists
    const imageExists = imageFiles.some(f => f.toLowerCase() === entry.image.toLowerCase());
    if (!imageExists) {
      console.log(`Warning: Image not found for ${entry.title} (looking for ${entry.image})`);
      continue;
    }

    // Handle duplicate titles by adding suffix
    let displayTitle = entry.title;
    if (titleCounts[entry.title]) {
      titleCounts[entry.title]++;
      // For Nanna, we already have nanna.jpg and nanna-1.jpg
      // Don't modify the display title, just use different images
    } else {
      titleCounts[entry.title] = 1;
    }

    const sku = `AM-F-${String(skuCounter).padStart(3, '0')}`;
    const price = entry.price;

    tsCode += `  {\n`;
    tsCode += `    title: "${entry.title}",\n`;
    if (entry.year) tsCode += `    year: "${entry.year}",\n`;
    tsCode += `    originalSize: "${entry.width} x ${entry.height} cm",\n`;
    tsCode += `    artist: "${entry.artist}",\n`;
    if (entry.artistLife) tsCode += `    artistLife: "${entry.artistLife}",\n`;
    tsCode += `    sku: "${sku}",\n`;
    tsCode += `    basePrice: ${price},\n`;
    tsCode += `    currency: "AED",\n`;
    tsCode += `    image: "${imagePath}",\n`;
    tsCode += `    options: [{ id: 'opt1', width: ${entry.width}, height: ${entry.height}, price: ${price}, label: 'Original Size' }],\n`;
    tsCode += `  },\n\n`;
    
    skuCounter++;
  }

  tsCode += '];\n\nexport default fArtworks;\n';

  console.log('Generated TypeScript code:');
  console.log(tsCode);
  
  fs.writeFileSync('scripts/f_artworks_output.ts', tsCode);
  console.log('\n✓ Output saved to scripts/f_artworks_output.ts');
})();
