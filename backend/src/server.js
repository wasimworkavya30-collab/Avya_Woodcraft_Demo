'use strict';

const config = require('./config');
const { createApp } = require('./app');
const { ensureDatabase } = require('./db/init');
const { closeDb } = require('./db/index');

const bootstrap = ensureDatabase();
const app = createApp();

const server = app.listen(config.port, config.host, () => {
  const address = server.address();
  const port = address && typeof address === 'object' ? address.port : config.port;
  const origin = `http://${config.host}:${port}`;
  console.log(`Avya Woodcraft LLP — attendance API on ${origin}`);
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
