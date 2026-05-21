const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Header
  content = content.replace(
    /        <div className="row align-items-end mb-4">/g,
    '        <div className="flex flex-col lg:flex-row justify-between items-end mb-4">'
  );
  
  content = content.replace(
    /          <div className="col-lg-8">/g,
    '          <div className="w-full lg:w-2/3">'
  );

  content = content.replace(
    /          <div className="col-lg-4 text-lg-end">/g,
    '          <div className="w-full lg:w-1/3 text-left lg:text-right">'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/FeaturedTour/FeaturedTour.tsx');
