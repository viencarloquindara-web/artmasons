const fs = require('fs');

// Manual entry of artwork data from PDF
const artworks = [
  { title: "Italian Landscape", artist: "Jacob Philippe Hackett", artistLife: "1737-1807", year: "1795", originalSize: "64.5 x 96 cm", price: 9091 },
  { title: "View Of Copper Mill In Vietri", artist: "Jacob Philippe Hackett", artistLife: "1737-1807", year: "1773", originalSize: "64 x 87 cm", price: 9156 },
  { title: "Portrait Of A Young Man Holding A Glove", artist: "Frans Hals", artistLife: "1582-1666", year: "1650", originalSize: "80 x 66.5 cm", price: 5454 },
  { title: "Married Couple In A Garden", artist: "Frans Hals", artistLife: "1582-1666", year: "1622", originalSize: "70 x 83.25 cm", price: 21423 },
  { title: "Laughing Cavallier", artist: "Frans Hals", artistLife: "1582-1666", year: "1624", originalSize: "83 x 67 cm", price: 6741 },
  { title: "Portrait Of A Man", artist: "Frans Hals", artistLife: "1582-1666", year: "1660", originalSize: "91 x 66 cm", price: 6565 },
  { title: "Portrait Of A Woman", artist: "Frans Hals", artistLife: "1582-1666", year: "1635", originalSize: "88 x 71 cm", price: 6938 },
  { title: "Portrait Of A Elderly Man", artist: "Frans Hals", artistLife: "1582-1666", year: "1627", originalSize: "81 x 71 cm", price: 6741 },
  { title: "Malle Babbe", artist: "Frans Hals", artistLife: "1582-1666", year: "1633", originalSize: "78.5 x 66.2 cm", price: 4054 },
  { title: "The Piebald Stallion At The Eisgruber Stud", artist: "Johann Georg Von Hamilton", artistLife: "1672-1737", year: "1700", originalSize: "101 x 81 cm", price: 8031 },
  { title: "A Black Horse Performing The Courbette", artist: "Johann Georg Von Hamilton", artistLife: "1672-1737", year: "Unknown", originalSize: "81 x 96 cm", price: 8597 },
  { title: "Rosslyn Chapel Near Edingburgh", artist: "Heinrich Hansen", artistLife: "1821-1890", year: "1860", originalSize: "50 x 40 cm", price: 10835 },
  { title: "George Glennie Putting At Blackheath With Putting Cleek", artist: "Heywood Hardy", artistLife: "1843-1933", year: "1881", originalSize: "80 x 63 cm", price: 5518 },
  { title: "The Meet", artist: "Heywood Hardy", artistLife: "1843-1933", year: "Unknown", originalSize: "51 x 79 cm", price: 6260 },
  { title: "Moonlight On The River", artist: "Birge Harrison", artistLife: "1854-1929", year: "1919", originalSize: "71 x 64 cm", price: 2195 },
  { title: "Summer In The Catskills", artist: "James McDougal Hart", artistLife: "1828-1901", year: "1865", originalSize: "33.5 x 59 cm", price: 2272 },
  { title: "New England Sea View Fish House", artist: "Marsden Hartley", artistLife: "1877-1934", year: "1934", originalSize: "45.7 x 61 cm", price: 2581 },
  { title: "The Aero", artist: "Marsden Hartley", artistLife: "1877-1934", year: "1914", originalSize: "100.3 x 81.2 cm", price: 4365 },
  { title: "The Summer Camp Blue Mountain", artist: "Marsden Hartley", artistLife: "1877-1934", year: "1909", originalSize: "70 x 90 cm", price: 4687 },
  { title: "Newport Waterfront", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1901", originalSize: "66.6 x 61.4 cm", price: 2727 },
  { title: "An Outdoor Portrait Of Miss Weir", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1909", originalSize: "96.5 x 96.5 cm", price: 3128 },
  { title: "Surf and Rocks", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1906", originalSize: "50.8 x 76.2 cm", price: 2534 },
  { title: "The Smelt Fishers, Cos Cob", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1996", originalSize: "54 x 44.5 cm", price: 1998 },
  { title: "The Table Garden", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1910", originalSize: "100.3 x 75.6 cm", price: 3674 },
  { title: "Oyster Sloop, Cos Cob", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1902", originalSize: "62 x 56.8 cm", price: 2388 },
  { title: "The Victorian Chair", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1906", originalSize: "76.5 x 63.5 cm", price: 3331 },
  { title: "Twenty Sixth June Old Lyme", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1912", originalSize: "80.6 x 62.2 cm", price: 3519 },
  { title: "Church At Old Lyme", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1905", originalSize: "92 x 82 cm", price: 3768 },
  { title: "The West Wind Isles Of Shoals", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1904", originalSize: "38 x 56 cm", price: 1817 },
  { title: "Duck Island from Appledore", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1911", originalSize: "71.8 x 90.8 cm", price: 3620 },
  { title: "Central Park", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1892", originalSize: "45.7 x 57.2 cm", price: 2900 },
  { title: "Promenade At Sunset Paris", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1888", originalSize: "46 x 38.4 cm", price: 2382 },
  { title: "The Spanish Stairs Rome", artist: "Frederick Childe Hassam", artistLife: "1851-1935", year: "1897", originalSize: "74.4 x 59.3 cm", price: 3423 },
  { title: "Abraham Lincoln", artist: "George Healy", artistLife: "1813-1894", year: "1869", originalSize: "100 x 76 cm", price: 5424 },
  { title: "The Three Masted Merchantman", artist: "Joseph Heard", artistLife: "1799-1859", year: "Unknown", originalSize: "50.8 x 80 cm", price: 4695 },
  { title: "The Great Wave Of Kanagawa", artist: "Katsushika Hokusai", artistLife: "1760-1849", year: "1830", originalSize: "25.4 x 38 cm", price: 2350 },
];

// Get list of image files
const imageDir = './public/image/h/';
const imageFiles = fs.readdirSync(imageDir);

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = '';
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

  const sku = `AM-H-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/h/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/h_artworks_output.ts', output);
console.log('\nOutput written to scripts/h_artworks_output.ts');
