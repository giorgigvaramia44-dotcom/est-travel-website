const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../config');
const { readBody } = require('../lib/http');

const allowed = {
  'image/jpeg': { ext: '.jpg', check: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: '.png', check: (b) => b.length > 8 && b.slice(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])) },
  'image/webp': { ext: '.webp', check: (b) => b.length > 12 && b.slice(0,4).toString() === 'RIFF' && b.slice(8,12).toString() === 'WEBP' }
};

function parseMultipart(buffer, contentType) {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  const boundaryValue = boundaryMatch?.[1] || boundaryMatch?.[2];
  if (!boundaryValue) throw new Error('Invalid upload request.');

  const boundary = `--${boundaryValue}`;
  const raw = buffer.toString('latin1');
  const parts = raw.split(boundary).slice(1, -1);

  for (let part of parts) {
    if (part.startsWith('\r\n')) part = part.slice(2);
    if (part.endsWith('\r\n')) part = part.slice(0, -2);
    const separator = part.indexOf('\r\n\r\n');
    if (separator === -1) continue;

    const headersText = part.slice(0, separator);
    let contentText = part.slice(separator + 4);
    const nameMatch = /name="([^"]+)"/i.exec(headersText);
    const filenameMatch = /filename="([^"]*)"/i.exec(headersText);
    const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headersText);

    if (nameMatch?.[1] === 'image' && filenameMatch) {
      if (contentText.endsWith('\r\n')) contentText = contentText.slice(0, -2);
      return {
        filename: filenameMatch[1],
        mimeType: (typeMatch?.[1] || '').trim().toLowerCase(),
        data: Buffer.from(contentText, 'latin1')
      };
    }
  }

  throw new Error('Image file was not found in the upload.');
}

async function saveUploadedImage(req) {
  const body = await readBody(req, 7 * 1024 * 1024);
  const file = parseMultipart(body, req.headers['content-type']);
  const rule = allowed[file.mimeType];
  if (!rule) throw new Error('Only JPG, PNG and WEBP images are allowed.');
  if (file.data.length > 6 * 1024 * 1024) throw new Error('Image must be 6 MB or smaller.');
  if (!rule.check(file.data)) throw new Error('The uploaded image file is invalid.');

  fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${crypto.randomBytes(10).toString('hex')}${rule.ext}`;
  const fullPath = path.join(uploadsDir, fileName);
  fs.writeFileSync(fullPath, file.data);
  return { fileName, publicPath: `/uploads/${fileName}`, fullPath };
}

module.exports = { saveUploadedImage };
