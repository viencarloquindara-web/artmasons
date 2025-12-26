const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_O.pdf)
const artworks = [
  { title: "A Cloudy Day, Bluebonnets Near San Antonio, Texas", artist: "Julian Onderdonk", artistLife: "1882-1922", year: "1918", originalSize: "63.8 x 76.5 cm", price: 3313 },
  { title: "October Sunlight", artist: "Julian Onderdonk", artistLife: "1882-1922", year: "1911", originalSize: "22.8 x 30.5 cm", price: 1723 },
  { title: "Fall Landscape", artist: "Julian Onderdonk", artistLife: "1882-1922", year: "Unknown", originalSize: "23 x 30.5 cm", price: 1728 },
  { title: "David Bearing The Head Of Goliath", artist: "Jacob Van Oost The Elder", artistLife: "1601-1671", year: "1643", originalSize: "102 x 81 cm", price: 7049 },
  { title: "Old Woman Praying", artist: "Jacob Van Oost The Elder", artistLife: "1601-1671", year: "Unknown", originalSize: "71.2 x 56.5 cm", price: 5010 },
  { title: "Female Martyr", artist: "Jacob Van Oost The Elder", artistLife: "1601-1671", year: "Unknown", originalSize: "74.3 x 56.8 cm", price: 4855 },
  { title: "Saint Anthony Raising Man From The Dead", artist: "Jacob Van Oost The Elder", artistLife: "1601-1671", year: "1640", originalSize: "176 x 104 cm", price: 8581 },
  { title: "Winston Churchill", artist: "Sir William Orpen", artistLife: "1878-1931", year: "1916", originalSize: "148 x 102.5 cm", price: 6048 },
  { title: "Lieutenant General Sir Arthur Currie", artist: "Sir William Orpen", artistLife: "1878-1931", year: "1919", originalSize: "91.8 x 71.5 cm", price: 4709 },
  { title: "Italia and Germania", artist: "Jonathan Friedrich Overbeck", artistLife: "1789-1869", year: "1828", originalSize: "94.5 x 104.7 cm", price: 15030 },
  { title: "The Marriage of the Virgin", artist: "Jonathan Friedrich Overbeck", artistLife: "1789-1869", year: "1839", originalSize: "89 x 71 cm", price: 25173 },
  { title: "Vittoria Caldoni", artist: "Jonathan Friedrich Overbeck", artistLife: "1789-1869", year: "1821", originalSize: "89.5 x 65.8 cm", price: 13495 },
  { title: "The Raising of Lazarus", artist: "Jonathan Friedrich Overbeck", artistLife: "1789-1869", year: "1808", originalSize: "41 x 53 cm", price: 21726 }
];

// Get list of image files
const imageDir = './public/image/o/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const oArtworks = [\n';
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

  const sku = `AM-O-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/o/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default oArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/o_artworks_output.ts', output);
console.log('\nOutput written to scripts/o_artworks_output.ts');
