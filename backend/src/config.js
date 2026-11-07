'use strict';

/**
 * Central configuration. Values come from the environment (optionally loaded
 * from a .env file at the project root) with safe local-development defaults.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function loadEnvFile() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  try {
    process.loadEnvFile(file);
  } catch (err) {
    // A malformed .env should not stop the server; defaults are still valid.
    console.warn('[config] could not read .env:', err.message);
  }
}

loadEnvFile();

const config = {
  root: ROOT,
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3000),
  dbPath: path.resolve(ROOT, process.env.DATABASE_PATH || 'database/data/avya.sqlite'),
  schemaFile: path.join(ROOT, 'database', 'schema.sql'),
  seedFile: path.join(ROOT, 'database', 'seed', 'demo-state.json'),
  frontendDir: path.join(ROOT, 'frontend'),
  cookieName: process.env.SESSION_COOKIE || 'avya_sid',
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS || 12),
  secureCookies: String(process.env.SECURE_COOKIES || 'false') === 'true',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@avyawoodcraft.in',
  adminPassword: process.env.ADMIN_PASSWORD || 'demo-password',
  defaultPin: process.env.EMPLOYEE_DEFAULT_PIN || '1234',
};

config.isProduction = config.env === 'production';
config.isTest = config.env === 'test';

module.exports = config;
