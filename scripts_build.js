const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Sync public static files to root for dual-mode Vercel compatibility
if (fs.existsSync('public')) {
  if (fs.existsSync('public/index.html')) fs.copyFileSync('public/index.html', 'index.html');
  if (fs.existsSync('public/robots.txt')) fs.copyFileSync('public/robots.txt', 'robots.txt');
  if (fs.existsSync('public/sitemap.xml')) fs.copyFileSync('public/sitemap.xml', 'sitemap.xml');
  if (fs.existsSync('public/css')) copyDir('public/css', 'css');
  if (fs.existsSync('public/js')) copyDir('public/js', 'js');
  if (fs.existsSync('public/assets')) copyDir('public/assets', 'assets');
}

console.log('Build: Static assets synchronized successfully.');
