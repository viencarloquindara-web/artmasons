const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_Y.pdf)
const artworks = [
  { title: "Saint Catherine", artist: "Fernando Yanez De La Almedina", artistLife: "1506-1526", year: "1510", originalSize: "212 x 112 cm", price: 24430 },
  { title: "In The Harem", artist: "Adolphe Yvon", artistLife: "1817-1893", year: "1873", originalSize: "47 x 55.5 cm", price: 3021 },
  { title: "Napoleon III", artist: "Adolphe Yvon", artistLife: "1817-1893", year: "1868", originalSize: "55.7 x 46.7 cm", price: 3021 }
];

// Get list of image files
const imageDir = './public/image/y/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles.length);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const yArtworks = [\n';
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

  const sku = `AM-Y-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/y/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default yArtworks;\n';

console.log(`Total artworks processed: ${skuCounter - 1}`);
console.log('\nOutput written to scripts/y_artworks_output.ts');

// Write to file
fs.writeFileSync('./scripts/y_artworks_output.ts', output);
