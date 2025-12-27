const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./data/ART_DETAILS_Z.pdf');

pdf(dataBuffer).then(function(data) {
    console.log('Pages:', data.numpages);
    console.log('\n--- Extracted Text ---\n');
    console.log(data.text);
    
    // Save to file
    fs.writeFileSync('./scripts/z_extracted_text.txt', data.text);
    console.log('\n--- Text saved to scripts/z_extracted_text.txt ---');
});
