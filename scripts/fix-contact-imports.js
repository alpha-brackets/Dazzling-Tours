const fs = require('fs');

function fixImports(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add imports after the first line or after React import
  content = content.replace(
    /import React, { useState } from "react";/g,
    'import React, { useState } from "react";\nimport { Input } from "@/components/ui/input";\nimport { Textarea } from "@/components/ui/textarea";\nimport { Button } from "@/components/ui/button";'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed imports in ${file}`);
}

fixImports('./src/app/Components/Contact/Contact.tsx');
