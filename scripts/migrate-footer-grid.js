const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Main wrapper grid
  content = content.replace(
    /          <div className="row">/g,
    '          <div className="grid grid-cols-12 gap-8">'
  );
  
  content = content.replace(
    /            <div\s+className="col-xl-4 col-lg-4 col-md-6 col-sm-12 wow fadeInUp"/g,
    '            <div className="col-span-12 md:col-span-6 lg:col-span-4 wow fadeInUp"'
  );

  content = content.replace(
    /            <div\s+className="col-xl-2 col-lg-3 col-md-4 col-sm-6 ps-lg-5 wow fadeInUp wow"/g,
    '            <div className="col-span-6 md:col-span-4 lg:col-span-3 lg:pl-5 wow fadeInUp wow"'
  );

  content = content.replace(
    /            <div\s+className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-xl-5 wow fadeInUp wow"/g,
    '            <div className="col-span-6 md:col-span-6 lg:col-span-5 lg:pl-5 wow fadeInUp wow"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Footer/Footer.tsx');
