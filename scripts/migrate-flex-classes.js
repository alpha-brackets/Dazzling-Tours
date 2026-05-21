const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function migrateFlex(file) {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Flex display
  content = content.replace(/d-flex/g, 'flex');
  
  // Justify Content
  content = content.replace(/justify-content-center/g, 'justify-center');
  content = content.replace(/justify-content-between/g, 'justify-between');
  content = content.replace(/justify-content-around/g, 'justify-around');
  content = content.replace(/justify-content-start/g, 'justify-start');
  content = content.replace(/justify-content-end/g, 'justify-end');
  
  // Align Items
  content = content.replace(/align-items-center/g, 'items-center');
  content = content.replace(/align-items-start/g, 'items-start');
  content = content.replace(/align-items-end/g, 'items-end');
  
  // Flex Direction
  content = content.replace(/flex-column/g, 'flex-col');
  
  // Flex Wrap
  content = content.replace(/flex-wrap/g, 'flex-wrap');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Migrated flex classes in ${file}`);
  }
}

walkDir('./src/app', migrateFlex);
