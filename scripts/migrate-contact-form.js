const fs = require('fs');

function migrateForm(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add imports if not present
  if (!content.includes("import { Input } from")) {
    content = content.replace(
      /import Image from "next\/image";/g,
      'import Image from "next/image";\nimport { Input } from "@/components/ui/input";\nimport { Textarea } from "@/components/ui/textarea";\nimport { Button } from "@/components/ui/button";'
    );
  }

  // Replace inputs
  content = content.replace(
    /<input\s+type="text"\s+name="name"[\s\S]*?\/>/g,
    `<Input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="p-3 bg-white border shadow-none"
                            />`
  );

  content = content.replace(
    /<input\s+type="email"\s+name="email"[\s\S]*?\/>/g,
    `<Input
                              type="email"
                              name="email"
                              id="email4"
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="p-3 bg-white border shadow-none"
                            />`
  );

  content = content.replace(
    /<input\s+type="tel"\s+name="phone"[\s\S]*?\/>/g,
    `<Input
                              type="tel"
                              name="phone"
                              id="phone"
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="p-3 bg-white border shadow-none"
                            />`
  );

  content = content.replace(
    /<input\s+type="text"\s+name="subject"[\s\S]*?\/>/g,
    `<Input
                              type="text"
                              name="subject"
                              id="subject"
                              placeholder="Subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                              className="p-3 bg-white border shadow-none"
                            />`
  );

  // Replace textarea
  content = content.replace(
    /<textarea[\s\S]*?><\/textarea>/g,
    `<Textarea
                              name="message"
                              id="message"
                              placeholder="Your Message..."
                              rows={5}
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                              className="p-3 bg-white border shadow-none"
                            />`
  );

  // Replace button
  content = content.replace(
    /<button\s+type="submit"[\s\S]*?>[\s\S]*?<\/button>/g,
    `<Button
                            type="submit"
                            className="w-full py-3 bg-[#fd7e14] hover:bg-[#e66d00] text-white font-bold rounded-lg"
                            disabled={createContactMutation.isPending}
                          >
                            {createContactMutation.isPending
                              ? "Sending Securely..."
                              : "Send Message"}
                          </Button>`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Migrated form in ${file}`);
}

migrateForm('./src/app/Components/Contact/Contact.tsx');
