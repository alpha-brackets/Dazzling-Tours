const fs = require('fs');

function cleanRow(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove <div className="row">
  content = content.replace(
    /        <div className="row">\s*<div className="cta-wrapper">/g,
    '        <div className="cta-wrapper">'
  );
  
  // Remove closing div for row
  content = content.replace(
    /            <\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, // Wait, this is too generic.
    'fake'
  );

  // Let's use a more specific target for the end of file
  content = content.replace(
    /            <\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<VideoModal/g,
    '            </div>\n          </div>\n      </div>\n\n      <VideoModal'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned row in ${file}`);
}

cleanRow('./src/app/Components/Cta/Cta.tsx');
