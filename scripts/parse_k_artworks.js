const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_K.pdf)
const artworks = [
  { title: "Blue Sky", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1940", originalSize: "100 x 73 cm", price: 6699 },
  { title: "Circles In A Circle", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1923", originalSize: "98.7 x 95.6 cm", price: 9159 },
  { title: "Composition 4", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1911", originalSize: "159.5 x 250.5 cm", price: 44124 },
  { title: "Composition 8", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1923", originalSize: "140 x 201 cm", price: 30324 },
  { title: "Composition IX", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1936", originalSize: "113.5 x 195 cm", price: 23844 },
  { title: "Concentric Circles", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1913", originalSize: "47.5 x 49.5 cm", price: 2460 },
  { title: "Danae", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1907", originalSize: "77 x 83 cm", price: 6774 },
  { title: "Far Far Away Soria Moria Palace Shimmered Like Gold", artist: "Theodor Kittelsen", artistLife: "1857-1914", year: "1900", originalSize: "58 x 87 cm", price: 5112 },
  { title: "Girl Friends", artist: "Moise Kisling", artistLife: "1891-1953", year: "1928", originalSize: "60 x 73 cm", price: 4464 },
  { title: "Gold Fish", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1901", originalSize: "150 x 46 cm", price: 7284 },
  { title: "Hip Hip Hooray, Artist Festival At Skagen", artist: "Peder Severin Kroyer", artistLife: "1851-1909", year: "1888", originalSize: "134.5 x 165.5 cm", price: 23988 },
  { title: "Hope II", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1907", originalSize: "110.5 x 110.5 cm", price: 13164 },
  { title: "Judith I", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1901", originalSize: "84 x 42 cm", price: 3792 },
  { title: "Moscow I", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1916", originalSize: "51.5 x 49.5 cm", price: 2604 },
  { title: "Portrait Of A Man With Streimel", artist: "Isidor Kaufmann", artistLife: "1853-1921", year: "Unknown", originalSize: "35.5 x 26 cm", price: 984 },
  { title: "Portrait Of A Rabbi", artist: "Isidor Kaufmann", artistLife: "1853-1921", year: "1910", originalSize: "26 x 35.5 cm", price: 984 },
  { title: "Portrait Of A Young Boy With Peyot", artist: "Isidor Kaufmann", artistLife: "1853-1921", year: "Unknown", originalSize: "35.5 x 26 cm", price: 984 },
  { title: "Portrait Of Adele Bloch-Bauer I", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1907", originalSize: "138 x 138 cm", price: 20532 },
  { title: "Portrait Of Eugeina Primavesi", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1913", originalSize: "140 x 84 cm", price: 12684 },
  { title: "Portrait Of Fritza Riedlar", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1906", originalSize: "153 x 133 cm", price: 21936 },
  { title: "Portrait Of Johanna Straude", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1917", originalSize: "70 x 50 cm", price: 3744 },
  { title: "Portrait Of Wolfang Amadeus Mozart", artist: "Barbara Krafft", artistLife: "1764-1825", year: "1819", originalSize: "54.5 x 44 cm", price: 2484 },
  { title: "Shubert At The Piano", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1899", originalSize: "150 x 200 cm", price: 32304 },
  { title: "Signs In Yellow", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1933", originalSize: "60 x 50 cm", price: 3216 },
  { title: "Sir Christopher Wren", artist: "Godfrey Kneller", artistLife: "1646-1723", year: "1711", originalSize: "123 x 99 cm", price: 13104 },
  { title: "Still Life With Drinking Horn", artist: "Willem Kalf", artistLife: "1619-1693", year: "1653", originalSize: "86 x 102 cm", price: 9444 },
  { title: "Still Life With Fruit In A Wan-Li Bowl", artist: "Willem Kalf", artistLife: "1619-1693", year: "Unknown", originalSize: "65 x 55 cm", price: 3840 },
  { title: "The Kiss", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1908", originalSize: "180 x 180 cm", price: 34920 },
  { title: "The Promernade", artist: "Marc Chagall", artistLife: "1887-1985", year: "1917", originalSize: "170 x 163.5 cm", price: 29964 },
  { title: "The Three Ages Of Women", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1905", originalSize: "180 x 180 cm", price: 34920 },
  { title: "The Tree Of Life", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1909", originalSize: "195 x 102 cm", price: 21444 },
  { title: "Untitled (Transition)", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1934", originalSize: "60 x 50 cm", price: 3216 },
  { title: "Upward", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1929", originalSize: "70 x 49 cm", price: 3696 },
  { title: "Water Serpents", artist: "Gustav Klimt", artistLife: "1862-1918", year: "1904", originalSize: "50 x 20 cm", price: 1068 },
  { title: "Winter Landscape (1)", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1909", originalSize: "75.5 x 97.5 cm", price: 7944 },
  { title: "Winter Landscape", artist: "Wassily Kandinsky", artistLife: "1866-1944", year: "1909", originalSize: "75.5 x 97.5 cm", price: 7944 }
];

// Get list of image files
const imageDir = './public/image/k/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const kArtworks = [\n';
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

  const sku = `AM-K-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/k/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default kArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/k_artworks_output.ts', output);
console.log('\nOutput written to scripts/k_artworks_output.ts');
