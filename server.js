const http = require('http');
const fs = require('fs');
const { URL } = require('url');

const {
  port,
  uploadsDir,
  adminPassword
} = require('./config');

const {
  handleApi
} = require('./routes/apiRoutes');

const {
  serveStatic,
  sendJson
} = require('./lib/http');

const {
  initTourStore
} = require('./services/tourStore');


if (!adminPassword) {
  console.error(
    'ADMIN_PASSWORD is missing. ' +
    'Set it in your hosting environment variables.'
  );

  process.exit(1);
}


fs.mkdirSync(
  uploadsDir,
  {
    recursive: true
  }
);


const server = http.createServer(
  async (req, res) => {

    try {

      const url = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
      );


      const pathname =
        url.pathname;


      /*
       * API
       */
      if (
        pathname.startsWith('/api/')
      ) {

        const handled =
          await handleApi(
            req,
            res,
            pathname
          );


        if (!handled) {

          sendJson(
            res,
            404,
            {
              error:
                'API endpoint not found.'
            }
          );

        }


        return;
      }



      /*
       * Important:
       *
       * /admin
       *
       * becomes
       *
       * /admin/
       *
       * This keeps CSS and JS asset paths
       * working correctly on Railway.
       */
      if (
        pathname === '/admin'
      ) {

        res.writeHead(
          302,
          {
            Location: '/admin/'
          }
        );


        res.end();


        return;
      }



      /*
       * Public files
       */
      serveStatic(
        req,
        res
      );

    }

    catch (error) {

      console.error(
        error
      );


      if (
        !res.headersSent
      ) {

        sendJson(
          res,
          500,
          {
            error:
              'Server error.'
          }
        );

      }

      else {

        res.end();

      }

    }

  }
);



async function start() {
  try {
    await initTourStore();
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }

  server.listen(
    port,
    '0.0.0.0',
    () => {
      console.log(
        `EST Travel is running on port ${port}.`
      );
    }
  );
}


start();
