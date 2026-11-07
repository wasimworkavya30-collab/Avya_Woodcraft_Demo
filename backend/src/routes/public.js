'use strict';

const express = require('express');
const repository = require('../repositories/stateRepository');

const router = express.Router();

/** Employee list for the sign-in screen (no pay rates, active staff only). */
router.get('/employees', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ employees: repository.listPublicEmployees() });
});

module.exports = router;
