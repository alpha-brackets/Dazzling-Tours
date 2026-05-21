const fs = require('fs');

function migrateGrid(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Top cards grid
  content = content.replace(
    /          <div className="row justify-content-center g-4">/g,
    '          <div className="flex flex-col md:flex-row justify-center gap-4">'
  );
  
  content = content.replace(
    /            <div className="col-xl-5 col-lg-6 col-md-6">/g,
    '            <div className="w-full md:w-1/2 lg:w-5/12">'
  );

  // Main wrapper grid (Form + Map)
  content = content.replace(
    /            <div className="row g-0 align-items-stretch">/g,
    '            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">'
  );

  content = content.replace(
    /              <div className="col-lg-6 px-5">/g,
    '              <div className="px-5">'
  );

  content = content.replace(
    /              <div className="col-lg-6">/g,
    '              <div>'
  );

  // Form inputs grid
  content = content.replace(
    /                      <div className="row g-4">/g,
    '                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
  );

  content = content.replace(
    /                        <div className="col-lg-6">/g,
    '                        <div>'
  );

  content = content.replace(
    /                        <div className="col-lg-12">/g,
    '                        <div className="md:col-span-2">'
  );

  content = content.replace(
    /                        <div className="col-lg-12 mt-3">/g,
    '                        <div className="md:col-span-2 mt-3">'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated grid in ${file}`);
}

migrateGrid('./src/app/Components/Contact/Contact.tsx');
