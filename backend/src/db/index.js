'use strict';

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const config = require('../config');

let db = null;

/** Opens (once) and returns the SQLite handle for the database tier. */
function getDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  db = new DatabaseSync(config.dbPath);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');
  return db;
}

function closeDb() {
  if (!db) return;
  try {
    db.close();
  } catch (err) {
    // closing an already-closed handle is not an error worth surfacing
  }
  db = null;
}

/** Runs `fn` inside a single write transaction. */
function transaction(fn) {
  const handle = getDb();
  handle.exec('BEGIN IMMEDIATE');
  try {
    const result = fn(handle);
    handle.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      handle.exec('ROLLBACK');
    } catch (rollbackErr) {
      // ignore: the original error is the useful one
    }
    throw err;
  }
}

module.exports = { getDb, closeDb, transaction };
