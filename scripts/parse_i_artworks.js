const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_I.pdf)
const artworks = [
  { title: "A Bit Of Roman Aqueduct", artist: "George Inness", artistLife: "1830-1894", year: "1852", originalSize: "20.3 x 25.4 cm", price: 2440 },
  { title: "Autumn Oaks", artist: "George Inness", artistLife: "1836-1894", year: "1878", originalSize: "54.3 x 76.5 cm", price: 2500 },
  { title: "Children Of The Sea", artist: "Jozef Israels", artistLife: "1825-1911", year: "1872", originalSize: "48.5 x 93.5 cm", price: 3322 },
  { title: "Domtesse D'Haussonvile", artist: "Jean-August Dominique Ingres", artistLife: "1780-1867", year: "1845", originalSize: "131.7 x 92 cm", price: 14992 },
  { title: "Golden Glow (The Golden Sun)", artist: "George Inness", artistLife: "1838-1894", year: "1894", originalSize: "61 x 91.4 cm", price: 2440 },
  { title: "Hudson River Valley", artist: "George Inness", artistLife: "1833-1894", year: "1867", originalSize: "61 x 87.6 cm", price: 2650 },
  { title: "Landscape Sunset", artist: "George Inness", artistLife: "1834-1894", year: "1889", originalSize: "56.3 x 91.8 cm", price: 2685 },
  { title: "Landscape", artist: "George Inness", artistLife: "1835-1894", year: "1848", originalSize: "74.9 x 113 cm", price: 3614 },
  { title: "Morning, Catskill Valley", artist: "George Inness", artistLife: "1827-1894", year: "1894", originalSize: "91 x 122 cm", price: 4475.74 },
  { title: "Sundown Near Montclair", artist: "George Inness", artistLife: "1828-1894", year: "1885", originalSize: "51 x 66 cm", price: 2068 },
  { title: "The Clouded Sun", artist: "George Inness", artistLife: "1825-1894", year: "1891", originalSize: "76.2 x 114.3 cm", price: 5996 },
  { title: "The Home At Monclair", artist: "George Inness", artistLife: "1826-1894", year: "1892", originalSize: "72.7 x 114.3 cm", price: 5920 },
  { title: "Villa Borgese, Rome", artist: "George Inness", artistLife: "1837-1894", year: "1857", originalSize: "10.8 x 17.8 cm", price: 2500 },
];

// Get list of image files
const imageDir = './public/image/i/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const iArtworks = [\n';
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

  const sku = `AM-I-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/i/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default iArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/i_artworks_output.ts', output);
console.log('\nOutput written to scripts/i_artworks_output.ts');
