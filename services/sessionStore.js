const crypto =
  require('crypto');


const {
  adminPassword
} =
  require('../config');


const SESSION_LIFETIME =
  8 * 60 * 60 * 1000;



function sign(
  payload
) {

  return crypto
    .createHmac(
      'sha256',
      adminPassword
    )
    .update(
      payload
    )
    .digest(
      'hex'
    );

}



function createSession() {

  const expiresAt =
    Date.now() +
    SESSION_LIFETIME;


  const nonce =
    crypto
      .randomBytes(24)
      .toString('hex');


  const payload =
    `${expiresAt}.${nonce}`;


  return (
    `${payload}.${sign(payload)}`
  );

}



function isValidSession(
  token
) {

  if (!token) {

    return false;

  }


  const parts =
    String(token)
      .split('.');


  if (
    parts.length !== 3
  ) {

    return false;

  }


  const [
    expiresAtText,
    nonce,
    suppliedSignature
  ] =
    parts;


  const expiresAt =
    Number(
      expiresAtText
    );


  if (
    !Number.isFinite(
      expiresAt
    )
    ||
    Date.now() >
      expiresAt
    ||
    !nonce
  ) {

    return false;

  }


  const payload =
    `${expiresAtText}.${nonce}`;


  const expectedSignature =
    sign(
      payload
    );


  const supplied =
    Buffer.from(
      suppliedSignature,
      'utf8'
    );


  const expected =
    Buffer.from(
      expectedSignature,
      'utf8'
    );


  if (
    supplied.length !==
    expected.length
  ) {

    return false;

  }


  return crypto
    .timingSafeEqual(
      supplied,
      expected
    );

}



/*
 * Stateless session.
 * Logout removes the cookie.
 */
function destroySession() {}


module.exports = {

  createSession,

  isValidSession,

  destroySession

};
