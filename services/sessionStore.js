const crypto = require('crypto');
const { adminPassword } = require('../config');

const SESSION_LIFETIME = 8 * 60 * 60 * 1000;


/*
 * Creates a signed login token.
 *
 * Nothing needs to be stored in server memory,
 * so Railway restarts do not destroy the session.
 */
function createSession() {

  const expiresAt =
    Date.now() + SESSION_LIFETIME;

  const random =
    crypto.randomBytes(24).toString('hex');

  const payload =
    `${expiresAt}.${random}`;

  const signature =
    crypto
      .createHmac(
        'sha256',
        adminPassword
      )
      .update(payload)
      .digest('hex');

  return `${payload}.${signature}`;
}


/*
 * Checks whether the token:
 *
 * 1. has the correct structure
 * 2. has not expired
 * 3. has a valid cryptographic signature
 */
function isValidSession(token) {

  if (!token) {
    return false;
  }


  const parts =
    String(token).split('.');


  if (parts.length !== 3) {
    return false;
  }


  const [
    expiresAtString,
    random,
    providedSignature
  ] = parts;


  const expiresAt =
    Number(expiresAtString);


  if (
    !Number.isFinite(expiresAt) ||
    Date.now() > expiresAt
  ) {
    return false;
  }


  const payload =
    `${expiresAtString}.${random}`;


  const expectedSignature =
    crypto
      .createHmac(
        'sha256',
        adminPassword
      )
      .update(payload)
      .digest('hex');


  const providedBuffer =
    Buffer.from(
      providedSignature,
      'utf8'
    );


  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      'utf8'
    );


  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }


  return crypto.timingSafeEqual(
    providedBuffer,
    expectedBuffer
  );
}


/*
 * Stateless sessions do not need anything
 * removed from server memory.
 *
 * Logout is handled by deleting the browser cookie
 * inside apiRoutes.js.
 */
function destroySession() {
  return;
}


module.exports = {
  createSession,
  isValidSession,
  destroySession
};
