const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('./data/ART_DETAILS_Y.pdf');

pdf(dataBuffer).then(function(data) {
    console.log('Pages:', data.numpages);
    console.log('\n--- Extracted Text ---\n');
    console.log(data.text);
    
    // Save to file
    fs.writeFileSync('./scripts/y_extracted_text.txt', data.text);
    console.log('\n--- Text saved to scripts/y_extracted_text.txt ---');
});
