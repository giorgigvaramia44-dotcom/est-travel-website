const fs = require('fs');
const path = require('path');
const { toursFile, seedToursFile, storageDir } = require('../config');

function ensureTourFile() {
  fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(toursFile)) {
    if (fs.existsSync(seedToursFile)) fs.copyFileSync(seedToursFile, toursFile);
    else fs.writeFileSync(toursFile, '[]', 'utf8');
  }
}

function readTours() {
  ensureTourFile();
  const raw = fs.readFileSync(toursFile, 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

function writeTours(tours) {
  ensureTourFile();
  const temp = `${toursFile}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(tours, null, 2), 'utf8');
  fs.renameSync(temp, toursFile);
}

module.exports = { readTours, writeTours, ensureTourFile };
