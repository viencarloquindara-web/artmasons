const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_Z.pdf)
const artworks = [
  { title: "The Favourite Of The King", artist: "Eduardo Zamacois Y Zabala", artistLife: "1842-1871", year: "1867", originalSize: "56 x 45 cm", price: 23511 },
  { title: "A Momentary Diversion", artist: "Eduardo Zamacois Y Zabala", artistLife: "1842-1871", year: "1868", originalSize: "35.5 x 27 cm", price: 11590 },
  { title: "In Werners Rowing Boat", artist: "Anders Zorn", artistLife: "1860-1920", year: "1917", originalSize: "82 x 51 cm", price: 4083 },
  { title: "Morning Toilet With His Mother", artist: "Anders Zorn", artistLife: "1860-1920", year: "1888", originalSize: "60 x 36 cm", price: 2961 },
  { title: "Night Effect", artist: "Anders Zorn", artistLife: "1860-1920", year: "1895", originalSize: "101 x 66 cm", price: 4813 },
  { title: "Opal", artist: "Anders Zorn", artistLife: "1860-1920", year: "1891", originalSize: "100.3 x 69.5 cm", price: 4334 },
  { title: "St Francis In Ecstasy", artist: "Francisco de Zurbaran", artistLife: "1598-1664", year: "1660", originalSize: "66 x 53 cm", price: 4368 },
  { title: "Agnus Dei", artist: "Francisco de Zurbaran", artistLife: "1598-1664", year: "1635", originalSize: "37.3 x 62 cm", price: 4666 },
  { title: "St Francis In Meditation", artist: "Francisco de Zurbaran", artistLife: "1598-1664", year: "1639", originalSize: "162 x 137 cm", price: 10360 },
  { title: "The Immaculate Conception", artist: "Francisco de Zurbaran", artistLife: "1598-1664", year: "Unknown", originalSize: "91 x 71 cm", price: 7360 },
  { title: "A Cup Of Water And A Rose On A Silver Plate", artist: "Francisco de Zurbaran", artistLife: "1598-1664", year: "1630", originalSize: "21.2 x 30.1 cm", price: 3932 }
];

// Get list of image files
const imageDir = './public/image/z/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles.length);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const zArtworks = [\n';
let skuCounter = 1;

artworks.forEach((artwork) => {
  // Create a normalized title for matching with image filename
  const normalizedTitle = artwork.title.toLowerCase();
  
  // Find matching image
  const imageFile = imageFiles.find(img => {
    const imgName = img.replace('.jpg', '').toLowerCase();
    return imgName === normalizedTitle;
  });

  if (!imageFile) {
    console.log(`WARNING: No image found for "${artwork.title}"`);
    return;
  }

  const sku = `AM-Z-${String(skuCounter).padStart(3, '0')}`;
  skuCounter++;

  // Parse dimensions
  const [width, height] = artwork.originalSize.replace(' cm', '').split(' x ').map(v => parseFloat(v));

  output += `  {
    title: "${artwork.title}",
    year: "${artwork.year}",
    originalSize: "${artwork.originalSize}",
    artist: "${artwork.artist}",
    artistLife: "${artwork.artistLife}",
    sku: "${sku}",
    basePrice: ${artwork.price},
    currency: "AED",
    image: "/image/z/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default zArtworks;\n';

console.log(`Total artworks processed: ${skuCounter - 1}`);
console.log('\nOutput written to scripts/z_artworks_output.ts');

// Write to file
fs.writeFileSync('./scripts/z_artworks_output.ts', output);
