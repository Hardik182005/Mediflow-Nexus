const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('app/(dashboard)');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Convert text-black/XX to text-black
  content = content.replace(/text-black\/\[?[\d.]+\]?/g, 'text-black');
  
  // 2. Convert text-white/XX to text-white
  content = content.replace(/text-white\/\[?[\d.]+\]?/g, 'text-white');
  
  // 3. Convert border-black/XX to border-black
  content = content.replace(/border-black\/\[?[\d.]+\]?/g, 'border-black');

  // 4. Convert border-white/XX to border-black (since it's a white theme)
  content = content.replace(/border-white\/\[?[\d.]+\]?/g, 'border-black');

  // 5. Convert bg-black/XX to bg-white or border, actually for backgrounds it's better to make them white if they were faint grey
  content = content.replace(/bg-black\/\[?0\.[01]\d*\]?/g, 'bg-white'); // very light greys to white
  content = content.replace(/bg-black\/\[?0\.[2-9]\d*\]?/g, 'bg-black text-white'); // darker greys to black

  // 6. hover:text-white on white background -> hover:text-black
  content = content.replace(/hover:text-white/g, 'hover:text-white hover:bg-black');
  
  // 7. Fix getStatusBadge
  if (file.includes('buyer-discovery') && file.includes('page.tsx')) {
    content = content.replace(/case 'perfect': return \"[^\"]+\";/, "case 'perfect': return \"bg-black text-white border-black\";");
    content = content.replace(/case 'strong': return \"[^\"]+\";/, "case 'strong': return \"bg-white text-black border-black border-2\";");
    content = content.replace(/case 'potential': return \"[^\"]+\";/, "case 'potential': return \"bg-white text-black border-black border border-dashed\";");
    content = content.replace(/default: return \"[^\"]+\";/, "default: return \"bg-white text-black border-black border\";");

    // Fix the crash
    content = content.replace(/\{b\.buyer_org\[0\]\}/g, '{(b.buyer_org || "?")[0]}');
    content = content.replace(/\{b\.buyer_org\}/g, '{b.buyer_org || "Unknown Organization"}');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
