const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Main wrapper grid
  content = content.replace(
    /          <div className="row g-4 align-items-center">/g,
    '          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">'
  );
  
  content = content.replace(
    /            <div className="col-xl-7 col-lg-6">/g,
    '            <div className="lg:col-span-7">'
  );

  content = content.replace(
    /            <div\s+className="col-xl-5 col-lg-6 wow fadeInUp wow"/g,
    '            <div className="lg:col-span-5 wow fadeInUp"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Choose/Choose.tsx');
