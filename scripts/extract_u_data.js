const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = './data/ART_DETAILS_U.pdf';

async function extractPdfData() {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('PDF Text Content:');
    console.log('='.repeat(80));
    console.log(data.text);
    console.log('='.repeat(80));
    console.log('\nTotal pages:', data.numpages);
    
    // Save to file for easier processing
    fs.writeFileSync('./scripts/u_extracted_text.txt', data.text);
    console.log('\nText saved to scripts/u_extracted_text.txt');
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

extractPdfData();
