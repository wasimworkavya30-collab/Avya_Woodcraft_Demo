'use strict';

const { ApiError } = require('./errors');
const repository = require('../repositories/stateRepository');

const LIMITS = {
  employees: 500,
  records: 50000,
  work: 200000,
  leaves: 20000,
  blocked: 5000,
  advances: 5000,
  inv: 5000,
  reqs: 20000,
  products: 500,
  orders: 5000,
  videos: 5000,
};

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw ApiError.unprocessable(`${label} must be an object.`);
  }
}

function assertArray(value, label, max) {
  if (!Array.isArray(value)) throw ApiError.unprocessable(`${label} must be a list.`);
  if (value.length > max) throw ApiError.unprocessable(`${label} has too many items (limit ${max}).`);
}

function assertRecord(item, label) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw ApiError.unprocessable(`${label} must contain objects.`);
  }
}

/** Validates the payload of PUT /api/state before it touches SQLite. */
function validateChanges(changes) {
  assertObject(changes, 'changes');
  const keys = Object.keys(changes);
  if (keys.length === 0) throw ApiError.badRequest('No changes were sent.', 'empty_changes');

  for (const key of keys) {
    if (key === 'settings') {
      assertObject(changes.settings, 'settings');
      continue;
    }
    if (!repository.COLLECTIONS.includes(key)) {
      throw ApiError.badRequest(`Unknown collection "${key}".`, 'unknown_collection');
    }
    if (key === 'petty') {
      assertObject(changes.petty, 'petty');
      if (changes.petty.entries !== undefined) assertArray(changes.petty.entries, 'petty.entries', 20000);
      continue;
    }
    if (key === 'emps') {
      assertArray(changes.emps, 'emps', LIMITS.employees);
      changes.emps.forEach((employee) => {
        assertRecord(employee, 'emps');
        if (!employee.name || !employee.code) {
          throw ApiError.unprocessable('Every employee needs a name and a staff code.');
        }
        if (!Number.isFinite(Number(employee.id))) {
          throw ApiError.unprocessable('Every employee needs a numeric id.');
        }
      });
      continue;
    }
    assertArray(changes[key], key, LIMITS[key] || 50000);
  }
  return keys;
}

/** Validates a full state document (import / reset). */
function validateState(state) {
  assertObject(state, 'state');
  if (!Array.isArray(state.emps) || !Array.isArray(state.records)) {
    throw ApiError.unprocessable('A full state needs employees and attendance records.');
  }
  assertArray(state.emps, 'emps', LIMITS.employees);
  assertArray(state.records, 'records', LIMITS.records);
  return true;
}

module.exports = { validateChanges, validateState, LIMITS };
