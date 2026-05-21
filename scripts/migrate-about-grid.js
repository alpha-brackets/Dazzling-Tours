const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Main wrapper grid
  content = content.replace(
    /          <div className="row g-4">/g,
    '          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">'
  );
  
  content = content.replace(
    /            <div className="col-lg-6">/g,
    '            <div>'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/About/About.tsx');
