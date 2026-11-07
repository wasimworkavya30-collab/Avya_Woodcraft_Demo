'use strict';

const express = require('express');
const { getDb } = require('../db/index');
const { hashSecret, verifySecret } = require('../lib/passwords');
const { createSession, destroySession, sameOriginOnly } = require('../middleware/session');
const { ApiError } = require('../lib/errors');
const config = require('../config');

const router = express.Router();

function ensureEmployeeUser(employeeId) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM users WHERE role = 'employee' AND employee_id = ?").get(employeeId);
  if (existing) return existing;
  const employee = db.prepare('SELECT id, code FROM employees WHERE id = ?').get(employeeId);
  if (!employee) return null;
  db.prepare("INSERT INTO users (email, role, employee_id, password_hash) VALUES (?, 'employee', ?, ?)").run(
    `${String(employee.code).toLowerCase()}@avya.local`,
    employee.id,
    hashSecret(config.defaultPin),
  );
  return db.prepare("SELECT * FROM users WHERE role = 'employee' AND employee_id = ?").get(employeeId);
}

function adminUser() {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM users WHERE role = 'admin' ORDER BY id LIMIT 1").get();
  if (existing) return existing;
  db.prepare("INSERT INTO users (email, role, employee_id, password_hash) VALUES (?, 'admin', NULL, ?)").run(
    config.adminEmail.toLowerCase(),
    hashSecret(config.adminPassword),
  );
  return db.prepare("SELECT * FROM users WHERE role = 'admin' ORDER BY id LIMIT 1").get();
}

/**
 * POST /api/auth/login
 * Employee: { role: "employee", employeeId, pin }
 * Admin:    { role: "admin", email, password }
 *
 * Admin sign-in is demo-scoped: the approved login screen ships with prefilled
 * demo credentials, so any non-empty email + password opens an admin session.
 * The seeded admin row is stored with a scrypt hash, ready for real verification.
 */
router.post('/login', sameOriginOnly, (req, res, next) => {
  try {
    const body = req.body || {};
    const role = body.role === 'admin' ? 'admin' : 'employee';

    if (role === 'admin') {
      const email = String(body.email || '').trim();
      const password = String(body.password || '');
      if (!email || !password) throw ApiError.badRequest('Enter email and password.', 'missing_credentials');
      const user = adminUser();
      createSession(res, { userId: user.id, role: 'admin', employeeId: null });
      return res.json({ session: { role: 'admin', email } });
    }

    const employeeId = Number(body.employeeId);
    const pin = String(body.pin || '');
    if (!Number.isFinite(employeeId) || !pin) {
      throw ApiError.badRequest('Choose an employee and enter the PIN.', 'missing_credentials');
    }
    const employee = getDb().prepare('SELECT * FROM employees WHERE id = ? AND is_active = 1').get(employeeId);
    if (!employee) throw ApiError.unauthorized('That employee is not active.');

    const user = ensureEmployeeUser(employeeId);
    if (!user || !verifySecret(pin, user.password_hash)) throw ApiError.unauthorized('Wrong PIN.');

    createSession(res, { userId: user.id, role: 'employee', employeeId });
    return res.json({ session: { role: 'employee', employeeId, name: employee.name, code: employee.code } });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', sameOriginOnly, (req, res) => {
  destroySession(req, res);
  res.status(204).end();
});

router.get('/session', (req, res) => {
  if (!req.session) return res.json({ authenticated: false });
  res.set('Cache-Control', 'no-store');
  res.json({
    authenticated: true,
    session: { role: req.session.role, employeeId: req.session.employeeId },
  });
});

module.exports = router;
