'use strict';

const crypto = require('crypto');

/**
 * Password / PIN hashing with scrypt from the Node standard library,
 * so the database never stores a plain secret.
 * Format: scrypt$<salt-hex>$<hash-hex>
 */
function hashSecret(secret) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(secret), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifySecret(secret, stored) {
  if (!stored) return false;
  const parts = String(stored).split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, hash] = parts;
  const known = Buffer.from(hash, 'hex');
  const candidate = crypto.scryptSync(String(secret), salt, known.length || 64);
  if (candidate.length !== known.length) return false;
  return crypto.timingSafeEqual(candidate, known);
}

module.exports = { hashSecret, verifySecret };
