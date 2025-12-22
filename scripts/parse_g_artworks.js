const fs = require('fs');

// Manual parsing based on the PDF structure for letter G artworks
const entries = [
  // Clarence Ganon
  { title: "The Pond October", artist: "Clarence Ganon", year: "1921", width: 74.3, height: 95, price: 3050, artistLife: "1881-1921", image: "the pond october.jpg" },
  { title: "After The Storm", artist: "Clarence Ganon", year: "1922", width: 16, height: 23.5, price: 1412, artistLife: "1881-1921", image: "after the storm.jpg" },
  { title: "Village In The Laurentian Mountains", artist: "Clarence Ganon", year: "1925", width: 89.2, height: 130.7, price: 6597, artistLife: "1881-1921", image: "village in the laurentian mountains.jpg" },
  { title: "Street Scene Quebec At Night", artist: "Clarence Ganon", year: "1917", width: 56.4, height: 74.4, price: 1987, artistLife: "1881-1921", image: "street scene quebec at night.jpg" },
  
  // Thomas Gainsborough
  { title: "The Woman In Blue (Portrait Of Duchess Of Beaufort)", artist: "Thomas Gainsborough", year: "1775", width: 76, height: 64, price: 5556, artistLife: "1727-1788", image: "the woman in blue (portrait of duchess of beaufort).jpg" },
  { title: "The Mall In St James Park", artist: "Thomas Gainsborough", year: "1783", width: 120.6, height: 147, price: 16413, artistLife: "1727-1788", image: "the mall in st james park.jpg" },
  { title: "Conversation In A Park", artist: "Thomas Gainsborough", year: "1746", width: 73, height: 68, price: 5500, artistLife: "1727-1788", image: "conversation in a park.jpg" },
  { title: "A Pug", artist: "Thomas Gainsborough", year: "1780", width: 48.5, height: 59, price: 4225, artistLife: "1727-1788", image: "a pug.jpg" },
  
  // Paul Gauguin
  { title: "Idyll In Tahiti", artist: "Paul Gauguin", year: "1901", width: 74.5, height: 94.5, price: 3137, artistLife: "1848-1903", image: "idyll in tahiti.jpg" },
  { title: "Still Life Sunflowers On An Armchair", artist: "Paul Gauguin", year: "1901", width: 68, height: 75.5, price: 2991, artistLife: "1848-1903", image: "still life sunflowers on an armchair.jpg" },
  { title: "Three Tahitians", artist: "Paul Gauguin", year: "1894", width: 73, height: 94, price: 2625, artistLife: "1848-1903", image: "three tahitians.jpg" },
  { title: "Two Tahitian Woman", artist: "Paul Gauguin", year: "1899", width: 94, height: 72.4, price: 2798, artistLife: "1848-1903", image: "two tahitian woman.jpg" },
  
  // Jean Leon Gerome
  { title: "The Grey Cardinal", artist: "Jean Leon Gerome", year: "1873", width: 68.6, height: 101, price: 12163, artistLife: "1824-1904", image: "the grey cardinal.jpg" },
  { title: "Pelt Merchant Of Cairo", artist: "Jean Leon Gerome", year: "1880", width: 61.5, height: 50.2, price: 5912, artistLife: "1824-1904", image: "pelt merchant of cairo.jpg" },
  { title: "Pollice Verso (Thumbs Down)", artist: "Jean Leon Gerome", year: "1872", width: 100, height: 149.2, price: 20762, artistLife: "1824-1904", image: "pollice verso (thumbs down).jpg" },
  { title: "Prayer In Cairo On The Rooftops", artist: "Jean Leon Gerome", year: "1865", width: 49.9, height: 81.2, price: 7643, artistLife: "1824-1904", image: "prayer in cairo on the rooftops.jpg" },
  
  // Anne-Louis Girodet De Roussy-Trioson
  { title: "The Entombment Of Atala (The Burial Of Atala)", artist: "Anne-Louis Girodet De Roussy-Trioson", year: "1808", width: 207, height: 267, price: 39578, artistLife: "1767-1824", image: "the entombmeent of atala (the burial of atala).jpg" },
  { title: "Napoleon In Coronation Robes", artist: "Anne-Louis Girodet De Roussy-Trioson", year: "1812", width: 256, height: 183.3, price: 47561, artistLife: "1767-1824", image: "napoleon in coronation robes.jpg" },
  { title: "Portrait Of Young Man As A Hunter", artist: "Anne-Louis Girodet De Roussy-Trioson", year: "1811", width: 65, height: 54.5, price: 7160, artistLife: "1767-1824", image: "portrait of young man as a hunter.jpg" },
  { title: "Pygmalion And Galatea", artist: "Anne-Louis Girodet De Roussy-Trioson", year: "1813", width: 253, height: 202, price: 28104, artistLife: "1767-1824", image: "pygmalion and galatea.jpg" },
  
  // Vincent Van Gogh
  { title: "Van Gogh's Bedroom At Arles", artist: "Vincent Van Gogh", year: "1889", width: 57.5, height: 74, price: 2500, artistLife: "1853-1890", image: "van gogh's bedroom at aries.jpg" },
  { title: "Shoes", artist: "Vincent Van Gogh", year: "1887", width: 32.7, height: 40.6, price: 1672, artistLife: "1853-1890", image: "shoes.jpg" },
  { title: "Postman Joseph Roulin", artist: "Vincent Van Gogh", year: "1888", width: 81.3, height: 65.4, price: 2780, artistLife: "1853-1890", image: "postman joseph roulin.jpg" },
  { title: "Vase Of Roses", artist: "Vincent Van Gogh", year: "1890", width: 93, height: 74, price: 3525, artistLife: "1853-1890", image: "vase of roses.jpg" },
  { title: "Irises", artist: "Vincent Van Gogh", year: "1889", width: 71, height: 93, price: 4770, artistLife: "1853-1890", image: "irises.jpg" },
  { title: "Red Vineyards At Arles", artist: "Vincent Van Gogh", year: "1888", width: 73, height: 91, price: 3142, artistLife: "1853-1890", image: "red vineyards at airies.jpg" },
  { title: "Wheat Field With Crows 1890", artist: "Vincent Van Gogh", year: "1890", width: 50.5, height: 103, price: 2744, artistLife: "1853-1890", image: "wheat field with crows 1890.jpg" },
  { title: "Starry Night Over The Rhone", artist: "Vincent Van Gogh", year: "1888", width: 75.2, height: 92, price: 3145, artistLife: "1853-1890", image: "starry night over the rhone.jpg" },
  { title: "The Cafe Terrace On The Place Du Forum Arles", artist: "Vincent Van Gogh", year: "1888", width: 61, height: 65.5, price: 3989, artistLife: "1853-1890", image: "the cafe terrace on the place du forum airies.jpg" },
  { title: "Haystacks In Provence", artist: "Vincent Van Gogh", year: "1888", width: 73, height: 92.5, price: 3145, artistLife: "1853-1890", image: "haystacks in provence.jpg" },
  
  // John Atkinson Grimshaw
  { title: "Hampstead", artist: "John Atkinson Grimshaw", year: "1881", width: 34.3, height: 44.5, price: 2999, artistLife: "1836-1893", image: "hampstead.jpg" },
  { title: "The Lady Of Shalott", artist: "John Atkinson Grimshaw", year: "Unknown", width: 61, height: 76, price: 4772, artistLife: "1836-1893", image: "the lady of shalott.jpg" },
  { title: "London Bridge Half Tide", artist: "John Atkinson Grimshaw", year: "1884", width: 56, height: 91, price: 5698, artistLife: "1836-1893", image: "london bridge half tide.jpg" },
  { title: "Liverpool From Wapping", artist: "John Atkinson Grimshaw", year: "1885", width: 61, height: 93, price: 5480, artistLife: "1836-1893", image: "liverpool from wapping.jpg" },
];

