const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_T.pdf)
const artworks = [
  { title: "Three Sisters A Study In June Sunlight", artist: "Edward Charles Tarbell", artistLife: "1862-1938", year: "1890", originalSize: "89.2 x 102 cm", price: 5384 },
  { title: "Portrait Of A Lady", artist: "Edward Charles Tarbell", artistLife: "1862-1938", year: "Unknown", originalSize: "86.3 x 61 cm", price: 3493 },
  { title: "The Blue Veil", artist: "Edward Charles Tarbell", artistLife: "1862-1938", year: "1898", originalSize: "73.7 x 61 cm", price: 3079 },
  { title: "Mother And Child In A Boat", artist: "Edward Charles Tarbell", artistLife: "1862-1938", year: "1892", originalSize: "76.5 x 89 cm", price: 3497 },
  { title: "Reverie (Kathering Finn)", artist: "Edward Charles Tarbell", artistLife: "1862-1938", year: "1913", originalSize: "127.3 x 86.7 cm", price: 4522 },
  { title: "Woman Drinking With Sleeping Soldier", artist: "Gerard Ter Boch", artistLife: "1617-1681", year: "1660", originalSize: "46 x 40 cm", price: 5671 },
  { title: "Woman Peeling Apples", artist: "Gerard Ter Boch", artistLife: "1617-1681", year: "1660", originalSize: "36.3 x 30.7 cm", price: 6667 },
  { title: "Man Offering A Woman Cpins", artist: "Gerard Ter Boch", artistLife: "1617-1681", year: "1662", originalSize: "68 x 65 cm", price: 7680 },
  { title: "The Suitor's Visit", artist: "Gerard Ter Boch", artistLife: "1617-1681", year: "1658", originalSize: "80 x 75 cm", price: 11913 },
  { title: "A Lady At Her Toilet", artist: "Gerard Ter Boch", artistLife: "1617-1681", year: "1660", originalSize: "76.2 x 58.4 cm", price: 8976 },
  { title: "Young Woman In A Boat", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1870", originalSize: "50.1 x 64.7 cm", price: 1870 },
  { title: "October", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1877", originalSize: "216 x 108.7 cm", price: 19962 },
  { title: "The Letter", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1876", originalSize: "71.4 x 107.1 cm", price: 9315 },
  { title: "The Gallery Of H M S Calcutta", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1877", originalSize: "68.6 x 91.8 cm", price: 8611 },
  { title: "The Thames", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1876", originalSize: "72.5 x 118 cm", price: 9401 },
  { title: "The Convalescent", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1876", originalSize: "61 x 78 cm", price: 9152 },
  { title: "The Portrait (Miss Lloyd)", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1876", originalSize: "91.4 x 50.8 cm", price: 6667 },
  { title: "The Political Lady", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1883", originalSize: "142.2 x 101.6 cm", price: 15025 },
  { title: "The Shop Girl ( The Millner's Shop)", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1883", originalSize: "146 x 101.6 cm", price: 15025 },
  { title: "On The Thames", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1882", originalSize: "81 x 56 cm", price: 10711 },
  { title: "Richmond Bridge", artist: "James Jaques Joseph Tissot", artistLife: "1836-1902", year: "1878", originalSize: "37 x 23.5 cm", price: 4293 },
  { title: "At The Moulin Rouge, The Dance", artist: "Henri De Toulouse-Lautrec", artistLife: "1864-1901", year: "1890", originalSize: "150 x 115.5 cm", price: 6976 },
  { title: "Marcelle Lender Dancing The Bolero In Chilperic", artist: "Henri De Toulouse-Lautrec", artistLife: "1864-1901", year: "1895", originalSize: "145 x 149 cm", price: 5842 },
  { title: "The Bathers", artist: "Henry Scott Tuke", artistLife: "1858-1929", year: "1889", originalSize: "116.8 x 86.3 cm", price: 6010 },
  { title: "Boys Bathing", artist: "Henry Scott Tuke", artistLife: "1858-1929", year: "1908", originalSize: "61 x 45.7 cm", price: 4473 },
  { title: "Drinking", artist: "Henry Scott Tuke", artistLife: "1858-1929", year: "1881", originalSize: "23 x 15.2 cm", price: 2236 },
  { title: "Bluebells", artist: "Henry Scott Tuke", artistLife: "1858-1929", year: "1907", originalSize: "45.7 x 30.5 cm", price: 3820 }
];

// Get list of image files
const imageDir = './public/image/t/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const tArtworks = [\n';
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

  const sku = `AM-T-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/t/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default tArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/t_artworks_output.ts', output);
console.log('\nOutput written to scripts/t_artworks_output.ts');
