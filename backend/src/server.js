
'use strict';

const config = require('./config');
const { createApp } = require('./app');
const { ensureDatabase } = require('./db/init');
const { closeDb } = require('./db/index');

const bootstrap = ensureDatabase();
const app = createApp();

const PORT = process.env.PORT || config.port;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  const port = address && typeof address === 'object'
    ? address.port
    : PORT;

  const origin = `http://${HOST}:${port}`;

  console.log(`Avya Woodcraft LLP — attendance API running on port ${port}`);
  console.log(`Frontend: ${origin}/`);
  console.log(`Database: ${config.dbPath} (${bootstrap.seeded ? 'seeded from approved demo data' : 'ready'})`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err.message);
  process.exitCode = 1;
  closeDb();
});

function shutdown(signal) {
  console.log(`\n${signal} received — closing server.`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;