// Generate TypeScript code
let tsCode = 'export const gArtworks = [\n';
let skuCounter = 1;

const imageFiles = fs.readdirSync('public/image/g/').filter(f => f.endsWith('.jpg'));

for (const entry of entries) {
  const imagePath = `/image/g/${entry.image}`;
  
  // Check if image exists
  const imageExists = imageFiles.some(f => f.toLowerCase() === entry.image.toLowerCase());
  if (!imageExists) {
    console.log(`Warning: Image not found for ${entry.title} (looking for ${entry.image})`);
    continue;
  }

  const sku = `AM-G-${String(skuCounter).padStart(3, '0')}`;
  const price = entry.price;

  tsCode += `  {\n`;
  tsCode += `    title: "${entry.title}",\n`;
  if (entry.year) tsCode += `    year: "${entry.year}",\n`;
  tsCode += `    originalSize: "${entry.width} x ${entry.height} cm",\n`;
  tsCode += `    artist: "${entry.artist}",\n`;
  if (entry.artistLife) tsCode += `    artistLife: "${entry.artistLife}",\n`;
  tsCode += `    sku: "${sku}",\n`;
  tsCode += `    basePrice: ${price},\n`;
  tsCode += `    currency: "AED",\n`;
  tsCode += `    image: "${imagePath}",\n`;
  tsCode += `    options: [{ id: 'opt1', width: ${entry.width}, height: ${entry.height}, price: ${price}, label: 'Original Size' }],\n`;
  tsCode += `  },\n\n`;
  
  skuCounter++;
}

tsCode += '];\n\nexport default gArtworks;\n';

console.log('Generated TypeScript code:');
console.log(tsCode);

fs.writeFileSync('scripts/g_artworks_output.ts', tsCode);
console.log(`\n✓ Output saved to scripts/g_artworks_output.ts`);
console.log(`✓ Total artworks: ${skuCounter - 1}`);
