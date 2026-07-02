import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const src = path.join(__dirname, 'src', 'assets', 'song.mp3');
  const dest = path.join(__dirname, 'public', 'song.mp3');
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log('✅ Automatically copied song.mp3 to public directory');
  }
} catch (e) {
  console.error('Error copying mp3:', e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
