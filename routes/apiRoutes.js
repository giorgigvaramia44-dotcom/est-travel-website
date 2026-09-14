const crypto =
  require('crypto');

const fs =
  require('fs');

const path =
  require('path');


const {
  adminUsername,
  adminPassword,
  uploadsDir
} =
  require('../config');


const {
  readTours,
  writeTours
} =
  require('../services/tourStore');


const {
  createSession,
  isValidSession,
  destroySession
} =
  require('../services/sessionStore');


const {
  saveUploadedImage,
  readTourWithImage
} =
  require('../services/uploadParser');


const {
  sendJson,
  parseCookies,
  readJson
} =
  require('../lib/http');


const loginAttempts =
  new Map();



function safeEqual(
  left,
  right
) {

  const a =
    Buffer.from(
      String(left)
    );


  const b =
    Buffer.from(
      String(right)
    );


  return (
    a.length === b.length &&
    crypto.timingSafeEqual(
      a,
      b
    )
  );

}



function getClientIp(req) {

  return (
    req.headers[
      'x-forwarded-for'
    ]
      ?.split(',')[0]
      ?.trim()

    ||

    req.socket
      .remoteAddress

    ||

    'unknown'
  );

}



function loginAllowed(ip) {

  const now =
    Date.now();


  const current =
    loginAttempts.get(ip);


  if (
    !current ||
    now > current.resetAt
  ) {

    loginAttempts.set(
      ip,
      {
        count: 0,
        resetAt:
          now +
          10 * 60 * 1000
      }
    );


    return true;

  }


  return (
    current.count < 10
  );

}



function recordFailure(ip) {

  const current =
    loginAttempts.get(ip)

    ||

    {
      count: 0,

      resetAt:
        Date.now() +
        10 * 60 * 1000
    };


  current.count += 1;


  loginAttempts.set(
    ip,
    current
  );

}



function sessionToken(req) {

  return (
    parseCookies(req)
      .est_owner_session

    ||

    ''
  );

}



function requireAdmin(
  req,
  res
) {

  if (
    isValidSession(
      sessionToken(req)
    )
  ) {

    return true;

  }


  sendJson(
    res,
    401,
    {
      error:
        'Unauthorized'
    }
  );


  return false;

}



function normalizeText(value) {

  return String(
    value ?? ''
  ).trim();

}



function removePublicImage(
  imagePath
) {

  if (
    !imagePath ||
    !imagePath.startsWith(
      '/uploads/'
    )
  ) {

    return;

  }


  const fileName =
    path.basename(
      imagePath
    );


  const fullPath =
    path.join(
      uploadsDir,
      fileName
    );


  if (
    fs.existsSync(
      fullPath
    )
  ) {

    try {

      fs.unlinkSync(
        fullPath
      );

    }

    catch (_) {}

  }

}



function findTourIndex(
  tours,
  id
) {

  return tours.findIndex(
    (tour) =>
      tour.id === id
  );

}



function makeId(
  titleEn,
  titleKa
) {

  const seed =
    titleEn ||
    titleKa ||
    'tour';


  const slug =
    seed

      .toLowerCase()

      .replace(
        /[^a-z0-9\u10a0-\u10ff]+/g,
        '-'
      )

      .replace(
        /^-+|-+$/g,
        ''
      )

    ||

    'tour';


  return (
    `${slug}-${Date.now()}`
  );

}



function secureCookiePart(
  req
) {

  const forwardedProto =
    String(
      req.headers[
        'x-forwarded-proto'
      ] || ''
    )
      .toLowerCase();


  return (
    forwardedProto ===
    'https'

      ? '; Secure'

      : ''
  );

}



function buildTourFromFields(
  fields,
  imagePath = ''
) {

  const titleEn =
    normalizeText(
      fields.titleEn
    );


  const titleKa =
    normalizeText(
      fields.titleKa
    );


  if (
    !titleEn &&
    !titleKa
  ) {

    throw new Error(
      'Enter at least one tour title.'
    );

  }


  const now =
    new Date()
      .toISOString();


  return {

    id:
      makeId(
        titleEn,
        titleKa
      ),

    titleEn,

    titleKa,

    descriptionEn:
      normalizeText(
        fields.descriptionEn
      ),

    descriptionKa:
      normalizeText(
        fields.descriptionKa
      ),

    price:
      normalizeText(
        fields.price
      ),

    durationEn:
      normalizeText(
        fields.durationEn
      ),

    durationKa:
      normalizeText(
        fields.durationKa
      ),

    image:
      imagePath,

    active:
      String(
        fields.active ??
        'true'
      ) !== 'false',

    sortOrder:
      Number.isFinite(
        Number(
          fields.sortOrder
        )
      )

        ? Number(
            fields.sortOrder
          )

        : Date.now(),

    createdAt:
      now,

    updatedAt:
      now

  };

}



