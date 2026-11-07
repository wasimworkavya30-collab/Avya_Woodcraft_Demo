'use strict';

const express = require('express');
const authRoutes = require('./auth');
const stateRoutes = require('./state');
const publicRoutes = require('./public');
const { getDb } = require('../db/index');

const router = express.Router();

router.get('/health', (req, res) => {
  let database = 'ok';
  try {
    getDb().prepare('SELECT 1 AS ok').get();
  } catch (err) {
    database = 'unavailable';
  }
  res.status(database === 'ok' ? 200 : 503).json({
    status: database === 'ok' ? 'ok' : 'degraded',
    database,
    time: new Date().toISOString(),
  });
});

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use(stateRoutes);

module.exports = router;
