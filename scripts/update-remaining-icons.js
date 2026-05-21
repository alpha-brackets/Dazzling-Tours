const fs = require('fs');

function replaceInFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [search, replace] of replacements) {
    if (search instanceof RegExp) {
      content = content.replace(search, replace);
    } else {
      content = content.split(search).join(replace);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes made to ${file}`);
  }
}

// 1. Blog2.tsx
replaceInFile('./src/app/Components/Blogs/Blog2.tsx', [
  [/"bi-x-lg"/g, '"x"'],
  [/"bi-arrow-right"/g, '"arrow-right"'],
  [/<i\s+className=\{`bi \$\{\s*searchTerm \? "x" : "arrow-right"\s*\}`\}\s*><\/i>/g, '<Icon name={searchTerm ? "x" : "arrow-right"} />']
]);

// 2. admin/layout.tsx
replaceInFile('./src/app/admin/layout.tsx', [
  ['"bi bi-speedometer2"', '"speedometer"'],
  ['"bi bi-folder"', '"folder"'],
  ['"bi bi-map"', '"map"'],
  ['"bi bi-chat-quote"', '"message-square"'],
  ['"bi bi-journal-text"', '"book"'],
  ['"bi bi-chat-dots"', '"message-circle"'],
  ['"bi bi-telephone"', '"phone"']
]);

// 3. admin/Components/Sidebar.tsx
replaceInFile('./src/app/admin/Components/Sidebar.tsx', [
  ['"bi bi-speedometer2"', '"speedometer"'],
  ['"bi bi-folder"', '"folder"'],
  ['"bi bi-map"', '"map"'],
  ['"bi bi-chat-quote"', '"message-square"'],
  ['"bi bi-journal-text"', '"book"'],
  ['"bi bi-chat-dots"', '"message-circle"'],
  ['"bi bi-telephone"', '"phone"']
]);
