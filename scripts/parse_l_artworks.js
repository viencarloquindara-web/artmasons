const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_L.pdf)
const artworks = [
  { title: "A Boat On The Marne", artist: "Henri Lebasque", artistLife: "1865-1937", year: "1905", originalSize: "65.2 x 92 cm", price: 2809 },
  { title: "A Favorite Greyhound Of Prince Albert", artist: "Sir Edwin Henry Landseer", artistLife: "1802-1873", year: "1841", originalSize: "11.8 x 142.9 cm", price: 8125 },
  { title: "Children In The Meadow", artist: "Henri Lebasque", artistLife: "1865-1937", year: "1906", originalSize: "54 x 65.5 cm", price: 2099 },
  { title: "Chloe", artist: "Jules Joseph Lefebvre", artistLife: "1836-1911", year: "1875", originalSize: "260 x 139 cm", price: 6630 },
  { title: "Flaming June", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1895", originalSize: "120.6 x 120.6 cm", price: 9400 },
  { title: "Hhareem Life Constantinople", artist: "John Frederick Lewis", artistLife: "1805-1876", year: "1857", originalSize: "47.5 x 30.5 cm", price: 5773 },
  { title: "Monarch Of The Glen", artist: "Sir Edwin Henry Landseer", artistLife: "1802-1873", year: "1851", originalSize: "163.8 x 169 cm", price: 10451 },
  { title: "Mrs James Guthrie", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1864", originalSize: "210.7 x 138.5 cm", price: 7676 },
  { title: "Nude Lying", artist: "Henri Lebasque", artistLife: "1865-1937", year: "Unknown", originalSize: "46.5 x 73 cm", price: 2634 },
  { title: "Pavonia", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1859", originalSize: "53.3 x 42 cm", price: 4084 },
  { title: "Phoebe", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "Unknown", originalSize: "56 x 61 cm", price: 4084 },
  { title: "Portrait Of Eugine-Louis-Napoleon Bonaparte", artist: "Jules Joseph Lefebvre", artistLife: "1836-1911", year: "1874", originalSize: "61 x 46 cm", price: 3748 },
  { title: "The Fisherman And The Syren", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1867", originalSize: "66.4 x 49 cm", price: 4691 },
  { title: "The Grasshopper", artist: "Jules Joseph Lefebvre", artistLife: "1836-1911", year: "1872", originalSize: "186.7 x 123.8 cm", price: 6303 },
  { title: "The Green Coat", artist: "Sir John Lavery", artistLife: "1856-1941", year: "1926", originalSize: "198.4 x 107.8 cm", price: 22043 },
  { title: "The Japanese Bathrobe", artist: "Henri Lebasque", artistLife: "1865-1937", year: "1926", originalSize: "61 x 50.3 cm", price: 2019 },
  { title: "The Nymph Of The River", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1880", originalSize: "76.8 x 27.2 cm", price: 4387 },
  { title: "The Painters Honeymoon", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1864", originalSize: "83.8 x 76.8 cm", price: 5259 },
  { title: "The Resting In Saint Tropez", artist: "Henri Lebasque", artistLife: "1865-1937", year: "1906", originalSize: "88.8 x 115.8 cm", price: 3500 },
  { title: "The Roman Lady (La Nana)", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1858", originalSize: "80 x 52.1 cm", price: 5118 },
  { title: "There's No Place Like Home", artist: "Sir Edwin Henry Landseer", artistLife: "1802-1873", year: "Unknown", originalSize: "60 x 70 cm", price: 4532 },
  { title: "Wedded", artist: "Lord Frederick Leighton", artistLife: "1830-1896", year: "1882", originalSize: "145.4 x 81.3 cm", price: 6607 }
];

// Get list of image files
const imageDir = './public/image/l/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const lArtworks = [\n';
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

  const sku = `AM-L-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/l/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default lArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/l_artworks_output.ts', output);
console.log('\nOutput written to scripts/l_artworks_output.ts');
