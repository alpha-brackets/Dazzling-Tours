const fs = require('fs');

function cleanRow(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove <div className="row">
  content = content.replace(
    /        <div className="row">\s*<div className="page-heading">/g,
    '        <div className="page-heading">'
  );
  
  // Remove closing div for row
  content = content.replace(
    /            <\/ul>\s*<\/div>\s*<\/div>\s*<\/div>/g,
    '            </ul>\n          </div>\n      </div>'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned row in ${file}`);
}

cleanRow('./src/app/Components/Common/BreadCrumb.tsx');
