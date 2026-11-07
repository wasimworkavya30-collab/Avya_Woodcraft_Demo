'use strict';

/**
 * Persistence layer between the API and the normalised SQLite schema.
 *
 * The browser keeps the approved single-page app's working state in memory and
 * pushes changed collections through PUT /api/state. This module maps those
 * collection names onto tables, and reads them back into the exact shape the
 * frontend renders.
 */
const { getDb, transaction } = require('../db/index');

const COLLECTIONS = [
  'emps',
  'records',
  'work',
  'leaves',
  'blocked',
  'advances',
  'inv',
  'reqs',
  'products',
  'orders',
  'videos',
  'petty',
];

/** Keys the browser keeps in memory only, never in the database. */
const TRANSIENT = [
  'screen',
  'role',
  'selfie',
  'cell',
  'confirmDel',
  'confirmProd',
  'confirmInv',
  'confirmOrder',
  'confirmData',
  'pairing',
  'addOpen',
  'photoTarget',
  'orderOpen',
  'q',
  'tf',
  'liveEdit',
  'vfilter',
  'pcEdit',
  'confirmPc',
];

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const toText = (value) => (value === null || value === undefined ? '' : String(value));
const toFlag = (value) => (value ? 1 : 0);
const sortById = (list) => list.slice().sort((a, b) => a - b);

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------

function replaceEmployees(db, list) {
  // Employees are upserted (not deleted) so credentials and child rows survive
  // an ordinary edit. Rows removed from the list are deleted at the end.
  const upsert = db.prepare(`
    INSERT INTO employees (id, name, role, team, is_lead, hourly_rate, code, is_active, photo, is_manager)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      role = excluded.role,
      team = excluded.team,
      is_lead = excluded.is_lead,
      hourly_rate = excluded.hourly_rate,
      code = excluded.code,
      is_active = excluded.is_active,
      photo = excluded.photo,
      is_manager = excluded.is_manager
  `);

  const ids = [];
  for (const employee of list) {
    const id = toNumber(employee.id);
    ids.push(id);
    upsert.run(
      id,
      toText(employee.name),
      toText(employee.role),
      toText(employee.team || 'carp'),
      toFlag(employee.lead),
      toNumber(employee.rate),
      toText(employee.code),
      employee.active === false ? 0 : 1,
      employee.photo === null || employee.photo === undefined ? null : String(employee.photo),
      toFlag(employee.mgr),
    );
  }

  if (ids.length === 0) {
    db.prepare('DELETE FROM employees').run();
    return;
  }
  const placeholders = sortById(ids).map(() => '?').join(',');
  db.prepare(`DELETE FROM employees WHERE id NOT IN (${placeholders})`).run(...sortById(ids));
}

