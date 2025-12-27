const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_W.pdf)
const artworks = [
  { title: "The Lady Of Shallotte", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1888", originalSize: "153 x 200 cm", price: 10560 },
  { title: "Hylas And Nymphs", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1896", originalSize: "132.1 x 197.5 cm", price: 20675 },
  { title: "Orphelia", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1910", originalSize: "101.5 x 63.5 cm", price: 5474 },
  { title: "The Tale Of Decameron", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1916", originalSize: "101 x 159 cm", price: 14429 },
  { title: "I Am Half Sick Of The Shadows Said The Lady Of Shallot", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1916", originalSize: "100.3 x 73.6 cm", price: 8106 },
  { title: "Destiny", artist: "John William Waterhouse", artistLife: "1849-1917", year: "1900", originalSize: "68.5 x 54.6 cm", price: 4454 },
  { title: "Actors Of The Comedie-Francais", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1714", originalSize: "20 x 25 cm", price: 8818 },
  { title: "Les Champs Elisees", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1717", originalSize: "33.1 x 42.6 cm", price: 11092 },
  { title: "The Festival Of Love (The Pleasures Of Love)", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1717", originalSize: "81 x 75 cm", price: 8910 },
  { title: "The Fortune Teller", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1710", originalSize: "37.1 x 27.9 cm", price: 9932 },
  { title: "Dianna Bathing", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1715", originalSize: "80 x 101 cm", price: 9138 },
  { title: "Pleasures Of The Ball", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1715", originalSize: "52.6 x 65.4 cm", price: 22124 },
  { title: "A Lady At Her Toilet", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1716", originalSize: "45.2 x 37.8 cm", price: 8444 },
  { title: "The Shy Lover", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "1718", originalSize: "55 x 43 cm", price: 9048 },
  { title: "The Spring Fete Champetre In A Water Garden With Figures In A Boat", artist: "Jean Antoine Matteau", artistLife: "1684-1721", year: "Unknown", originalSize: "32.4 x 45.7 cm", price: 12048 },
  { title: "Along The Ghats Malhuta", artist: "Edwin Lord Weeks", artistLife: "1849-1903", year: "1880", originalSize: "78.8 x 99 cm", price: 4439 },
  { title: "The Nautch", artist: "Edwin Lord Weeks", artistLife: "1849-1903", year: "1900", originalSize: "100.5 x 127 cm", price: 24157 },
  { title: "Departure For The Hunt", artist: "Edwin Lord Weeks", artistLife: "1849-1903", year: "Unknown", originalSize: "87.3 x 122 cm", price: 18549 },
  { title: "The Arrival Of Prince Humbert, The Rajah At The Palace Of Amber", artist: "Edwin Lord Weeks", artistLife: "1849-1903", year: "1888", originalSize: "99 x 132 cm", price: 19412 },
  { title: "Dead Hare And Partridges", artist: "Jan Weenix", artistLife: "1621-1660", year: "1702", originalSize: "87.3 x 70.5 cm", price: 9257 },
  { title: "The White Peacock", artist: "Jan Weenix", artistLife: "1621-1660", year: "1692", originalSize: "191 x 166 cm", price: 43140 },
  { title: "Portrait Of A Hazewindhoud And A Young Partridge Dog", artist: "Jan Weenix", artistLife: "1621-1660", year: "1665", originalSize: "84 x 103 cm", price: 6902 },
  { title: "The Ballerina Ulla Poulsen In The Ballet Chopinana", artist: "Gerder Wegener", artistLife: "1886-1940", year: "1927", originalSize: "76 x 91 cm", price: 5360 },
  { title: "Lili With A Feathered Fan", artist: "Gerder Wegener", artistLife: "1886-1940", year: "1920", originalSize: "82 x 61 cm", price: 4734 },
  { title: "Two Cocottes With Hats (Lili And Friend)", artist: "Gerder Wegener", artistLife: "1886-1940", year: "1925", originalSize: "56 x 41 cm", price: 4587 },
  { title: "The Mask", artist: "Gerder Wegener", artistLife: "1886-1940", year: "1922", originalSize: "98 x 81 cm", price: 4501 },
  { title: "On The Anacapri Road", artist: "Gerder Wegener", artistLife: "1886-1940", year: "1922", originalSize: "96 x 85 cm", price: 5502 },
  { title: "The Conservatory At Carlton House", artist: "Charles Wild", artistLife: "1871-1835", year: "1819", originalSize: "50 x 40 cm", price: 6885 },
  { title: "The Conservatory At Carlton House Pyne's Private Residence", artist: "Charles Wild", artistLife: "1871-1835", year: "Unknown", originalSize: "50 x 40 cm", price: 7658 },
  { title: "Interior Of St Georges Chapel Windsor", artist: "Charles Wild", artistLife: "1871-1835", year: "1819", originalSize: "71 x 56 cm", price: 9410 },
  { title: "An Elegant Beauty", artist: "William Clark Wotner", artistLife: "1857-1930", year: "Unknown", originalSize: "63.5 x 53.5 cm", price: 6885 },
  { title: "The Jade Necklace", artist: "William Clark Wotner", artistLife: "1857-1930", year: "1908", originalSize: "152.4 x 104 cm", price: 10498 },
  { title: "The Basket Of Anemones", artist: "William Clark Wotner", artistLife: "1857-1930", year: "1913", originalSize: "130 x 51 cm", price: 7558 },
  { title: "The False God", artist: "William Clark Wotner", artistLife: "1857-1930", year: "Unknown", originalSize: "76.2 x 63.5 cm", price: 5944 },
  { title: "American Gothic", artist: "Grant Wood", artistLife: "1891-1942", year: "1930", originalSize: "78 x 65.3 cm", price: 13000 },
  { title: "Stone City Iowa", artist: "Grant Wood", artistLife: "1891-1942", year: "1930", originalSize: "76.8 x 101.8 cm", price: 5076 },
  { title: "A Girl Reading A Letter With An Old Man", artist: "Joseph Wright Of Derby", artistLife: "1734-1797", year: "1767", originalSize: "91.5 x 71 cm", price: 8503 },
  { title: "A Girl Reading A Letter By Candle Light With A Young Man", artist: "Joseph Wright Of Derby", artistLife: "1734-1797", year: "1760", originalSize: "89 x 69.8 cm", price: 7337 },
  { title: "Miravan Breaking Open The Tomb Of His Ancestors", artist: "Joseph Wright Of Derby", artistLife: "1734-1797", year: "1772", originalSize: "103 x 81 cm", price: 12262 },
  { title: "An Eruption Of Vesuvius Seen From Portici", artist: "Joseph Wright Of Derby", artistLife: "1734-1797", year: "1774", originalSize: "91 x 112 cm", price: 6261 }
];

// Get list of image files
const imageDir = './public/image/w/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles.length);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const wArtworks = [\n';
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

  const sku = `AM-W-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/w/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default wArtworks;\n';

console.log(`Total artworks processed: ${skuCounter - 1}`);
console.log('\nOutput written to scripts/w_artworks_output.ts');

// Write to file
fs.writeFileSync('./scripts/w_artworks_output.ts', output);
