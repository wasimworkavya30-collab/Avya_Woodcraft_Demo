'use strict';

/**
 * Database bootstrap used both by the server (first start) and by
 * `npm run db:init` / `npm run db:reset`.
 */
const { migrate } = require('./migrate');
const { seed } = require('./seed');
const { getDb, closeDb } = require('./index');
const repository = require('../repositories/stateRepository');

function ensureDatabase(options = {}) {
  const force = !!options.force;
  migrate();
  const db = getDb();
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM employees').get();
  const isEmpty = !count;
  if (force || isEmpty) {
    seed();
    return { seeded: true, employees: repository.readState().emps.length };
  }
  return { seeded: false, employees: count };
}

module.exports = { ensureDatabase };

if (require.main === module) {
  const force = process.argv.includes('--force');
  const result = ensureDatabase({ force });
  const state = repository.readState();
  console.log(
    `${result.seeded ? 'Seeded' : 'Ready'} database — ` +
      `${state.emps.length} employees, ${state.records.length} attendance records, ` +
      `${state.work.length} work log entries, ${state.orders.length} production items.`,
  );
  closeDb();
}
