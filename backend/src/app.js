'use strict';

const path = require('path');
const express = require('express');

const config = require('./config');
const apiRouter = require('./routes/index');
const { attachSession } = require('./middleware/session');
const { requestLogger, securityHeaders } = require('./middleware/http');
const { ApiError } = require('./lib/errors');

function notFound(req, res, next) {
  next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}.`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const body = {
    error: {
      message: status === 500 && config.isProduction ? 'Something went wrong. Please try again.' : err.message,
      code: err.code || (status === 500 ? 'internal_error' : 'error'),
    },
    requestId: req.requestId,
  };
  if (err.details) body.error.details = err.details;
  if (status >= 500) console.error(`[${req.requestId || '-'}] ${req.method} ${req.originalUrl}`, err);
  res.status(status).json(body);
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(requestLogger);
  app.use(express.json({ limit: '32mb' }));
  app.use(attachSession);

  app.use('/api', apiRouter);

  // Frontend tier: static single-page app.
  app.use(
    express.static(config.frontendDir, {
      index: false,
      etag: true,
      maxAge: config.isProduction ? '1h' : 0,
      setHeaders(res, filePath) {
        if (path.extname(filePath) === '.html') res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api/')) return next();
    res.sendFile('index.html', { root: config.frontendDir });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
