const fs = require('fs');
const { toursFile } = require('../config');

function readTours() {
  const raw = fs.readFileSync(toursFile, 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

function writeTours(tours) {
  fs.writeFileSync(toursFile, JSON.stringify(tours, null, 2), 'utf8');
}

module.exports = { readTours, writeTours };
