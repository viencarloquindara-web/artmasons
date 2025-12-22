const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_N.pdf)
const artworks = [
  { title: "The Palazzo Contarini", artist: "Friedich Von Nerly", artistLife: "1807-1878", year: "1855", originalSize: "48.5 x 39 cm", price: 6972 },
  { title: "The House of Desdemona", artist: "Friedich Von Nerly", artistLife: "1807-1878", year: "1855", originalSize: "48.5 x 39 cm", price: 7018 },
  { title: "Tunnel In Possilipo Naples", artist: "Friedich Von Nerly", artistLife: "1807-1878", year: "Unknown", originalSize: "126 x 96.5 cm", price: 10012 },
  { title: "View Of Terracina And Monte Circeo", artist: "Friedich Von Nerly", artistLife: "1807-1878", year: "1933", originalSize: "99 x 137.5 cm", price: 8900 }
];

// Get list of image files
const imageDir = './public/image/n/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const nArtworks = [\n';
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

  const sku = `AM-N-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/n/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default nArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/n_artworks_output.ts', output);
console.log('\nOutput written to scripts/n_artworks_output.ts');
