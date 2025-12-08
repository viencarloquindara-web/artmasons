const fs = require('fs');
const path = require('path');
const src = fs.readFileSync('data/artworks.ts','utf8');
const imgs = [...src.matchAll(/image:\s*"([^\"]+)"/g)].map(m=>m[1]);
console.log('Found', imgs.length, 'image paths');
imgs.forEach(p=>{
  const file = path.join('public', p.replace(/^\//,''));
  const exists = fs.existsSync(file);
  console.log((exists ? 'OK  ' : 'MISS'), p, '=>', exists ? file : 'not found');
});
