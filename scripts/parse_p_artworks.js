const fs = require('fs');

// Manual entry of artwork data from PDF (ART_DETAILS_P.pdf)
const artworks = [
  { title: "Hesperus, The Evening Star, Sacred To Lovers", artist: "Sir Joseph Noel Paton", artistLife: "1821-1901", year: "1857", originalSize: "91 x 69 cm", price: 17083 },
  { title: "Dantes Dream From The Divine Comedy", artist: "Sir Joseph Noel Paton", artistLife: "1821-1901", year: "Unknown", originalSize: "68 x 61 cm", price: 8287 },
  { title: "How An Angel Rowed Sir Galahad Across Dern Mere", artist: "Sir Joseph Noel Paton", artistLife: "1821-1901", year: "Unknown", originalSize: "30.6 x 41 cm", price: 5982 },
  { title: "Puck And Fairies From Mid-Summer's Night Dream", artist: "Sir Joseph Noel Paton", artistLife: "1821-1901", year: "1850", originalSize: "26.4 x 31.2 cm", price: 6469 },
  { title: "South Rim Grand Canyon", artist: "Edgar Alwin Payne", artistLife: "1883-1947", year: "Unknown", originalSize: "63.5 x 76.2 cm", price: 2403 },
  { title: "Monument Valley Riverbed", artist: "Edgar Alwin Payne", artistLife: "1883-1947", year: "Unknown", originalSize: "64.1 x 76.8 cm", price: 2638 },
  { title: "The Sierra Divide", artist: "Edgar Alwin Payne", artistLife: "1883-1947", year: "1921", originalSize: "61 x 71.1 cm", price: 2856 },
  { title: "High Surf Along The Laguna Coast", artist: "Edgar Alwin Payne", artistLife: "1883-1947", year: "Unknown", originalSize: "50.8 x 61.6 cm", price: 3489 },
  { title: "Apples", artist: "Kuzma Petrov Vodkin", artistLife: "1878-1939", year: "1917", originalSize: "41.5 x 58 cm", price: 2493 },
  { title: "Still Life With A Violin", artist: "Kuzma Petrov Vodkin", artistLife: "1878-1939", year: "1921", originalSize: "37.5 x 48 cm", price: 2621 },
  { title: "Spring", artist: "Kuzma Petrov Vodkin", artistLife: "1878-1939", year: "1935", originalSize: "101 x 86 cm", price: 4870 },
  { title: "The Worker", artist: "Kuzma Petrov Vodkin", artistLife: "1878-1939", year: "1912", originalSize: "122.4 x 84.7 cm", price: 4272 },
  { title: "Crouching Woman (Jacqueline)", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1954", originalSize: "146 x 114 cm", price: 4400 },
  { title: "Writing Woman", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1934", originalSize: "81 x 64.7 cm", price: 2724 },
  { title: "The Dream", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1932", originalSize: "130 x 97 cm", price: 4365 },
  { title: "Nude, Green Leaves And Bust", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1932", originalSize: "162 x 130 cm", price: 5650 },
  { title: "Horse's Head", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1937", originalSize: "65 x 92 cm", price: 2250 },
  { title: "Boy With A Pipe", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1905", originalSize: "100 x 81 cm", price: 4207 },
  { title: "Appointment", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1900", originalSize: "53 x 56 cm", price: 1898 },
  { title: "The Tragedy", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1903", originalSize: "86 x 56 cm", price: 3737 },
  { title: "The Old Guitarist", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1903", originalSize: "123 x 82.6 cm", price: 4809 },
  { title: "Dora Mar With Cat", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1941", originalSize: "128 x 95 cm", price: 4559 },
  { title: "A Girl Before A Mirror", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1932", originalSize: "162.3 x 130.2 cm", price: 6690 },
  { title: "Women Of Algiers", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1955", originalSize: "114 x 146.4 cm", price: 10499 },
  { title: "Child With A Dove", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1901", originalSize: "73 x 54 cm", price: 2100 },
  { title: "Girl On The Ball", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1905", originalSize: "147 x 95 cm", price: 5200 },
  { title: "Girls Of Avignon", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1907", originalSize: "243.9 x 233.7 cm", price: 10800 },
  { title: "Figures At The Seaside", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1931", originalSize: "129.8 x 161.0 cm", price: 7300 },
  { title: "Cat Catching A Bird", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1939", originalSize: "81 x 100 cm", price: 3900 },
  { title: "Portrait Of A Woman In D'Hermine Pass", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1923", originalSize: "61 x 50 cm", price: 2590 },
  { title: "Self Portrait", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1900", originalSize: "22.5 x 16.5 cm", price: 1950 },
  { title: "The Brutal Embrace", artist: "Pablo Picasso", artistLife: "1881-1973", year: "1900", originalSize: "47 x 38 cm", price: 2980 },
  { title: "Quai Malaquais, Sunny Afternoon", artist: "Camille Jacob Pissarro", artistLife: "1830-1903", year: "1903", originalSize: "65.3 x 81.5 cm", price: 3274 },
  { title: "The Pont Royal And Pavillion De Flore", artist: "Camille Jacob Pissarro", artistLife: "1830-1903", year: "1903", originalSize: "54 x 65 cm", price: 2637 },
  { title: "The Louvre And The Siene From Pont Neuf", artist: "Camille Jacob Pissarro", artistLife: "1830-1903", year: "1902", originalSize: "56 x 68 cm", price: 2411 },
  { title: "L'Avenue De L'Opera", artist: "Camille Jacob Pissarro", artistLife: "1830-1903", year: "1898", originalSize: "65 x 82 cm", price: 3321 },
  { title: "Boulevard Montemarte Afternoon In The Rain", artist: "Camille Jacob Pissarro", artistLife: "1830-1903", year: "1897", originalSize: "61 x 75 cm", price: 4993 },
  { title: "Brother And Sister", artist: "Edward Henry Potthast", artistLife: "1857-1927", year: "1915", originalSize: "61.3 x 51 cm", price: 3445 },
  { title: "A Sailing Party", artist: "Edward Henry Potthast", artistLife: "1857-1927", year: "1924", originalSize: "76.7 x 101.8 cm", price: 3770 },
  { title: "Holland Peasant With Cow", artist: "Edward Henry Potthast", artistLife: "1857-1927", year: "1890", originalSize: "65 x 81 cm", price: 2535 },
  { title: "Dutch Interior", artist: "Edward Henry Potthast", artistLife: "1857-1927", year: "1890", originalSize: "50 x 64.8 cm", price: 3364 },
  { title: "Vanity", artist: "Mattia Preti", artistLife: "1613-1699", year: "1650", originalSize: "93.5 x 65 cm", price: 11996 },
  { title: "The Queen Of Sheba Before Solomon", artist: "Mattia Preti", artistLife: "1613-1699", year: "Unknown", originalSize: "230 x 309 cm", price: 32035 },
  { title: "John The Baptist Preaching", artist: "Mattia Preti", artistLife: "1613-1699", year: "1667", originalSize: "217.2 x 170.2 cm", price: 20559 },
  { title: "St Paul The Hermit", artist: "Mattia Preti", artistLife: "1613-1699", year: "1660", originalSize: "125 x 101 cm", price: 13643 },
  { title: "Interior Of St George's Chapel", artist: "James Baker Pyne", artistLife: "1800-1870", year: "1838", originalSize: "91 x 64 cm", price: 12091 },
  { title: "South Corridor Windsor Castle", artist: "James Baker Pyne", artistLife: "1800-1870", year: "1839", originalSize: "70 x 91 cm", price: 11138 },
  { title: "The Queen's Private Sitting Room Windsor Castle", artist: "James Baker Pyne", artistLife: "1800-1870", year: "1838", originalSize: "63 x 91 cm", price: 10737 },
  { title: "The Library Windsor Castle", artist: "James Baker Pyne", artistLife: "1800-1870", year: "1838", originalSize: "68 x 91 cm", price: 10000 },
  { title: "Peddler", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1930", originalSize: "28.4 x 26 cm", price: 3900 },
  { title: "Bird", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1941", originalSize: "61.5 x 70.5 cm", price: 8100 },
  { title: "Stenographic Figure", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1942", originalSize: "40 x 56 cm", price: 4950 },
  { title: "Male And Female", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1942", originalSize: "73.1 x 49 cm", price: 8100 },
  { title: "Moon Woman", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1942", originalSize: "175.2 x 109.3 cm", price: 15900 },
  { title: "Blue Moby Dick", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1943", originalSize: "47.6 x 60.6 cm", price: 8000 },
  { title: "The Tea Cup", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1945", originalSize: "40 x 28 cm", price: 4210 },
  { title: "The Key", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1946", originalSize: "149.8 x 208.3 cm", price: 18900 },
  { title: "Full Fathom Five", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1947", originalSize: "129.2 x 76.5 cm", price: 12200 },
  { title: "No.1", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1948", originalSize: "160 x 259 cm", price: 19900 },
  { title: "No. 5", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1948", originalSize: "243.8 x 121.9 cm", price: 17200 },
  { title: "Blue Poles No. 11", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1952", originalSize: "212.1 x 488.9 cm", price: 26900 },
  { title: "Number One (Lavender Mist)", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1950", originalSize: "223.5 x 302.3 cm", price: 22000 },
  { title: "Convergence", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1952", originalSize: "237.5 x 393.7 cm", price: 25900 },
  { title: "The Deep", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1953", originalSize: "220.4 x 150.2 cm", price: 18100 },
  { title: "Ink On Paper", artist: "Jackson Pollock", artistLife: "1912-1956", year: "1950", originalSize: "44.5 x 56.2 cm", price: 7200 }
];

// Get list of image files
const imageDir = './public/image/P/';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

console.log('Available images:', imageFiles);
console.log('\nGenerating TypeScript entries...\n');

// Generate TypeScript entries
let output = 'export const pArtworks = [\n';
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

  const sku = `AM-P-${String(skuCounter).padStart(3, '0')}`;
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
    image: "/image/P/${imageFile}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${artwork.price}, label: 'Original Size' }],
  },

`;
});

output += '];\n\nexport default pArtworks;\n';

console.log(output);
console.log(`\nTotal artworks processed: ${skuCounter - 1}`);

// Write to file
fs.writeFileSync('./scripts/p_artworks_output.ts', output);
console.log('\nOutput written to scripts/p_artworks_output.ts');
