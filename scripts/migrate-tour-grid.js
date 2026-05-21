const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Header
  content = content.replace(
    /        <div className="row align-items-end mb-5">/g,
    '        <div className="flex flex-col lg:flex-row justify-between items-end mb-5">'
  );
  content = content.replace(
    /          <div className="col-xl-8 col-lg-7">/g,
    '          <div className="w-full lg:w-2/3">'
  );
  content = content.replace(
    /          <div className="col-xl-4 col-lg-5"><\/div>/g,
    '          <div className="w-full lg:w-1/3"><\/div>'
  );

  // Main wrapper grid
  content = content.replace(
    /<div className="tour-destination-wrapper">\s*<div className="row g-4">/g,
    '<div className="tour-destination-wrapper">\n          <div className="grid grid-cols-12 gap-4">'
  );
  
  content = content.replace(
    /            <div className="col-xl-8">/g,
    '            <div className="col-span-12 lg:col-span-8">'
  );

  // Inner grid for tours
  content = content.replace(
    /\) : \(\s*<div className="row g-4">/g,
    ') : (\n                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">'
  );

  content = content.replace(
    /                      className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow"/g,
    '                      className="wow fadeInUp"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Tour/Tour.tsx');
