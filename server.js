const http = require('http');
const fs = require('fs');
const { URL } = require('url');
const { port, uploadsDir, adminPassword } = require('./config');
const { handleApi } = require('./routes/apiRoutes');
const { serveStatic, sendJson } = require('./lib/http');

if (!adminPassword) {
  console.error('adminPassword is missing in private-config.json');
  process.exit(1);
}

fs.mkdirSync(uploadsDir, { recursive: true });

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, pathname);
      if (!handled) sendJson(res, 404, { error: 'API endpoint not found.' });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) sendJson(res, 500, { error: 'Server error.' });
    else res.end();
  }
});

server.listen(port, () => {
  console.log('');
  console.log('EST Travel is running.');
  console.log(`Public website: http://localhost:${port}`);
  console.log(`Owner admin:    http://localhost:${port}/admin`);
  console.log('Press Ctrl+C to stop the server.');
  console.log('');
});
