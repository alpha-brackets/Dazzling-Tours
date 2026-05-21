const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Main wrapper grid
  content = content.replace(
    /<div className="row g-5">/g,
    '<div className="grid grid-cols-12 gap-5">'
  );
  
  content = content.replace(
    /            <div className="col-12 col-lg-8">/g,
    '            <div className="col-span-12 lg:col-span-8">'
  );

  content = content.replace(
    /            <div className="col-12 col-lg-4">/g,
    '            <div className="col-span-12 lg:col-span-4">'
  );

  // Inner grid for blogs
  content = content.replace(
    /                  <div className="row">/g,
    '                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
  );

  content = content.replace(
    /                          className="col-xxl-6 col-md-6 col-lg-6 wow fadeInUp wow"/g,
    '                          className="wow fadeInUp"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Blogs/Blog2.tsx');
