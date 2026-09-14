const fs = require('fs');
const path = require('path');

const root = __dirname;
let localConfig = {};
const localConfigPath = path.join(root, 'private-config.json');
if (fs.existsSync(localConfigPath)) {
  try {
    localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
  } catch (_) {
    console.warn('private-config.json exists but could not be read. Environment variables will be used.');
  }
}

const storageDir = process.env.STORAGE_DIR || path.join(root, 'storage');

module.exports = {
  root,
  port: Number(process.env.PORT || localConfig.port || 3000),
  adminUsername: String(process.env.ADMIN_USERNAME || localConfig.adminUsername || 'owner'),
  adminPassword: String(process.env.ADMIN_PASSWORD || localConfig.adminPassword || ''),
  publicDir: path.join(root, 'public'),
  seedToursFile: path.join(root, 'data', 'tours.json'),
  storageDir,
  uploadsDir: path.join(storageDir, 'uploads'),
  toursFile: path.join(storageDir, 'tours.json')
};
