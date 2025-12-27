const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_V.pdf)
const artworks = [
  { title: "Still Life With Peaches And Grapes", artist: "Anne Vallayer-Coster", artistLife: "1744-1818", year: "1779", originalSize: "46 x 55 cm", price: 9131 },
  { title: "Still Life With Ham", artist: "Anne Vallayer-Coster", artistLife: "1744-1818", year: "1767", originalSize: "46 x 55 cm", price: 4443 },
  { title: "Still Life With Peaches And Silver Mugs", artist: "Anne Vallayer-Coster", artistLife: "1744-1818", year: "1797", originalSize: "36 x 47.5 cm", price: 6787 },
  { title: "Still Life With Bulbous Bottle", artist: "Anne Vallayer-Coster", artistLife: "1744-1818", year: "1770", originalSize: "27.5 x 32.5 cm", price: 2751 },
  { title: "Still Life With Mackrell", artist: "Anne Vallayer-Coster", artistLife: "1744-1818", year: "1787", originalSize: "49.5 x 61 cm", price: 13282 },
  { title: "King Philip IV Of Spain", artist: "Diego Rodriguez De Silva Velazquez", artistLife: "1599-1660", year: "1644", originalSize: "129.8 x 99.3 cm", price: 10925 },
  { title: "The Water Seller Of Seville", artist: "Diego Rodriguez De Silva Velazquez", artistLife: "1599-1660", year: "1620", originalSize: "106 x 82 cm", price: 11084 },
  { title: "An Old Woman Cooking Eggs", artist: "Diego Rodriguez De Silva Velazquez", artistLife: "1599-1660", year: "1618", originalSize: "100.5 x 119.5 cm", price: 17172 },
  { title: "Villa Medici In Rome (Pavillion Of Ariadne)", artist: "Diego Rodriguez De Silva Velazquez", artistLife: "1599-1660", year: "1630", originalSize: "48.5 x 43 cm", price: 3241 },
  { title: "Villa Medici In Rome (Facade Of Grotto Logia)", artist: "Diego Rodriguez De Silva Velazquez", artistLife: "1599-1660", year: "1630", originalSize: "44 x 38 cm", price: 2970 },
  { title: "The Girl With The Pearl Earring", artist: "Johannes Vermeer Van Delft", artistLife: "1632-1675", year: "1665", originalSize: "46.5 x 40 cm", price: 3039 },
  { title: "The Milkmaid The Kitchen Maid", artist: "Johannes Vermeer Van Delft", artistLife: "1632-1675", year: "1658", originalSize: "45.5 x 41 cm", price: 8216 },
  { title: "Mistress And Maid", artist: "Johannes Vermeer Van Delft", artistLife: "1632-1675", year: "1666", originalSize: "90.2 x 78.7 cm", price: 10058 },
  { title: "Girl Reading A Letter At An Open Window", artist: "Johannes Vermeer Van Delft", artistLife: "1632-1675", year: "1657", originalSize: "83 x 64.5 cm", price: 10346 },
  { title: "Pope Julius, I Ordering Bramante, Michelangelo And Raphael To Construct The Vatican And St Peter's", artist: "Horace Vernet", artistLife: "1789-1863", year: "1827", originalSize: "88 x 101 cm", price: 21910 },
  { title: "The Arab Tale Teller", artist: "Horace Vernet", artistLife: "1789-1863", year: "1833", originalSize: "99 x 136.5 cm", price: 26266 },
  { title: "Hunting In The Pontine Marshes", artist: "Horace Vernet", artistLife: "1789-1863", year: "1833", originalSize: "100 x 137 cm", price: 10317 },
  { title: "Departure For The Hunt In The Pontine Marshes", artist: "Horace Vernet", artistLife: "1789-1863", year: "1833", originalSize: "100 x 150.7 cm", price: 8272 },
  { title: "Allegory Of Wisdom And Strength", artist: "Paolo Cagliari Veronese", artistLife: "1528-1588", year: "1580", originalSize: "214.6 x 167 cm", price: 36168 },
  { title: "Mars And Venus United By Love", artist: "Paolo Cagliari Veronese", artistLife: "1528-1588", year: "1570", originalSize: "205.7 x 161 cm", price: 36142 },
  { title: "Moses Saved From The Waters", artist: "Paolo Cagliari Veronese", artistLife: "1528-1588", year: "1580", originalSize: "57 x 43 cm", price: 15903 },
  { title: "Respect", artist: "Paolo Cagliari Veronese", artistLife: "1528-1588", year: "1575", originalSize: "188 x 194.3 cm", price: 20966 },
  { title: "The Family Of Darius Before Alexander", artist: "Paolo Cagliari Veronese", artistLife: "1528-1588", year: "1565", originalSize: "236.2 x 475 cm", price: 103100 },
  { title: "The Marvellous Sauce", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "1890", originalSize: "64 x 81 cm", price: 8202 },
  { title: "La Sieste", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "Unknown", originalSize: "26 x 36 cm", price: 6473 },
  { title: "The Church In Danger", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "Unknown", originalSize: "73.7 x 58.4 cm", price: 13758 },
  { title: "The View", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "Unknown", originalSize: "36 x 27.7 cm", price: 5353 },
  { title: "The Convent Choir", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "1865", originalSize: "37.5 x 46.4 cm", price: 11382 },
  { title: "Tea For The Bishop", artist: "Jehan Georges Vibert", artistLife: "1840-1902", year: "Unknown", originalSize: "61 x 45.7 cm", price: 12464 },
  { title: "Eruption In Vesuvius", artist: "Pierre Jacques Voliare", artistLife: "1729-1802", year: "1771", originalSize: "71 x 124 cm", price: 17239 },
  { title: "The Eruption Of Vesuvius", artist: "Pierre Jacques Voliare", artistLife: "1729-1802", year: "Unknown", originalSize: "51 x 115 cm", price: 7365 },
  { title: "The Eruption Of Vesuvius 2", artist: "Pierre Jacques Voliare", artistLife: "1729-1802", year: "Unknown", originalSize: "51 x 34 cm", price: 4271 },
  { title: "Apple Bloom", artist: "Robert Vennoh", artistLife: "1858-1930", year: "1903", originalSize: "76.8 x 92 cm", price: 3004 },
  { title: "The Flanders Field Where Soldiers Sleep And Poppies Grow", artist: "Robert Vennoh", artistLife: "1858-1930", year: "1890", originalSize: "61 x 110 cm", price: 3357 },
  { title: "The Bridge At Grez", artist: "Robert Vennoh", artistLife: "1858-1930", year: "1907", originalSize: "61 x 86 cm", price: 2853 },
  { title: "Jardin De Paysanne", artist: "Robert Vennoh", artistLife: "1858-1930", year: "1890", originalSize: "65.7 x 50.2 cm", price: 2801 },
  { title: "Poppies In France", artist: "Robert Vennoh", artistLife: "1858-1930", year: "1888", originalSize: "30.8 x 51 cm", price: 2766 },
  { title: "Sleeping Venus", artist: "Simon Vouet", artistLife: "1590-1649", year: "1630", originalSize: "66 x 56 cm", price: 6197 },
  { title: "Wealth", artist: "Simon Vouet", artistLife: "1590-1649", year: "1635", originalSize: "170 x 124 cm", price: 12494 },
  { title: "Model For Alterpiece In St Peter's", artist: "Simon Vouet", artistLife: "1590-1649", year: "1625", originalSize: "40.6 x 61.6 cm", price: 5445 },
  { title: "Model For Alterpiece In St Peter's 1", artist: "Simon Vouet", artistLife: "1590-1649", year: "1625", originalSize: "40.6 x 61.6 cm", price: 5445 },
  { title: "The Voiles De Genes' Boudoir", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1931", originalSize: "88 x 79.5 cm", price: 3787 },
  { title: "In A Room", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1899", originalSize: "52 x 79 cm", price: 2697 },
  { title: "The Guinguette", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1898", originalSize: "33 x 27 cm", price: 1038 },
  { title: "Woman In A Striped Dress", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1895", originalSize: "65.7 x 58.7 cm", price: 3003 },
  { title: "Child Wearing A Red Scarf", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1891", originalSize: "29.2 x 17.5 cm", price: 887 },
  { title: "Le Vase Bleu", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1930", originalSize: "35 x 27 cm", price: 982 },
  { title: "Children In A Room", artist: "Edoaurd Vuillard", artistLife: "1868-1940", year: "1909", originalSize: "84.5 x 77.7 cm", price: 2916 }
];

// Get list of image files
const imageDir = './public/image/v/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles.length);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const vArtworks = [\n';
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

  const sku = `AM-V-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/v/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default vArtworks;\n';

console.log(`Total artworks processed: ${skuCounter - 1}`);
console.log('\nOutput written to scripts/v_artworks_output.ts');

// Write to file
fs.writeFileSync('./scripts/v_artworks_output.ts', output);
