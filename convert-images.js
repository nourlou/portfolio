const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images/optimized';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertImage(file) {
  const inputPath = path.join(inputDir, file);
  const name = path.parse(file).name;

  console.log(`⏳ Conversion en cours : ${file}`);

  try {
    // WebP - Qualité bonne + taille raisonnable
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(outputDir, `${name}.webp`));

    // AVIF - Meilleure compression
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
      .avif({ quality: 75, effort: 9 })
      .toFile(path.join(outputDir, `${name}.avif`));

    console.log(`✅ Terminé : ${name}`);
  } catch (err) {
    console.error(`❌ Erreur avec ${file} :`, err.message);
  }
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Erreur de lecture du dossier :", err);
    return;
  }

  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  console.log(`🔍 ${imageFiles.length} images trouvées à convertir...\n`);
  
  imageFiles.forEach(convertImage);
});