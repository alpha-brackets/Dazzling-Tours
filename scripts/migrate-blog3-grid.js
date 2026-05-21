const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Main wrapper grid
  content = content.replace(
    /        <div className="row">/g,
    '        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">'
  );
  
  content = content.replace(
    /                className="col-xl-4 col-md-6 col-lg-6 wow fadeInUp"/g,
    '                className="wow fadeInUp"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Blogs/Blog3.tsx');
