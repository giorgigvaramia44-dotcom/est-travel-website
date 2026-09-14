const fs = require('fs');
const path = require('path');
const { publicDir, uploadsDir } = require('../config');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

function sendJson(res, status, data, extraHeaders = {}) {
  setSecurityHeaders(res);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  setSecurityHeaders(res);
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index === -1) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

function readBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error('Request is too large.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req, maxBytes = 1024 * 1024) {
  const buffer = await readBody(req, maxBytes);
  if (!buffer.length) return {};
  return JSON.parse(buffer.toString('utf8'));
}

function safeResolve(rootDir, requested) {
  const root = path.resolve(rootDir);
  const absolute = path.resolve(root, requested);
  if (absolute !== root && !absolute.startsWith(root + path.sep)) return null;
  return absolute;
}

function resolveStaticPath(urlPath) {
  let requested = decodeURIComponent(urlPath.split('?')[0]);

  if (requested.startsWith('/uploads/')) {
    return safeResolve(uploadsDir, requested.slice('/uploads/'.length));
  }

  if (requested === '/') requested = '/index.html';
  if (requested === '/admin') requested = '/admin/index.html';
  if (requested.endsWith('/')) requested += 'index.html';
  return safeResolve(publicDir, requested.replace(/^\//, ''));
}

function serveStatic(req, res) {
  const filePath = resolveStaticPath(req.url);
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendText(res, 404, 'Not found');
    return;
  }

  setSecurityHeaders(res);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const cacheControl = requestedCacheControl(filePath);
  res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': cacheControl });
  fs.createReadStream(filePath).pipe(res);
}

function requestedCacheControl(filePath) {
  if (filePath.startsWith(path.resolve(uploadsDir))) return 'public, max-age=3600';
  if (/\.(css|js|png|jpg|jpeg|webp|svg|ico)$/i.test(filePath)) return 'public, max-age=300';
  return 'no-cache';
}

module.exports = { sendJson, sendText, parseCookies, readBody, readJson, serveStatic };
