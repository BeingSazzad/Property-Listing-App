/**
 * Prepare static files for Vercel (output: public/).
 * Copies HTML, JS, assets, and index into public/ for deployment.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public');

const COPY_FILES = [
  'index.html',
  'landlord_hq_mobile_screens.html',
  'landlord_hq_screens.js',
  'landlord_hq_contractor.js',
  'landlord_hq_features.js',
  'landlord_hq_product.js',
  'landlord_hq_client_feedback.js',
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

COPY_FILES.forEach((file) => {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, file));
});

copyRecursive(path.join(root, 'assets'), path.join(out, 'assets'));

console.log('Vercel build: copied static files to public/');
