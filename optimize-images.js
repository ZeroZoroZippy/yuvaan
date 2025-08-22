const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './client/src/assets';
const outputDir = './client/src/assets-optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (inputPath, outputPath, quality = 80) => {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    // Get file extension
    const ext = path.extname(inputPath).toLowerCase();
    
    let sharpInstance = sharp(inputPath);
    
    // Resize if too large (max width: 1920px for hero images, 800px for others)
    const isHero = inputPath.includes('Hero');
    const maxWidth = isHero ? 1920 : 800;
    
    // Optimize based on file type
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance
        .resize(maxWidth, null, { withoutEnlargement: true })
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toFile(outputPath);
    } else if (ext === '.png') {
      await sharpInstance
        .resize(maxWidth, null, { withoutEnlargement: true })
        .png({ quality, progressive: true })
        .toFile(outputPath);
    }
    
    // Also create WebP version
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharpInstance
      .resize(maxWidth, null, { withoutEnlargement: true })
      .webp({ quality })
      .toFile(webpPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}: ${(originalSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB (${savings}% saved)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
};

const processDirectory = async (dir, relativeDir = '') => {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const inputPath = path.join(dir, entry);
    const outputPath = path.join(outputDir, relativeDir, entry);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      // Create corresponding output directory
      if (!fs.existsSync(path.join(outputDir, relativeDir, entry))) {
        fs.mkdirSync(path.join(outputDir, relativeDir, entry), { recursive: true });
      }
      await processDirectory(inputPath, path.join(relativeDir, entry));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry)) {
      await optimizeImage(inputPath, outputPath);
    }
  }
};

const main = async () => {
  console.log('🖼️  Starting image optimization...');
  console.log(`📁 Input: ${inputDir}`);
  console.log(`📁 Output: ${outputDir}`);
  console.log('');
  
  await processDirectory(inputDir);
  
  console.log('');
  console.log('✅ Image optimization complete!');
  console.log('📋 Next steps:');
  console.log('1. Update your components to use optimized images');
  console.log('2. Implement lazy loading');
  console.log('3. Use WebP with fallbacks for better compression');
};

main().catch(console.error);