const crypto = require('crypto');

const sessions = new Map();
const SESSION_LIFETIME = 8 * 60 * 60 * 1000;

function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { expiresAt: Date.now() + SESSION_LIFETIME });
  return token;
}

function isValidSession(token) {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  session.expiresAt = Date.now() + SESSION_LIFETIME;
  return true;
}

function destroySession(token) {
  if (token) sessions.delete(token);
}

module.exports = { createSession, isValidSession, destroySession };
