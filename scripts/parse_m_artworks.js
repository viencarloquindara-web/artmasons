const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_M.pdf)
const artworks = [
  { title: "The Son Of Man", artist: "Rene Magritte", artistLife: "1898-1964", year: "1964", originalSize: "116 x 89 cm", price: 3985 },
  { title: "Man In A Bowler Hat", artist: "Rene Magritte", artistLife: "1898-1964", year: "1964", originalSize: "63.5 x 48 cm", price: 2920 },
  { title: "The Gold Weigher", artist: "Cornelis de Man", artistLife: "1621-1706", year: "1670", originalSize: "81.5 x 67.5 cm", price: 12277 },
  { title: "Olympia", artist: "Edouard Manet", artistLife: "1832-1883", year: "1863", originalSize: "130 x 190 cm", price: 5880 },
  { title: "Lunch On The Grass", artist: "Edouard Manet", artistLife: "1832-1883", year: "1863", originalSize: "208 x 264 cm", price: 7535 },
  { title: "A Bar At The Folies-Bergere", artist: "Edouard Manet", artistLife: "1832-1883", year: "1882", originalSize: "96 x 130 cm", price: 6270 },
  { title: "The Balcony", artist: "Edouard Manet", artistLife: "1832-1883", year: "1868", originalSize: "170 x 124.5 cm", price: 9835 },
  { title: "The Old Musician", artist: "Edouard Manet", artistLife: "1832-1883", year: "1862", originalSize: "187.4 x 248.2 cm", price: 13256 },
  { title: "Oysters", artist: "Edouard Manet", artistLife: "1832-1883", year: "1862", originalSize: "39.1 x 46.7 cm", price: 2420 },
  { title: "Still Life With Melon And Peaches", artist: "Edouard Manet", artistLife: "1832-1883", year: "1866", originalSize: "69 x 92.2 cm", price: 4075 },
  { title: "Plum Brandy", artist: "Edouard Manet", artistLife: "1832-1883", year: "1878", originalSize: "73.6 x 50.2 cm", price: 3096 },
  { title: "Masked Ball At The Opera", artist: "Edouard Manet", artistLife: "1832-1883", year: "1873", originalSize: "59 x 72.5 cm", price: 7824 },
  { title: "The Luncheon At The Studio", artist: "Edouard Manet", artistLife: "1832-1883", year: "1868", originalSize: "120 x 154 cm", price: 11546 },
  { title: "The House At Rueil", artist: "Edouard Manet", artistLife: "1832-1883", year: "1882", originalSize: "71 x 92.3 cm", price: 3955 },
  { title: "The Garden Of Pere Lathuille", artist: "Edouard Manet", artistLife: "1832-1883", year: "1879", originalSize: "92 x 112 cm", price: 6414 },
  { title: "The Woman In The Garden", artist: "Edouard Manet", artistLife: "1832-1883", year: "1880", originalSize: "74 x 56 cm", price: 3699 },
  { title: "Boating", artist: "Edouard Manet", artistLife: "1832-1883", year: "1874", originalSize: "97.2 x 130.2 cm", price: 6756 },
  { title: "The Monet Family In Their Garden At Argenteuil", artist: "Edouard Manet", artistLife: "1832-1883", year: "1874", originalSize: "61 x 99.7 cm", price: 3716 },
  { title: "The Grand Canal Venice", artist: "Edouard Manet", artistLife: "1832-1883", year: "1874", originalSize: "57 x 48 cm", price: 3908 },
  { title: "The Grand Canal (Blue Venice)", artist: "Edouard Manet", artistLife: "1832-1883", year: "1874", originalSize: "50 x 71 cm", price: 3301 },
  { title: "The Brioche", artist: "Edouard Manet", artistLife: "1832-1883", year: "1870", originalSize: "65.1 x 81 cm", price: 4366 },
  { title: "Skating", artist: "Edouard Manet", artistLife: "1832-1883", year: "1877", originalSize: "92 x 71.7 cm", price: 4426 },
  { title: "A Parisian Lady", artist: "Edouard Manet", artistLife: "1832-1883", year: "Unknown", originalSize: "192 x 125 cm", price: 8659 },
  { title: "Stanczyk", artist: "Jan Matejko", artistLife: "1838-1893", year: "1862", originalSize: "88 x 120 cm", price: 8659 },
  { title: "The Dance", artist: "Henri Matisse", artistLife: "1869-1954", year: "1909", originalSize: "150 x 230 cm", price: 7150 },
  { title: "The Red Room, Harmony In Red", artist: "Henri Matisse", artistLife: "1869-1954", year: "1908", originalSize: "180 x 220 cm", price: 8120 },
  { title: "Goldfish", artist: "Henri Matisse", artistLife: "1869-1954", year: "1912", originalSize: "147 x 98 cm", price: 4500 },
  { title: "Open Window Collioure", artist: "Henri Matisse", artistLife: "1869-1954", year: "1905", originalSize: "55.2 x 45 cm", price: 2150 },
  { title: "Interior With Phonograph", artist: "Henri Matisse", artistLife: "1869-1954", year: "1927", originalSize: "100.5 x 80 cm", price: 3028 },
  { title: "Arabian Coffee House", artist: "Henri Matisse", artistLife: "1869-1954", year: "1913", originalSize: "176 x 210 cm", price: 2270 },
  { title: "Pink Statuette On The Red Chest", artist: "Henri Matisse", artistLife: "1869-1954", year: "1910", originalSize: "90 x 117 cm", price: 3290 },
  { title: "Spanish Still Life", artist: "Henri Matisse", artistLife: "1869-1954", year: "1910", originalSize: "89.5 x 116 cm", price: 4500 },
  { title: "Still Life Of Fruit and Bronze Statue", artist: "Henri Matisse", artistLife: "1869-1954", year: "1910", originalSize: "91 x 118.3 cm", price: 4200 },
  { title: "Music", artist: "Henri Matisse", artistLife: "1869-1954", year: "1910", originalSize: "81 x 123 cm", price: 3220 },
  { title: "A Game Of Bowls", artist: "Henri Matisse", artistLife: "1869-1954", year: "1908", originalSize: "115 x 147 cm", price: 4092 },
  { title: "Woman In Purple Coat Print", artist: "Henri Matisse", artistLife: "1869-1954", year: "1937", originalSize: "81 x 65.2 cm", price: 12829 },
  { title: "The Joy Of Life", artist: "Henri Matisse", artistLife: "1869-1954", year: "1906", originalSize: "176.5 x 240.7 cm", price: 16704 },
  { title: "Still Life With Blue Tablecloth", artist: "Henri Matisse", artistLife: "1869-1954", year: "1909", originalSize: "88.5 x 116 cm", price: 3328 },
  { title: "Nymph and Satyr", artist: "Henri Matisse", artistLife: "1869-1954", year: "1908", originalSize: "89 x 117 cm", price: 3563 },
  { title: "Landscape Viewed From A Window", artist: "Henri Matisse", artistLife: "1869-1954", year: "1913", originalSize: "115 x 80 cm", price: 3565 },
  { title: "Lady In Green With A Red Carnation", artist: "Henri Matisse", artistLife: "1869-1954", year: "1909", originalSize: "65 x 54 cm", price: 2741 },
  { title: "Woman With A Hat", artist: "Henri Matisse", artistLife: "1869-1954", year: "1905", originalSize: "80.6 x 59.7 cm", price: 2835 },
  { title: "The Window", artist: "Henri Matisse", artistLife: "1869-1954", year: "1916", originalSize: "146.1 x 116.8 cm", price: 4099 },
  { title: "Nude In The Studio", artist: "Henri Matisse", artistLife: "1869-1954", year: "1899", originalSize: "46 x 60 cm", price: 3895 },
  { title: "The Green Line", artist: "Henri Matisse", artistLife: "1869-1954", year: "1905", originalSize: "40.5 x 32.5 cm", price: 2920 },
  { title: "Corner Of The Artists Studio", artist: "Henri Matisse", artistLife: "1869-1954", year: "1912", originalSize: "191.5 x 114 cm", price: 17142 },
  { title: "Composition With Red Yellow Green", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1930", originalSize: "59.5 x 59.5 cm", price: 1403 },
  { title: "Blossoming Apple Trees", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1912", originalSize: "78.5 x 107.5 cm", price: 3281 },
  { title: "Composition With Large Red Yellow Plane, Yellow, Black Grey and Blue", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1921", originalSize: "59.5 x 59.5 cm", price: 2301 },
  { title: "Composition No IV", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1914", originalSize: "88 x 61 cm", price: 3272 },
  { title: "Trafalgar Square", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1939", originalSize: "145.2 x 120 cm", price: 3606 },
  { title: "Composition In Black And White", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1915", originalSize: "85 x 110 cm", price: 3182 },
  { title: "Composition No II", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1913", originalSize: "88 x 115 cm", price: 4512 },
  { title: "Tableau No I", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1913", originalSize: "96 x 64 cm", price: 4166 },
  { title: "Composition Red, Yellow and Blue", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1927", originalSize: "40 x 52 cm", price: 1373 },
  { title: "Composition Of Red and White", artist: "Piet Mondrian", artistLife: "1872-1944", year: "1938", originalSize: "100.3 x 99 cm", price: 3482 },
  { title: "The Japanese Bridge, Pond With Water Lilies", artist: "Claude Monet", artistLife: "1840-1926", year: "1900", originalSize: "89.5 x 92.5 cm", price: 4800 },
  { title: "Hay Stacks, Sun In The Mist", artist: "Claude Monet", artistLife: "1840-1926", year: "1891", originalSize: "60 x 100.3 cm", price: 3000 },
  { title: "The Hunt", artist: "Claude Monet", artistLife: "1840-1926", year: "1876", originalSize: "170 x 137 cm", price: 8500 },
  { title: "The Houses Of Parliament Sunset", artist: "Claude Monet", artistLife: "1840-1926", year: "1903", originalSize: "81.2 x 92 cm", price: 4600 },
  { title: "Near Monte Carlo", artist: "Claude Monet", artistLife: "1840-1926", year: "1883", originalSize: "65.6 x 82 cm", price: 2759 },
  { title: "The Water Lily Pond", artist: "Claude Monet", artistLife: "1840-1926", year: "1904", originalSize: "90 x 92 cm", price: 3278 },
  { title: "Water Lilies", artist: "Claude Monet", artistLife: "1840-1926", year: "1905", originalSize: "89.5 x 100.3 cm", price: 3330 },
  { title: "Water Lilies", artist: "Claude Monet", artistLife: "1840-1926", year: "1908", originalSize: "101 x 90 cm", price: 3330 },
  { title: "Water Lilies", artist: "Claude Monet", artistLife: "1840-1926", year: "1907", originalSize: "92.1 x 81.2 cm", price: 3200 },
  { title: "Water Lilies", artist: "Claude Monet", artistLife: "1840-1926", year: "1905", originalSize: "88.3 x 99.5 cm", price: 3250 },
  { title: "Waterloo Bridge Gray Day", artist: "Claude Monet", artistLife: "1840-1926", year: "1903", originalSize: "65.1 x 100 cm", price: 3021 },
  { title: "Palazzo Da Mula Venice", artist: "Claude Monet", artistLife: "1840-1926", year: "1908", originalSize: "61 x 80.5 cm", price: 3062 },
  { title: "The Seine In Giverny", artist: "Claude Monet", artistLife: "1840-1926", year: "1897", originalSize: "81.5 x 100.5 cm", price: 2385 },
  { title: "Poplars On The Epte", artist: "Claude Monet", artistLife: "1840-1926", year: "1891", originalSize: "81.8 x 81.3 cm", price: 2960 },
  { title: "Haystack At Sunset", artist: "Claude Monet", artistLife: "1840-1926", year: "1891", originalSize: "73.3 x 92.7 cm", price: 2381 },
  { title: "Haystacks In The Sunlight Midday", artist: "Claude Monet", artistLife: "1840-1926", year: "1890", originalSize: "66.6 x 100.6 cm", price: 2857 },
  { title: "Rocks At Port-Goulphar Belle-Ile", artist: "Claude Monet", artistLife: "1840-1926", year: "1886", originalSize: "66 x 81.6 cm", price: 2711 },
  { title: "A Stream Through The Glen, Deer In The Distance", artist: "Peder Monsted", artistLife: "1859-1941", year: "1905", originalSize: "79 x 114.3 cm", price: 5601 },
  { title: "The Left Arm Of The Seine In Front Of The Place Dauphine", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "Unknown", originalSize: "46 x 38 cm", price: 1584 },
  { title: "Dieppe", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1906", originalSize: "50.3 x 61.2 cm", price: 2058 },
  { title: "A Street In The Suburbs Of Havana", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1915", originalSize: "54 x 65 cm", price: 2156 },
  { title: "Landscape Trinidad", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1921", originalSize: "65.8 x 81 cm", price: 2161 },
  { title: "Cafe Pasaje Havana", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1915", originalSize: "65.8 x 67.5 cm", price: 2242 },
  { title: "Woman In Red Bathrobe", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1912", originalSize: "81.2 x 54.5 cm", price: 3047 },
  { title: "House In Santiago", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "1915", originalSize: "54 x 64.8 cm", price: 2024 },
  { title: "Sailing Boats", artist: "James Wilson Morrice", artistLife: "1865-1924", year: "Unknown", originalSize: "61 x 81.3 cm", price: 2302 },
  { title: "The Banjo Player", artist: "William Sydney Mount", artistLife: "1807-1868", year: "1856", originalSize: "90.8 x 73 cm", price: 6929 },
  { title: "The Bone Player", artist: "William Sydney Mount", artistLife: "1807-1868", year: "1856", originalSize: "91.7 x 73.9 cm", price: 7302 }
];

// Get list of image files
const imageDir = './public/image/m/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const mArtworks = [\n';
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

  const sku = `AM-M-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/m/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default mArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/m_artworks_output.ts', output);
console.log('\nOutput written to scripts/m_artworks_output.ts');