function replaceRecords(db, list) {
  db.prepare('DELETE FROM attendance_records').run();
  const insert = db.prepare(`
    INSERT INTO attendance_records
      (id, employee_id, work_date, in_minutes, out_minutes, hours, day_type, units, is_approved, distance_m, selfie, check_in_ts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const record of list) {
    insert.run(
      toNumber(record.id),
      toNumber(record.emp),
      toText(record.date),
      toNumberOrNull(record.inMin),
      toNumberOrNull(record.outMin),
      toNumber(record.hours),
      toText(record.dt || 'full'),
      toNumberOrNull(record.units),
      toFlag(record.approved),
      toNumberOrNull(record.dist),
      record.selfie === null || record.selfie === undefined ? null : String(record.selfie),
      toNumberOrNull(record.inTs),
    );
  }
}

function replaceWorkLogs(db, list) {
  db.prepare('DELETE FROM work_logs').run();
  const insert = db.prepare('INSERT INTO work_logs (id, employee_id, work_date, task, item, hours, note) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const entry of list) {
    insert.run(
      toNumber(entry.id),
      toNumber(entry.emp),
      toText(entry.date),
      toText(entry.task),
      toText(entry.item),
      toNumber(entry.hours),
      toText(entry.note),
    );
  }
}

function replaceLeaves(db, list) {
  db.prepare('DELETE FROM leave_requests').run();
  const insert = db.prepare('INSERT INTO leave_requests (id, employee_id, leave_type, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const leave of list) {
    insert.run(
      toNumber(leave.id),
      toNumber(leave.emp),
      toText(leave.type),
      toText(leave.from),
      toText(leave.to),
      toText(leave.reason),
      toText(leave.status || 'pending'),
    );
  }
}

function replaceBlockedDevices(db, list) {
  db.prepare('DELETE FROM blocked_devices').run();
  const insert = db.prepare('INSERT INTO blocked_devices (person, device, seen_at, reason) VALUES (?, ?, ?, ?)');
  for (const entry of list) {
    insert.run(toText(entry.who), toText(entry.dev), toText(entry.when), toText(entry.why));
  }
}

function replaceAdvances(db, list) {
  db.prepare('DELETE FROM advances').run(); // cascades advance_deductions
  const insert = db.prepare('INSERT INTO advances (id, employee_id, given_on, amount, note) VALUES (?, ?, ?, ?, ?)');
  const insertDeduction = db.prepare('INSERT INTO advance_deductions (advance_id, month, amount) VALUES (?, ?, ?)');
  for (const advance of list) {
    const id = toNumber(advance.id);
    insert.run(id, toNumber(advance.emp), toText(advance.date), toNumber(advance.amt), toText(advance.note));
    const deductions = advance.ded && typeof advance.ded === 'object' ? advance.ded : {};
    for (const month of Object.keys(deductions)) {
      insertDeduction.run(id, month, toNumber(deductions[month]));
    }
  }
}

function replaceInventory(db, list) {
  db.prepare('DELETE FROM inventory_items').run();
  const insert = db.prepare('INSERT INTO inventory_items (id, name, category, unit, qty, min_qty, rate, code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const item of list) {
    insert.run(
      toNumber(item.id),
      toText(item.name),
      toText(item.cat),
      toText(item.unit || 'pcs'),
      toNumber(item.qty),
      toNumber(item.min),
      toNumber(item.rate),
      item.code === undefined || item.code === null ? null : toText(item.code),
    );
  }
}

function replaceRequests(db, list) {
  db.prepare('DELETE FROM inventory_requests').run();
  const insert = db.prepare(`
    INSERT INTO inventory_requests (id, employee_id, item, qty, unit, urgency, note, status, requested_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const request of list) {
    insert.run(
      toNumber(request.id),
      request.emp ? toNumber(request.emp) : null,
      toText(request.item),
      toNumber(request.qty),
      toText(request.unit || 'pcs'),
      toText(request.urg || 'Normal'),
      toText(request.note),
      toText(request.status || 'pending'),
      toText(request.date),
    );
  }
}

function replaceProducts(db, list) {
  db.prepare('DELETE FROM products').run(); // cascades product_lines
  const insertProduct = db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
  const insertLine = db.prepare('INSERT INTO product_lines (id, product_id, kind, name, qty, unit, rate, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const product of list) {
    const id = toNumber(product.id);
    insertProduct.run(id, toText(product.name), toNumber(product.price), product.img ? String(product.img) : null);
    const lines = Array.isArray(product.lines) ? product.lines : [];
    lines.forEach((line, index) => {
      insertLine.run(
        toNumber(line.id),
        id,
        toText(line.kind || 'material'),
        toText(line.name),
        toNumber(line.qty),
        toText(line.unit || 'pcs'),
        toNumber(line.rate),
        index,
      );
    });
  }
}

function replaceOrders(db, list) {
  db.prepare('DELETE FROM production_orders').run(); // cascades stages + assignments
  const insertOrder = db.prepare('INSERT INTO production_orders (id, label, customer, qty, start_date) VALUES (?, ?, ?, ?, ?)');
  const insertStage = db.prepare(`
    INSERT INTO order_stages (id, order_id, name, days, start_date, done_date, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertAssignment = db.prepare('INSERT INTO order_stage_assignments (order_id, stage_id, employee_id) VALUES (?, ?, ?)');
  for (const order of list) {
    const orderId = toNumber(order.id);
    insertOrder.run(orderId, toText(order.label), toText(order.customer), toNumber(order.qty), order.start ? toText(order.start) : null);
    const stages = Array.isArray(order.stages) ? order.stages : [];
    stages.forEach((stage, index) => {
      const stageId = toNumber(stage.id);
      insertStage.run(
        stageId,
        orderId,
        toText(stage.name),
        toNumber(stage.days) || 1,
        stage.start ? toText(stage.start) : null,
        stage.done ? toText(stage.done) : null,
        index,
      );
      const assigned = Array.isArray(stage.assigned) ? stage.assigned : [];
      for (const employeeId of assigned) {
        const id = toNumber(employeeId);
        if (id > 0) insertAssignment.run(orderId, stageId, id);
      }
    });
  }
}

function replaceVideos(db, list) {
  db.prepare('DELETE FROM production_videos').run();
  const insert = db.prepare(`
    INSERT INTO production_videos (id, employee_id, item, recorded_on, kind, percent_done, note, size_bytes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const video of list) {
    insert.run(
      String(video.id),
      video.emp ? toNumber(video.emp) : null,
      toText(video.item),
      video.date ? toText(video.date) : null,
      toText(video.kind || 'progress'),
      video.pct === null || video.pct === undefined ? null : toNumber(video.pct),
      toText(video.note),
      toNumber(video.size),
      video.t === null || video.t === undefined ? null : toNumber(video.t),
    );
  }
}

function replacePettyCash(db, petty) {
  const source = petty && typeof petty === 'object' ? petty : {};
  db.prepare('DELETE FROM petty_cash_entries').run();
  db.prepare('DELETE FROM petty_cash_settings').run();
  db.prepare('INSERT INTO petty_cash_settings (id, opening_balance, opened_on, low_balance_alert) VALUES (1, ?, ?, ?)').run(
    toNumber(source.opening),
    toText(source.openDate),
    toNumber(source.low),
  );
  const insert = db.prepare('INSERT INTO petty_cash_entries (id, entry_date, entry_type, category, description, amount, paid_to) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const entry of Array.isArray(source.entries) ? source.entries : []) {
    insert.run(
      toNumber(entry.id),
      toText(entry.date),
      toText(entry.type),
      toText(entry.cat),
      toText(entry.desc),
      toNumber(entry.amt),
      toText(entry.to),
    );
  }
}

function replaceSettings(db, settings) {
  db.prepare('DELETE FROM app_settings').run();
  const insert = db.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?)');
  for (const key of Object.keys(settings || {})) {
    insert.run(key, JSON.stringify(settings[key]));
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const WRITERS = {
  emps: replaceEmployees,
  records: replaceRecords,
  work: replaceWorkLogs,
  leaves: replaceLeaves,
  blocked: replaceBlockedDevices,
  advances: replaceAdvances,
  inv: replaceInventory,
  reqs: replaceRequests,
  products: replaceProducts,
  orders: replaceOrders,
  videos: replaceVideos,
  petty: replacePettyCash,
};

/** Splits a full frontend state object into collections + settings. */
function splitState(state) {
  const collections = {};
  const settings = {};
  for (const key of Object.keys(state || {})) {
    if (TRANSIENT.includes(key)) continue;
    if (COLLECTIONS.includes(key)) collections[key] = state[key];
    else settings[key] = state[key];
  }
  return { collections, settings };
}

function clearAll(db) {
  db.exec(`
    DELETE FROM order_stage_assignments;
    DELETE FROM order_stages;
    DELETE FROM production_orders;
    DELETE FROM product_lines;
    DELETE FROM products;
    DELETE FROM advance_deductions;
    DELETE FROM advances;
    DELETE FROM attendance_records;
    DELETE FROM work_logs;
    DELETE FROM leave_requests;
    DELETE FROM inventory_requests;
    DELETE FROM inventory_items;
    DELETE FROM production_videos;
    DELETE FROM blocked_devices;
    DELETE FROM petty_cash_entries;
    DELETE FROM petty_cash_settings;
    DELETE FROM app_settings;
    DELETE FROM employees;
  `);
}

/** Replaces the whole database with the given frontend state. */
function writeState(state) {
  const { collections, settings } = splitState(state);
  transaction((db) => {
    clearAll(db);
    replaceEmployees(db, collections.emps || []);
    replaceRecords(db, collections.records || []);
    replaceWorkLogs(db, collections.work || []);
    replaceLeaves(db, collections.leaves || []);
    replaceBlockedDevices(db, collections.blocked || []);
    replaceAdvances(db, collections.advances || []);
    replaceInventory(db, collections.inv || []);
    replaceRequests(db, collections.reqs || []);
    replaceProducts(db, collections.products || []);
    replaceOrders(db, collections.orders || []);
    replaceVideos(db, collections.videos || []);
    replacePettyCash(db, collections.petty || {});
    replaceSettings(db, settings);
  });
}

/**
 * Applies a partial sync: only the collections present in `changes` are
 * rewritten, and settings are replaced when provided.
 */
function applyChanges(changes) {
  const keys = Object.keys(changes || {}).filter((key) => key !== 'settings');
  for (const key of keys) {
    if (!COLLECTIONS.includes(key)) {
      throw new Error(`Unknown collection: ${key}`);
    }
  }
  transaction((db) => {
    for (const key of keys) {
      WRITERS[key](db, changes[key]);
    }
    if (changes && Object.prototype.hasOwnProperty.call(changes, 'settings')) {
      replaceSettings(db, changes.settings);
    }
  });
}

function readSettings(db) {
  const state = {};
  for (const row of db.prepare('SELECT key, value FROM app_settings').all()) {
    try {
      state[row.key] = JSON.parse(row.value);
    } catch (err) {
      state[row.key] = row.value;
    }
  }
  return state;
}

/** Reads the whole database back into the frontend state shape. */
function readState() {
  const db = getDb();
  const state = readSettings(db);

  state.emps = db
    .prepare('SELECT * FROM employees ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      team: row.team,
      lead: !!row.is_lead,
      rate: row.hourly_rate,
      code: row.code,
      active: !!row.is_active,
      photo: row.photo,
      mgr: !!row.is_manager,
    }));

  state.records = db
    .prepare('SELECT * FROM attendance_records ORDER BY id')
    .all()
    .map((row) => {
      const record = {
        id: row.id,
        emp: row.employee_id,
        date: row.work_date,
        inMin: row.in_minutes,
        outMin: row.out_minutes,
        hours: row.hours,
        dt: row.day_type,
        units: row.units,
        approved: !!row.is_approved,
        dist: row.distance_m,
        selfie: row.selfie,
      };
      if (row.check_in_ts !== null && row.check_in_ts !== undefined) record.inTs = row.check_in_ts;
      return record;
    });

  state.work = db
    .prepare('SELECT * FROM work_logs ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      emp: row.employee_id,
      date: row.work_date,
      task: row.task,
      item: row.item,
      hours: row.hours,
      note: row.note,
    }));

  state.leaves = db
    .prepare('SELECT * FROM leave_requests ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      emp: row.employee_id,
      type: row.leave_type,
      from: row.from_date,
      to: row.to_date,
      reason: row.reason,
      status: row.status,
    }));

  state.blocked = db
    .prepare('SELECT * FROM blocked_devices ORDER BY id DESC')
    .all()
    .map((row) => ({ who: row.person, dev: row.device, when: row.seen_at, why: row.reason }));

  const deductions = {};
  for (const row of db.prepare('SELECT * FROM advance_deductions').all()) {
    if (!deductions[row.advance_id]) deductions[row.advance_id] = {};
    deductions[row.advance_id][row.month] = row.amount;
  }
  state.advances = db
    .prepare('SELECT * FROM advances ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      emp: row.employee_id,
      date: row.given_on,
      amt: row.amount,
      note: row.note,
      ded: deductions[row.id] || {},
    }));

  state.inv = db
    .prepare('SELECT * FROM inventory_items ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      name: row.name,
      cat: row.category,
      unit: row.unit,
      qty: row.qty,
      min: row.min_qty,
      rate: row.rate,
      code: row.code,
    }));

  state.reqs = db
    .prepare('SELECT * FROM inventory_requests ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      emp: row.employee_id,
      item: row.item,
      qty: row.qty,
      unit: row.unit,
      urg: row.urgency,
      note: row.note,
      status: row.status,
      date: row.requested_on,
    }));

  const linesByProduct = {};
  for (const row of db.prepare('SELECT * FROM product_lines ORDER BY sort_order, id').all()) {
    if (!linesByProduct[row.product_id]) linesByProduct[row.product_id] = [];
    linesByProduct[row.product_id].push({
      id: row.id,
      kind: row.kind,
      name: row.name,
      qty: row.qty,
      unit: row.unit,
      rate: row.rate,
    });
  }
  state.products = db
    .prepare('SELECT * FROM products ORDER BY id')
    .all()
    .map((row) => {
      const product = { id: row.id, name: row.name, price: row.price, lines: linesByProduct[row.id] || [] };
      if (row.image) product.img = row.image;
      return product;
    });

  const assignments = {};
  for (const row of db.prepare('SELECT * FROM order_stage_assignments').all()) {
    const key = `${row.order_id}:${row.stage_id}`;
    if (!assignments[key]) assignments[key] = [];
    assignments[key].push(row.employee_id);
  }
  const stagesByOrder = {};
  for (const row of db.prepare('SELECT * FROM order_stages ORDER BY order_id, sort_order, id').all()) {
    const key = `${row.order_id}:${row.id}`;
    if (!stagesByOrder[row.order_id]) stagesByOrder[row.order_id] = [];
    stagesByOrder[row.order_id].push({
      id: row.id,
      name: row.name,
      days: row.days,
      start: row.start_date,
      done: row.done_date,
      assigned: assignments[key] || [],
    });
  }
  state.orders = db
    .prepare('SELECT * FROM production_orders ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      label: row.label,
      customer: row.customer,
      qty: row.qty,
      start: row.start_date,
      stages: stagesByOrder[row.id] || [],
    }));

  state.videos = db
    .prepare('SELECT * FROM production_videos ORDER BY created_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      item: row.item,
      kind: row.kind,
      pct: row.percent_done,
      note: row.note,
      emp: row.employee_id,
      date: row.recorded_on,
      t: row.created_at,
      size: row.size_bytes,
    }));

  const pettySettings = db.prepare('SELECT * FROM petty_cash_settings WHERE id = 1').get();
  state.petty = {
    opening: pettySettings ? pettySettings.opening_balance : 0,
    openDate: pettySettings ? pettySettings.opened_on : '',
    low: pettySettings ? pettySettings.low_balance_alert : 0,
    entries: db
      .prepare('SELECT * FROM petty_cash_entries ORDER BY entry_date, id')
      .all()
      .map((row) => ({
        id: row.id,
        date: row.entry_date,
        type: row.entry_type,
        cat: row.category,
        desc: row.description,
        amt: row.amount,
        to: row.paid_to,
      })),
  };

  return state;
}

/** Lightweight employee list for the sign-in screen (no pay rates). */
function listPublicEmployees() {
  return getDb()
    .prepare('SELECT id, name, code, role, team, is_active FROM employees WHERE is_active = 1 ORDER BY id')
    .all()
    .map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      role: row.role,
      team: row.team,
      isActive: !!row.is_active,
    }));
}

module.exports = {
  COLLECTIONS,
  TRANSIENT,
  readState,
  writeState,
  applyChanges,
  splitState,
  listPublicEmployees,
};
