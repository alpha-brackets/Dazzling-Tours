const fs = require('fs');

function refactorComponent(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace form-input-base with Tailwind classes
  content = content.replace(
    /      form-input-base/g,
    '      w-full rounded-lg transition-all duration-200 outline-none border-2 border-gray-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(253,125,2,0.1)]'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Refactored ${file}`);
}

refactorComponent('./src/app/Components/Form/TextInput.tsx');
