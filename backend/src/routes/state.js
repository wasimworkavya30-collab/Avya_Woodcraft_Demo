'use strict';

const express = require('express');
const repository = require('../repositories/stateRepository');
const { validateChanges, validateState } = require('../lib/validate');
const { requireAuth, requireAdmin, sameOriginOnly } = require('../middleware/session');
const { ensureDatabase } = require('../db/init');
const { seedCredentials } = require('../db/seed');
const { ApiError } = require('../lib/errors');

const router = express.Router();

/** Full working state for the signed-in user. */
router.get('/bootstrap', requireAuth, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    state: repository.readState(),
    session: { role: req.session.role, employeeId: req.session.employeeId },
  });
});

/** Partial sync: the browser sends only the collections that changed. */
router.put('/state', requireAuth, sameOriginOnly, (req, res, next) => {
  try {
    const changes = req.body && req.body.changes;
    const keys = validateChanges(changes);
    repository.applyChanges(changes);
    res.json({ saved: true, collections: keys.filter((key) => key !== 'settings') });
  } catch (err) {
    next(err);
  }
});

/** Puts the approved demo dataset back (Admin → Data → Reset). */
router.post('/state/reset', requireAdmin, sameOriginOnly, (req, res, next) => {
  try {
    ensureDatabase({ force: true });
    res.json({ state: repository.readState() });
  } catch (err) {
    next(err);
  }
});

/** JSON backup download (Admin → Data → Export). */
router.get('/export', requireAdmin, (req, res) => {
  const state = repository.readState();
  res.set('Cache-Control', 'no-store');
  res.setHeader('Content-Disposition', `attachment; filename="avya-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json(state);
});

/** JSON backup restore (Admin → Data → Import). */
router.post('/import', requireAdmin, sameOriginOnly, (req, res, next) => {
  try {
    const state = req.body && req.body.state;
    validateState(state);
    repository.writeState(state);
    seedCredentials();
    res.json({ state: repository.readState() });
  } catch (err) {
    next(err);
  }
});

/** Read-only resource endpoints, handy for reports and integrations. */
const RESOURCES = {
  employees: (state) => state.emps,
  attendance: (state) => state.records,
  'work-logs': (state) => state.work,
  leaves: (state) => state.leaves,
  advances: (state) => state.advances,
  inventory: (state) => state.inv,
  'inventory-requests': (state) => state.reqs,
  products: (state) => state.products,
  orders: (state) => state.orders,
  videos: (state) => state.videos,
  'petty-cash': (state) => state.petty,
  'blocked-devices': (state) => state.blocked,
};

router.get('/resources/:resource', requireAuth, (req, res, next) => {
  try {
    const selector = RESOURCES[req.params.resource];
    if (!selector) throw ApiError.notFound(`Unknown resource "${req.params.resource}".`);
    res.set('Cache-Control', 'no-store');
    res.json({ resource: req.params.resource, data: selector(repository.readState()) });
  } catch (err) {
    next(err);
  }
});

router.get('/summary', requireAuth, (req, res) => {
  const state = repository.readState();
  res.set('Cache-Control', 'no-store');
  res.json({
    employees: state.emps.length,
    activeEmployees: state.emps.filter((employee) => employee.active).length,
    attendanceRecords: state.records.length,
    pendingApprovals: state.records.filter((record) => record.outMin != null && !record.approved).length,
    workLogEntries: state.work.length,
    leaveRequests: state.leaves.length,
    productionItems: state.orders.length,
    inventoryItems: state.inv.length,
  });
});

module.exports = router;
