const fs = require('fs');

function fixCta(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace 'fake' and the next line with the correct closing tags
  content = content.replace(
    /\s*fake\s*<\/div>/g,
    '\n              </div>\n            </div>\n          </div>\n        </div>'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed syntax in ${file}`);
}

fixCta('./src/app/Components/Cta/Cta.tsx');
