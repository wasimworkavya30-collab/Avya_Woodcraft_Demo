-- Avya Woodcraft LLP — attendance & workshop operations
-- Database tier: SQLite (node:sqlite driver, no native build step required).
--
-- The browser app keeps its working set in memory and syncs it through the API.
-- The API normalises that working set into the tables below inside a transaction.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  id            INTEGER PRIMARY KEY,
  name          TEXT    NOT NULL,
  role          TEXT    NOT NULL,
  team          TEXT    NOT NULL,
  is_lead       INTEGER NOT NULL DEFAULT 0,
  hourly_rate   REAL    NOT NULL DEFAULT 0,
  code          TEXT    NOT NULL UNIQUE,
  is_active     INTEGER NOT NULL DEFAULT 1,
  photo         TEXT,
  is_manager    INTEGER NOT NULL DEFAULT 0,
  pin_hash      TEXT
);

CREATE TABLE IF NOT EXISTS blocked_devices (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  person    TEXT NOT NULL,
  device    TEXT NOT NULL,
  seen_at   TEXT NOT NULL,
  reason    TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Attendance, work log, leave, advances
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
  id            INTEGER PRIMARY KEY,
  employee_id   INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  work_date     TEXT    NOT NULL,
  in_minutes    INTEGER,
  out_minutes   INTEGER,
  hours         REAL    NOT NULL DEFAULT 0,
  day_type      TEXT    NOT NULL DEFAULT 'full',
  units         REAL,
  is_approved   INTEGER NOT NULL DEFAULT 0,
  distance_m    INTEGER,
  selfie        TEXT,
  check_in_ts   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance_records(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_attendance_date     ON attendance_records(work_date);

CREATE TABLE IF NOT EXISTS work_logs (
  id           INTEGER PRIMARY KEY,
  employee_id  INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  work_date    TEXT    NOT NULL,
  task         TEXT    NOT NULL,
  item         TEXT    NOT NULL,
  hours        REAL    NOT NULL DEFAULT 0,
  note         TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_work_emp_date ON work_logs(employee_id, work_date);

CREATE TABLE IF NOT EXISTS leave_requests (
  id           INTEGER PRIMARY KEY,
  employee_id  INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type   TEXT    NOT NULL,
  from_date    TEXT    NOT NULL,
  to_date      TEXT    NOT NULL,
  reason       TEXT    NOT NULL DEFAULT '',
  status       TEXT    NOT NULL DEFAULT 'pending'
);
CREATE INDEX IF NOT EXISTS idx_leave_emp ON leave_requests(employee_id);

CREATE TABLE IF NOT EXISTS advances (
  id           INTEGER PRIMARY KEY,
  employee_id  INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  given_on     TEXT    NOT NULL,
  amount       REAL    NOT NULL,
  note         TEXT    NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS advance_deductions (
  advance_id  INTEGER NOT NULL REFERENCES advances(id) ON DELETE CASCADE,
  month       TEXT    NOT NULL,
  amount      REAL    NOT NULL,
  PRIMARY KEY (advance_id, month)
);

-- ---------------------------------------------------------------------------
-- Costing, inventory, production
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id     INTEGER PRIMARY KEY,
  name   TEXT    NOT NULL,
  price  REAL    NOT NULL DEFAULT 0,
  image  TEXT
);

CREATE TABLE IF NOT EXISTS product_lines (
  id          INTEGER PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  kind        TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  qty         REAL    NOT NULL DEFAULT 0,
  unit        TEXT    NOT NULL DEFAULT 'pcs',
  rate        REAL    NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_lines_product ON product_lines(product_id);

CREATE TABLE IF NOT EXISTS inventory_items (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL,
  category  TEXT    NOT NULL,
  unit      TEXT    NOT NULL DEFAULT 'pcs',
  qty       REAL    NOT NULL DEFAULT 0,
  min_qty   REAL    NOT NULL DEFAULT 0,
  rate      REAL    NOT NULL DEFAULT 0,
  code      TEXT
);

CREATE TABLE IF NOT EXISTS inventory_requests (
  id            INTEGER PRIMARY KEY,
  employee_id   INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  item          TEXT    NOT NULL,
  qty           REAL    NOT NULL,
  unit          TEXT    NOT NULL DEFAULT 'pcs',
  urgency       TEXT    NOT NULL DEFAULT 'Normal',
  note          TEXT    NOT NULL DEFAULT '',
  status        TEXT    NOT NULL DEFAULT 'pending',
  requested_on  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS production_orders (
  id          INTEGER PRIMARY KEY,
  label       TEXT    NOT NULL,
  customer    TEXT    NOT NULL DEFAULT '',
  qty         INTEGER NOT NULL DEFAULT 1,
  start_date  TEXT
);

CREATE TABLE IF NOT EXISTS order_stages (
  id          INTEGER NOT NULL,
  order_id    INTEGER NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL,
  days        REAL    NOT NULL DEFAULT 1,
  start_date  TEXT,
  done_date   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, id)
);

CREATE TABLE IF NOT EXISTS order_stage_assignments (
  order_id     INTEGER NOT NULL,
  stage_id     INTEGER NOT NULL,
  employee_id  INTEGER NOT NULL,
  PRIMARY KEY (order_id, stage_id, employee_id),
  FOREIGN KEY (order_id, stage_id) REFERENCES order_stages(order_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS production_videos (
  id           TEXT    PRIMARY KEY,
  employee_id  INTEGER,
  item         TEXT    NOT NULL,
  recorded_on  TEXT,
  kind         TEXT    NOT NULL DEFAULT 'progress',
  percent_done REAL,
  note         TEXT    NOT NULL DEFAULT '',
  size_bytes   INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER
);

-- ---------------------------------------------------------------------------
-- Petty cash
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS petty_cash_settings (
  id                 INTEGER PRIMARY KEY CHECK (id = 1),
  opening_balance    REAL NOT NULL DEFAULT 0,
  opened_on          TEXT NOT NULL,
  low_balance_alert  REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS petty_cash_entries (
  id           INTEGER PRIMARY KEY,
  entry_date   TEXT    NOT NULL,
  entry_type   TEXT    NOT NULL,
  category     TEXT    NOT NULL,
  description  TEXT    NOT NULL DEFAULT '',
  amount       REAL    NOT NULL,
  paid_to      TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_petty_date ON petty_cash_entries(entry_date);

-- ---------------------------------------------------------------------------
-- Application settings (counters, selected months, Sunday-off rules, ...)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_settings (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Authentication
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT    NOT NULL UNIQUE,
  role           TEXT    NOT NULL CHECK (role IN ('admin', 'employee')),
  employee_id    INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  password_hash  TEXT    NOT NULL,
  created_at     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token        TEXT    PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT    NOT NULL,
  employee_id  INTEGER,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version     TEXT PRIMARY KEY,
  applied_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
