const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_J.pdf)
const artworks = [
  { title: "Banquet In The Thames Tunnel", artist: "George Jones", artistLife: "1786-1869", year: "1827", originalSize: "37.5 x 32.5 cm", price: 2340 },
  { title: "Portrait Of Louis XV", artist: "Augustin Justinat", artistLife: "Unknown-1743", year: "1717", originalSize: "85 x 75 cm", price: 8624 },
  { title: "Rotterdam", artist: "Johann Jongkind", artistLife: "1819-1891", year: "1869", originalSize: "20 x 25 cm", price: 984 },
  { title: "The Port Of Dordrecht", artist: "Johann Jongkind", artistLife: "1819-1891", year: "1869", originalSize: "32 x 52 cm", price: 1728 }
];

// Get list of image files
const imageDir = './public/image/j/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const jArtworks = [\n';
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

  const sku = `AM-J-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/j/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default jArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/j_artworks_output.ts', output);
console.log('\nOutput written to scripts/j_artworks_output.ts');
