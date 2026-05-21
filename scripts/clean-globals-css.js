const fs = require('fs');

function cleanCss(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the start and end of the block to remove
  const startMarker = '/* Lightbox Modal High-End Styling - Minimalist Art Gallery Feel */';
  const endMarker = '/* Fix for unwanted text capitalization in form fields */';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Cleaned orphaned modal styles in ${file}`);
  } else {
    console.log('Markers not found in file');
  }
}

cleanCss('./src/app/globals.css');
