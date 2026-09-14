const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { adminUsername, adminPassword, publicDir } = require('../config');
const { readTours, writeTours } = require('../services/tourStore');
const { createSession, isValidSession, destroySession } = require('../services/sessionStore');
const { saveUploadedImage } = require('../services/uploadParser');
const { sendJson, parseCookies, readJson } = require('../lib/http');

const loginAttempts = new Map();

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getClientIp(req) {
  return req.socket.remoteAddress || 'unknown';
}

function loginAllowed(ip) {
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || now > current.resetAt) {
    loginAttempts.set(ip, { count: 0, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  return current.count < 10;
}

function recordFailure(ip) {
  const current = loginAttempts.get(ip) || { count: 0, resetAt: Date.now() + 10 * 60 * 1000 };
  current.count += 1;
  loginAttempts.set(ip, current);
}

function sessionToken(req) {
  return parseCookies(req).est_owner_session || '';
}

function requireAdmin(req, res) {
  if (isValidSession(sessionToken(req))) return true;
  sendJson(res, 401, { error: 'Unauthorized' });
  return false;
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function removePublicImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const fullPath = path.join(publicDir, imagePath.replace(/^\//, ''));
  if (fs.existsSync(fullPath)) {
    try { fs.unlinkSync(fullPath); } catch (_) {}
  }
}

function findTourIndex(tours, id) {
  return tours.findIndex((tour) => tour.id === id);
}

function makeId(titleEn, titleKa) {
  const seed = titleEn || titleKa || 'tour';
  const slug = seed.toLowerCase().replace(/[^a-z0-9\u10a0-\u10ff]+/g, '-').replace(/^-+|-+$/g, '') || 'tour';
  return `${slug}-${Date.now()}`;
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/tours') {
    const tours = readTours().filter((tour) => tour.active !== false);
    sendJson(res, 200, tours);
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/admin/status') {
    sendJson(res, 200, { authenticated: isValidSession(sessionToken(req)) });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const ip = getClientIp(req);
    if (!loginAllowed(ip)) {
      sendJson(res, 429, { error: 'Too many login attempts. Try again later.' });
      return true;
    }

    let body;
    try { body = await readJson(req); } catch (_) {
      sendJson(res, 400, { error: 'Invalid login request.' });
      return true;
    }

    if (!safeEqual(body.username || '', adminUsername) || !safeEqual(body.password || '', adminPassword)) {
      recordFailure(ip);
      sendJson(res, 401, { error: 'Invalid username or password.' });
      return true;
    }

    loginAttempts.delete(ip);
    const token = createSession();
    sendJson(res, 200, { ok: true }, {
      'Set-Cookie': `est_owner_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
    });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    if (!requireAdmin(req, res)) return true;
    destroySession(sessionToken(req));
    sendJson(res, 200, { ok: true }, {
      'Set-Cookie': 'est_owner_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
    });
    return true;
  }

  if (pathname.startsWith('/api/admin/') && !requireAdmin(req, res)) return true;

  if (req.method === 'GET' && pathname === '/api/admin/tours') {
    sendJson(res, 200, readTours());
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/admin/tours') {
    let body;
    try { body = await readJson(req); } catch (_) {
      sendJson(res, 400, { error: 'Invalid tour data.' });
      return true;
    }

    const titleEn = normalizeText(body.titleEn);
    const titleKa = normalizeText(body.titleKa);
    if (!titleEn && !titleKa) {
      sendJson(res, 400, { error: 'Enter at least one tour title.' });
      return true;
    }

    const tours = readTours();
    const tour = {
      id: makeId(titleEn, titleKa),
      titleEn,
      titleKa,
      descriptionEn: normalizeText(body.descriptionEn),
      descriptionKa: normalizeText(body.descriptionKa),
      price: normalizeText(body.price),
      durationEn: normalizeText(body.durationEn),
      durationKa: normalizeText(body.durationKa),
      image: '',
      active: body.active !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : Date.now()
    };
    tours.push(tour);
    writeTours(tours);
    sendJson(res, 201, tour);
    return true;
  }

  const tourMatch = pathname.match(/^\/api\/admin\/tours\/([^/]+)$/);
  if (tourMatch && req.method === 'PUT') {
    const id = decodeURIComponent(tourMatch[1]);
    const tours = readTours();
    const index = findTourIndex(tours, id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Tour not found.' });
      return true;
    }

    let body;
    try { body = await readJson(req); } catch (_) {
      sendJson(res, 400, { error: 'Invalid tour data.' });
      return true;
    }

    const current = tours[index];
    const updated = {
      ...current,
      titleEn: normalizeText(body.titleEn ?? current.titleEn),
      titleKa: normalizeText(body.titleKa ?? current.titleKa),
      descriptionEn: normalizeText(body.descriptionEn ?? current.descriptionEn),
      descriptionKa: normalizeText(body.descriptionKa ?? current.descriptionKa),
      price: normalizeText(body.price ?? current.price),
      durationEn: normalizeText(body.durationEn ?? current.durationEn),
      durationKa: normalizeText(body.durationKa ?? current.durationKa),
      active: typeof body.active === 'boolean' ? body.active : current.active,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : current.sortOrder
    };

    if (!updated.titleEn && !updated.titleKa) {
      sendJson(res, 400, { error: 'Enter at least one tour title.' });
      return true;
    }

    tours[index] = updated;
    writeTours(tours);
    sendJson(res, 200, updated);
    return true;
  }

  if (tourMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(tourMatch[1]);
    const tours = readTours();
    const index = findTourIndex(tours, id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Tour not found.' });
      return true;
    }
    const [removed] = tours.splice(index, 1);
    removePublicImage(removed.image);
    writeTours(tours);
    sendJson(res, 200, { ok: true });
    return true;
  }

  const imageMatch = pathname.match(/^\/api\/admin\/tours\/([^/]+)\/image$/);
  if (imageMatch && req.method === 'POST') {
    const id = decodeURIComponent(imageMatch[1]);
    const tours = readTours();
    const index = findTourIndex(tours, id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Tour not found.' });
      return true;
    }

    try {
      const uploaded = await saveUploadedImage(req);
      removePublicImage(tours[index].image);
      tours[index].image = uploaded.publicPath;
      writeTours(tours);
      sendJson(res, 200, tours[index]);
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Upload failed.' });
    }
    return true;
  }

  if (imageMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(imageMatch[1]);
    const tours = readTours();
    const index = findTourIndex(tours, id);
    if (index === -1) {
      sendJson(res, 404, { error: 'Tour not found.' });
      return true;
    }
    removePublicImage(tours[index].image);
    tours[index].image = '';
    writeTours(tours);
    sendJson(res, 200, tours[index]);
    return true;
  }

  return false;
}

module.exports = { handleApi };
