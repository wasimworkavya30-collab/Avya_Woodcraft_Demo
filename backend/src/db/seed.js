'use strict';

const fs = require('fs');
const { getDb } = require('./index');
const { hashSecret } = require('../lib/passwords');
const repository = require('../repositories/stateRepository');
const config = require('../config');

/**
 * Creates sign-in rows for the seeded admin and for every employee
 * (employee rows are keyed by staff code, e.g. AW-101).
 */
function seedCredentials() {
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO users (email, role, employee_id, password_hash)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      role = excluded.role,
      employee_id = excluded.employee_id,
      password_hash = excluded.password_hash
  `);

  upsert.run(config.adminEmail.toLowerCase(), 'admin', null, hashSecret(config.adminPassword));

  const pinHash = hashSecret(config.defaultPin);
  for (const employee of db.prepare('SELECT id, code FROM employees').all()) {
    upsert.run(`${String(employee.code).toLowerCase()}@avya.local`, 'employee', employee.id, pinHash);
  }
}

/** Replaces all tables with the approved demo dataset, then seeds credentials. */
function seed() {
  const raw = JSON.parse(fs.readFileSync(config.seedFile, 'utf8'));
  repository.writeState(raw);
  seedCredentials();
  return repository.readState();
}

module.exports = { seed, seedCredentials };
