'use strict';

/**
 * API integration tests (Node's built-in test runner).
 * They run against a temporary SQLite file seeded with the approved demo data.
 */
process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = 'database/data/test-avya.sqlite';

const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const config = require('../src/config');
const { ensureDatabase } = require('../src/db/init');
const { createApp } = require('../src/app');
const { closeDb } = require('../src/db/index');

let server;
let baseUrl;
let employeeCookie = '';

function url(pathname) {
  return `${baseUrl}${pathname}`;
}

async function api(pathname, options = {}) {
  const headers = Object.assign({ Accept: 'application/json' }, options.headers || {});
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.cookie) headers.Cookie = options.cookie;
  return fetch(url(pathname), {
    method: options.method || 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

test.before(async () => {
  ensureDatabase({ force: true });
  server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  closeDb();
  for (const suffix of ['', '-wal', '-shm']) {
    const file = config.dbPath + suffix;
    if (fs.existsSync(file)) fs.rmSync(file, { force: true });
  }
});

test('health endpoint reports the database connection', async () => {
  const res = await api('/api/health');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.database, 'ok');
});

test('state endpoints require a session', async () => {
  const res = await api('/api/bootstrap');
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.error.code, 'unauthenticated');
});

test('login screen can list active employees without a session', async () => {
  const res = await api('/api/public/employees');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.employees.length, 16);
  assert.equal(body.employees[0].code, 'AW-101');
  assert.equal(body.employees[0].rate, undefined);
});

test('wrong PIN is rejected', async () => {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: { role: 'employee', employeeId: 1, pin: '9999' },
  });
  assert.equal(res.status, 401);
});

test('employee sign-in returns a session cookie', async () => {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: { role: 'employee', employeeId: 1, pin: '1234' },
  });
  assert.equal(res.status, 200);
  const cookies = res.headers.getSetCookie();
  assert.equal(cookies.length, 1);
  assert.match(cookies[0], /^avya_sid=/);
  assert.match(cookies[0], /HttpOnly/);
  employeeCookie = cookies[0].split(';')[0];
});

test('bootstrap returns the seeded three-tier state', async () => {
  const res = await api('/api/bootstrap', { cookie: employeeCookie });
  assert.equal(res.status, 200);
  const { state } = await res.json();
  assert.equal(state.emps.length, 16);
  assert.equal(state.records.length, 526);
  assert.equal(state.work.length, 1046);
  assert.equal(state.orders.length, 5);
  assert.equal(state.products.length, 3);
  assert.equal(state.inv.length, 12);
  assert.equal(state.petty.entries.length, 13);
  assert.equal(state.nextId, 528);
  assert.deepEqual(state.emps[0].lead, true);
});

test('partial sync writes one collection and is read back', async () => {
  const boot = await api('/api/bootstrap', { cookie: employeeCookie });
  const { state } = await boot.json();
  const target = state.records.find((record) => record.outMin != null && !record.approved);
  assert.ok(target, 'expected a pending record in the seed data');
  target.approved = true;

  const res = await api('/api/state', {
    method: 'PUT',
    cookie: employeeCookie,
    body: { changes: { records: state.records } },
  });
  assert.equal(res.status, 200);

  const after = await api('/api/resources/attendance', { cookie: employeeCookie });
  const body = await after.json();
  const saved = body.data.find((record) => record.id === target.id);
  assert.equal(saved.approved, true);
});

test('unknown collections are rejected', async () => {
  const res = await api('/api/state', {
    method: 'PUT',
    cookie: employeeCookie,
    body: { changes: { nonsense: [] } },
  });
  assert.equal(res.status, 400);
});

test('cross-site writes are blocked', async () => {
  const res = await api('/api/state', {
    method: 'PUT',
    cookie: employeeCookie,
    headers: { Origin: 'https://evil.example' },
    body: { changes: { videos: [] } },
  });
  assert.equal(res.status, 403);
});

test('admin-only endpoints reject employee sessions', async () => {
  const res = await api('/api/export', { cookie: employeeCookie });
  assert.equal(res.status, 403);
});

test('admin sign-in can export and reset the dataset', async () => {
  const login = await api('/api/auth/login', {
    method: 'POST',
    body: { role: 'admin', email: 'admin@avyawoodcraft.in', password: 'demo-password' },
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.getSetCookie()[0].split(';')[0];

  const exported = await api('/api/export', { cookie });
  assert.equal(exported.status, 200);
  const backup = await exported.json();
  assert.equal(backup.emps.length, 16);

  const reset = await api('/api/state/reset', { method: 'POST', cookie });
  assert.equal(reset.status, 200);
  const { state } = await reset.json();
  assert.equal(state.records.filter((record) => record.approved).length > 0, true);
});

test('logout clears the session', async () => {
  const res = await api('/api/auth/logout', { method: 'POST', cookie: employeeCookie });
  assert.equal(res.status, 204);
  const cleared = res.headers.getSetCookie()[0];
  assert.match(cleared, /Max-Age=0/);

  const after = await api('/api/bootstrap', { cookie: employeeCookie });
  assert.equal(after.status, 401);
});
