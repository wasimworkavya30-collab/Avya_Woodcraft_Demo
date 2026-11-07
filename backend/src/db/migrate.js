'use strict';

const fs = require('fs');
const { getDb } = require('./index');
const config = require('../config');

const MIGRATION_VERSION = '001_initial';

/** Applies database/schema.sql. All statements are idempotent. */
function migrate() {
  const db = getDb();
  const sql = fs.readFileSync(config.schemaFile, 'utf8');
  db.exec(sql);
  db.prepare('INSERT OR IGNORE INTO schema_migrations (version) VALUES (?)').run(MIGRATION_VERSION);
  return MIGRATION_VERSION;
}

module.exports = { migrate, MIGRATION_VERSION };
