const fs = require('fs');

function replaceIcons(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace bi- prefix from strings if any left
  content = content.replace(/"bi-heart-fill"/g, '"heart-fill"');
  content = content.replace(/"bi-heart"/g, '"heart"');
  content = content.replace(/"bi-x-lg"/g, '"x"');
  content = content.replace(/"bi-arrow-right"/g, '"arrow-right"');

  // Tour.tsx specific <i> tags
  content = content.replace(
    /<i\s+className=\{`bi \$\{\s*isFavorite\(tour\._id\)\s*\?\s*"heart-fill"\s*:\s*"heart"\s*\}`\}\s*\/>/g,
    '<Icon name={isFavorite(tour._id) ? "heart-fill" : "heart"} />'
  );
  
  content = content.replace(
    /<i\s+className=\{`bi \$\{\s*searchTerm \? "x" : "arrow-right"\s*\}`\}\s*><\/i>/g,
    '<Icon name={searchTerm ? "x" : "arrow-right"} />'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Replaced icons in ${file}`);
}

replaceIcons('./src/app/Components/Tour/Tour.tsx');
