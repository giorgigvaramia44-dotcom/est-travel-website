const fs = require('fs');
const path = require('path');

const root = __dirname;
const configPath = path.join(root, 'private-config.json');
const privateConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
  root,
  port: Number(privateConfig.port || 3000),
  adminUsername: String(privateConfig.adminUsername || 'owner'),
  adminPassword: String(privateConfig.adminPassword || ''),
  publicDir: path.join(root, 'public'),
  uploadsDir: path.join(root, 'public', 'uploads'),
  toursFile: path.join(root, 'data', 'tours.json')
};
