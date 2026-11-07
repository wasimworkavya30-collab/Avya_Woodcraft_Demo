'use strict';

const crypto = require('crypto');
const { getDb } = require('../db/index');
const config = require('../config');
const { ApiError } = require('../lib/errors');

const SESSION_TTL_MS = config.sessionTtlHours * 60 * 60 * 1000;

function parseCookies(header) {
  const jar = {};
  if (!header) return jar;
  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (name) jar[name] = decodeURIComponent(value);
  }
  return jar;
}

function cookieHeader(token, maxAgeSeconds) {
  const parts = [
    `${config.cookieName}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (config.secureCookies) parts.push('Secure');
  return parts.join('; ');
}

function pruneExpired() {
  getDb().prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
}

function createSession(res, { userId, role, employeeId }) {
  pruneExpired();
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  getDb()
    .prepare('INSERT INTO sessions (token, user_id, role, employee_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(token, userId, role, employeeId || null, now, now + SESSION_TTL_MS);
  res.append('Set-Cookie', cookieHeader(token, Math.floor(SESSION_TTL_MS / 1000)));
  return token;
}

function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[config.cookieName];
  if (token) getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.append('Set-Cookie', cookieHeader('', 0));
}

/** Attaches `req.session` when a valid session cookie is present. */
function attachSession(req, res, next) {
  const token = parseCookies(req.headers.cookie)[config.cookieName];
  if (!token) return next();
  const row = getDb().prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!row) return next();
  if (row.expires_at <= Date.now()) {
    getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return next();
  }
  req.session = {
    token,
    userId: row.user_id,
    role: row.role,
    employeeId: row.employee_id,
  };
  next();
}

function requireAuth(req, res, next) {
  if (!req.session) return next(ApiError.unauthorized());
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session) return next(ApiError.unauthorized());
  if (req.session.role !== 'admin') return next(ApiError.forbidden('Only the main admin can do this.'));
  next();
}

/** Blocks cross-site writes (defence in depth next to SameSite cookies). */
function sameOriginOnly(req, res, next) {
  const origin = req.headers.origin;
  if (!origin) return next();
  const host = req.headers.host;
  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch (err) {
    return next(ApiError.forbidden('Invalid origin.'));
  }
  if (originHost !== host) return next(ApiError.forbidden('Cross-site request blocked.'));
  next();
}

module.exports = {
  attachSession,
  requireAuth,
  requireAdmin,
  sameOriginOnly,
  createSession,
  destroySession,
  parseCookies,
};
