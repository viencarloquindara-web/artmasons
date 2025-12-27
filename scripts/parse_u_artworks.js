const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_U.pdf)
const artworks = [
  { title: "A View Of Venice Rio S Marina", artist: "Franz Richard Unterberger", artistLife: "1838-1902", year: "Unknown", originalSize: "82.5 x 70.5 cm", price: 4936 },
  { title: "The Grand Canal. Venice", artist: "Franz Richard Unterberger", artistLife: "1838-1902", year: "Unknown", originalSize: "46.7 x 34.6 cm", price: 4316 },
  { title: "Venice View From The Zattere With San Giorgio Maggiore In The Distance", artist: "Franz Richard Unterberger", artistLife: "1838-1902", year: "Unknown", originalSize: "80 x 71 cm", price: 4374 },
  { title: "Canal In Venice", artist: "Franz Richard Unterberger", artistLife: "1838-1902", year: "Unknown", originalSize: "79.3 x 119.4 cm", price: 6000 },
  { title: "Banquet Still Life", artist: "Adriaen Van Ultrecht", artistLife: "1599-1652", year: "1644", originalSize: "185 x 242.5 cm", price: 16428 }
];

// Get list of image files
const imageDir = './public/image/u/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const uArtworks = [\n';
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

  const sku = `AM-U-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/u/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default uArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/u_artworks_output.ts', output);
console.log('\nOutput written to scripts/u_artworks_output.ts');