async function handleApi(
  req,
  res,
  pathname
) {

  /*
   * PUBLIC TOURS
   */
  if (
    req.method === 'GET' &&
    pathname === '/api/tours'
  ) {

    const tours =
      readTours()

        .filter(
          (tour) =>
            tour.active !== false
        )

        .sort(
          (a, b) =>
            Number(
              a.sortOrder || 0
            )

            -

            Number(
              b.sortOrder || 0
            )
        );


    sendJson(
      res,
      200,
      tours
    );


    return true;

  }



  /*
   * ADMIN STATUS
   */
  if (
    req.method === 'GET' &&
    pathname ===
      '/api/admin/status'
  ) {

    sendJson(
      res,
      200,
      {
        authenticated:
          isValidSession(
            sessionToken(req)
          )
      }
    );


    return true;

  }



  /*
   * LOGIN
   */
  if (
    req.method === 'POST' &&
    pathname ===
      '/api/admin/login'
  ) {

    const ip =
      getClientIp(req);


    if (
      !loginAllowed(ip)
    ) {

      sendJson(
        res,
        429,
        {
          error:
            'Too many login attempts. Try again later.'
        }
      );


      return true;

    }


    let body;


    try {

      body =
        await readJson(req);

    }

    catch (_) {

      sendJson(
        res,
        400,
        {
          error:
            'Invalid login request.'
        }
      );


      return true;

    }


    const usernameOk =
      safeEqual(
        body.username || '',
        adminUsername
      );


    const passwordOk =
      safeEqual(
        body.password || '',
        adminPassword
      );


    if (
      !usernameOk ||
      !passwordOk
    ) {

      recordFailure(ip);


      sendJson(
        res,
        401,
        {
          error:
            'Invalid username or password.'
        }
      );


      return true;

    }


    loginAttempts.delete(
      ip
    );


    const token =
      createSession();


    sendJson(
      res,
      200,
      {
        ok: true
      },
      {
        'Set-Cookie':
          `est_owner_session=${encodeURIComponent(token)}; ` +
          `Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secureCookiePart(req)}`
      }
    );


    return true;

  }



  /*
   * LOGOUT
   */
  if (
    req.method === 'POST' &&
    pathname ===
      '/api/admin/logout'
  ) {

    destroySession(
      sessionToken(req)
    );


    sendJson(
      res,
      200,
      {
        ok: true
      },
      {
        'Set-Cookie':
          `est_owner_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureCookiePart(req)}`
      }
    );


    return true;

  }



  /*
   * EVERYTHING BELOW
   * REQUIRES ADMIN
   */
  if (
    pathname.startsWith(
      '/api/admin/'
    )
    &&
    !requireAdmin(
      req,
      res
    )
  ) {

    return true;

  }



  /*
   * GET ALL TOURS
   */
  if (
    req.method === 'GET' &&
    pathname ===
      '/api/admin/tours'
  ) {

    const tours =
      readTours()
        .sort(
          (a, b) =>
            Number(
              a.sortOrder || 0
            )

            -

            Number(
              b.sortOrder || 0
            )
        );


    sendJson(
      res,
      200,
      tours
    );


    return true;

  }



  /*
   * CREATE TOUR
   */
  if (
    req.method === 'POST' &&
    pathname ===
      '/api/admin/tours'
  ) {

    const contentType =
      String(
        req.headers[
          'content-type'
        ] || ''
      )
        .toLowerCase();


    /*
     * MULTIPART =
     * TOUR + PHOTO
     */
    if (
      contentType.startsWith(
        'multipart/form-data'
      )
    ) {

      let uploaded =
        null;


      try {

        const parsed =
          await readTourWithImage(
            req
          );


        uploaded =
          parsed.uploaded;


        const tour =
          buildTourFromFields(
            parsed.fields,
            uploaded.publicPath
          );


        const tours =
          readTours();


        tours.push(
          tour
        );


        writeTours(
          tours
        );


        sendJson(
          res,
          201,
          tour
        );

      }

      catch (error) {

        if (
          uploaded?.publicPath
        ) {

          removePublicImage(
            uploaded.publicPath
          );

        }


        sendJson(
          res,
          400,
          {
            error:
              error.message ||
              'Could not create tour.'
          }
        );

      }


      return true;

    }



    /*
     * JSON COMPATIBILITY
     */
    let body;


    try {

      body =
        await readJson(req);

    }

    catch (_) {

      sendJson(
        res,
        400,
        {
          error:
            'Invalid tour data.'
        }
      );


      return true;

    }


    try {

      const tour =
        buildTourFromFields(
          body,
          ''
        );


      const tours =
        readTours();


      tours.push(
        tour
      );


      writeTours(
        tours
      );


      sendJson(
        res,
        201,
        tour
      );

    }

    catch (error) {

      sendJson(
        res,
        400,
        {
          error:
            error.message ||
            'Could not create tour.'
        }
      );

    }


    return true;

  }



  /*
   * UPDATE / DELETE TOUR
   */
  const tourMatch =
    pathname.match(
      /^\/api\/admin\/tours\/([^/]+)$/
    );


  if (
    tourMatch &&
    req.method === 'PUT'
  ) {

    const id =
      decodeURIComponent(
        tourMatch[1]
      );


    const tours =
      readTours();


    const index =
      findTourIndex(
        tours,
        id
      );


    if (
      index === -1
    ) {

      sendJson(
        res,
        404,
        {
          error:
            'Tour not found.'
        }
      );


      return true;

    }


    let body;


    try {

      body =
        await readJson(req);

    }

    catch (_) {

      sendJson(
        res,
        400,
        {
          error:
            'Invalid tour data.'
        }
      );


      return true;

    }


    const current =
      tours[index];


    const updated = {

      ...current,

      titleEn:
        normalizeText(
          body.titleEn ??
          current.titleEn
        ),

      titleKa:
        normalizeText(
          body.titleKa ??
          current.titleKa
        ),

      descriptionEn:
        normalizeText(
          body.descriptionEn ??
          current.descriptionEn
        ),

      descriptionKa:
        normalizeText(
          body.descriptionKa ??
          current.descriptionKa
        ),

      price:
        normalizeText(
          body.price ??
          current.price
        ),

      durationEn:
        normalizeText(
          body.durationEn ??
          current.durationEn
        ),

      durationKa:
        normalizeText(
          body.durationKa ??
          current.durationKa
        ),

      active:
        typeof body.active ===
          'boolean'

          ? body.active

          : current.active,

      sortOrder:
        Number.isFinite(
          Number(
            body.sortOrder
          )
        )

          ? Number(
              body.sortOrder
            )

          : current.sortOrder,

      updatedAt:
        new Date()
          .toISOString()

    };


    if (
      !updated.titleEn &&
      !updated.titleKa
    ) {

      sendJson(
        res,
        400,
        {
          error:
            'Enter at least one tour title.'
        }
      );


      return true;

    }


    tours[index] =
      updated;


    writeTours(
      tours
    );


    sendJson(
      res,
      200,
      updated
    );


    return true;

  }



  if (
    tourMatch &&
    req.method === 'DELETE'
  ) {

    const id =
      decodeURIComponent(
        tourMatch[1]
      );


    const tours =
      readTours();


    const index =
      findTourIndex(
        tours,
        id
      );


    if (
      index === -1
    ) {

      sendJson(
        res,
        404,
        {
          error:
            'Tour not found.'
        }
      );


      return true;

    }


    const [removed] =
      tours.splice(
        index,
        1
      );


    removePublicImage(
      removed.image
    );


    writeTours(
      tours
    );


    sendJson(
      res,
      200,
      {
        ok: true
      }
    );


    return true;

  }



  /*
   * REPLACE / REMOVE IMAGE
   */
  const imageMatch =
    pathname.match(
      /^\/api\/admin\/tours\/([^/]+)\/image$/
    );


  if (
    imageMatch &&
    req.method === 'POST'
  ) {

    const id =
      decodeURIComponent(
        imageMatch[1]
      );


    const tours =
      readTours();


    const index =
      findTourIndex(
        tours,
        id
      );


    if (
      index === -1
    ) {

      sendJson(
        res,
        404,
        {
          error:
            'Tour not found.'
        }
      );


      return true;

    }


    let uploaded =
      null;


    try {

      uploaded =
        await saveUploadedImage(
          req
        );


      const oldImage =
        tours[index].image;


      /*
       * STORE NEW UNIQUE IMAGE
       */
      tours[index].image =
        uploaded.publicPath;


      /*
       * CHANGE VERSION
       */
      tours[index].updatedAt =
        new Date()
          .toISOString();


      writeTours(
        tours
      );


      /*
       * ONLY DELETE OLD IMAGE
       * AFTER NEW ONE IS STORED
       */
      removePublicImage(
        oldImage
      );


      sendJson(
        res,
        200,
        tours[index]
      );

    }

    catch (error) {

      if (
        uploaded?.publicPath
      ) {

        removePublicImage(
          uploaded.publicPath
        );

      }


      sendJson(
        res,
        400,
        {
          error:
            error.message ||
            'Upload failed.'
        }
      );

    }


    return true;

  }



  if (
    imageMatch &&
    req.method === 'DELETE'
  ) {

    const id =
      decodeURIComponent(
        imageMatch[1]
      );


    const tours =
      readTours();


    const index =
      findTourIndex(
        tours,
        id
      );


    if (
      index === -1
    ) {

      sendJson(
        res,
        404,
        {
          error:
            'Tour not found.'
        }
      );


      return true;

    }


    const oldImage =
      tours[index].image;


    tours[index].image =
      '';


    tours[index].updatedAt =
      new Date()
        .toISOString();


    writeTours(
      tours
    );


    removePublicImage(
      oldImage
    );


    sendJson(
      res,
      200,
      tours[index]
    );


    return true;

  }


  return false;

}


module.exports = {
  handleApi
};
