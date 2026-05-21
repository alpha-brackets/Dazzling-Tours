const fs = require('fs');

function cleanRow(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove <div className="row"> and <div className="col-12">
  content = content.replace(
    /          <div className="row">\s*<div className="col-12">/g,
    ''
  );
  
  // Remove closing divs for row and col-12
  // They are at the end of the file, before </div>\n      </section>
  content = content.replace(
    /            <\/div>\s*<\/div>\s*<\/div>\s*<\/section>/g,
    '          </div>\n      </section>'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned row in ${file}`);
}

cleanRow('./src/app/(innerpage)/privacy-policy/page.tsx');
cleanRow('./src/app/(innerpage)/terms-and-conditions/page.tsx');
