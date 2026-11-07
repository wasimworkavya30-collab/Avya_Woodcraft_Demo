'use strict';

const crypto = require('crypto');

/** Small request logger: method, path, status, duration, request id. */
function requestLogger(req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  const started = process.hrtime.bigint();
  res.setHeader('X-Request-Id', requestId);
  req.requestId = requestId;

  res.on('finish', () => {
    if (req.path === '/api/health') return;
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms ${requestId}`;
    if (res.statusCode >= 500) console.error(line);
    else console.log(line);
  });
  next();
}

/** Baseline security headers; no external script origins are needed. */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(self), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "media-src 'self' blob: data:",
      "connect-src 'self'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );
  next();
}

module.exports = { requestLogger, securityHeaders };
