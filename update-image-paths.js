const fs = require('fs');
const path = require('path');

const updateImageImports = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Update import statements
    const importRegex = /import\s+(\w+)\s+from\s+['"`]([^'"`]*\/assets\/[^'"`]*\.(jpg|jpeg|png))['"`]/g;
    content = content.replace(importRegex, (match, varName, imagePath, ext) => {
      const optimizedPath = imagePath.replace('/assets/', '/assets-optimized/');
      updated = true;
      return `import ${varName} from '${optimizedPath}'`;
    });

    // Update require statements
    const requireRegex = /require\(['"`]([^'"`]*\/assets\/[^'"`]*\.(jpg|jpeg|png))['"`]\)/g;
    content = content.replace(requireRegex, (match, imagePath, ext) => {
      const optimizedPath = imagePath.replace('/assets/', '/assets-optimized/');
      updated = true;
      return `require('${optimizedPath}')`;
    });

    // Update src attributes in JSX
    const srcRegex = /src\s*=\s*['"`]([^'"`]*\/assets\/[^'"`]*\.(jpg|jpeg|png))['"`]/g;
    content = content.replace(srcRegex, (match, imagePath, ext) => {
      const optimizedPath = imagePath.replace('/assets/', '/assets-optimized/');
      updated = true;
      return `src="${optimizedPath}"`;
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
};

const processDirectory = (dir) => {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other directories
      if (!['node_modules', '.git', 'build', 'dist'].includes(entry)) {
        processDirectory(fullPath);
      }
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      updateImageImports(fullPath);
    }
  }
};

console.log('🔄 Updating image paths to use optimized versions...');
console.log('');

// Process client src directory
const clientSrc = './client/src';
if (fs.existsSync(clientSrc)) {
  processDirectory(clientSrc);
}

console.log('');
console.log('✅ Image path update complete!');
console.log('📋 All imports now point to optimized images');
console.log('💡 Make sure to copy optimized images to production build');