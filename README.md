# Avya Woodcraft LLP — Attendance & Workshop Operations

Three-tier implementation of the client-approved attendance demo: the exact same
interface, now running on a real backend and database instead of browser storage.

| Tier | Technology | Location |
| --- | --- | --- |
| Presentation (frontend) | Static SPA — HTML + CSS + vanilla JS, no build step | `frontend/` |
| Application (backend) | Node.js + Express 5 REST API, cookie sessions | `backend/` |
| Data (database) | SQLite (built-in `node:sqlite` driver) | `database/` |

```
Browser (frontend/)  ──fetch/JSON──▶  REST API (backend/)  ──SQL──▶  SQLite (database/)
   approved UI                            auth + sync               normalised schema
```

The interface, styling and screen logic are the approved single-page app,
extracted verbatim from `_source/original.html` (SHA-256
`14a94d32d961773e4e48502a4f491ce1e3ad13087097418737a08e4d95acbfd9`). Only the
storage layer changed: `localStorage` was replaced by the API, so the admin
phone, the manager and the shared company mobile all read and write the same data.

---

## Requirements

- Node.js **22.5+** (uses the built-in `node:sqlite` module — no native build step)
- npm

## Quick start

```bash
npm install
npm start
```

Open <http://127.0.0.1:3000/>.

On first start the database file is created, migrated and seeded with the
approved demo dataset (16 employees, 526 attendance records, 1,046 work-log
entries, production items, inventory, petty cash).

**Sign in**

| Role | Credentials |
| --- | --- |
| Employee | Any active employee from the list · PIN `1234` |
| Main Admin | The prefilled demo email and password (any non-empty values work — see [Authentication](#authentication-demo-scope)) |

Other commands:

| Command | Purpose |
| --- | --- |
| `npm start` | Run the app (API + frontend) |
| `npm run dev` | Run with auto-restart on file changes |
| `npm run db:init` | Create/migrate the database, seed only if empty |
| `npm run db:reset` | Re-create the database from the approved demo dataset |
| `npm test` | API integration tests (temp SQLite file, no server needed) |

---

## Project structure

```
backend/
  src/
    server.js                 HTTP entrypoint, graceful shutdown
    app.js                    Express app: security headers, static frontend, API, errors
    config.js                 Environment configuration (.env supported)
    routes/
      index.js                /api router + health check
      auth.js                 login / logout / session
      state.js                bootstrap, sync, reset, export/import, read-only resources
      public.js               employee list for the sign-in screen
    repositories/
      stateRepository.js      collection ⇄ SQLite table mapping (read + write)
    middleware/
      session.js              cookie sessions, requireAuth / requireAdmin, origin guard
      http.js                 request logging, security headers (CSP, nosniff, …)
    lib/
      passwords.js            scrypt hashing/verification
      validate.js             payload validation before writes
      errors.js               shared HTTP error type
    db/
      index.js                SQLite connection, WAL mode, transactions
      migrate.js              applies database/schema.sql
      seed.js                 loads the approved demo dataset + credentials
      init.js                 init/reset CLI
  test/
    api.test.js               12 integration tests (auth, sync, validation, reset)
database/
  schema.sql                  normalised schema (employees, attendance, payroll, …)
  seed/demo-state.json        approved demo data, exported from the client HTML
frontend/
  index.html
  assets/css/app.css          stylesheet extracted verbatim from the approved file
  assets/js/api.js            API client: auth + diffed, debounced sync
  assets/js/app.js            approved screen logic (storage hooks re-pointed to the API)
_source/
  original.html               the approved single-file demo (reference copy)
tools/
  extract-demo-state.js       regenerates database/seed/demo-state.json from the demo
docs/
  ARCHITECTURE.md             design notes, data flow, decisions
```

---

## API

All state endpoints return JSON and require a session cookie. Mutations are
same-origin only.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Liveness + database check |
| `GET` | `/api/public/employees` | — | Active staff for the sign-in list (no pay rates) |
| `POST` | `/api/auth/login` | — | `{ role: "employee", employeeId, pin }` or `{ role: "admin", email, password }` |
| `POST` | `/api/auth/logout` | — | Clears the session cookie |
| `GET` | `/api/auth/session` | — | Current session, if any |
| `GET` | `/api/bootstrap` | session | Full working state in the exact shape the UI renders |
| `PUT` | `/api/state` | session | `{ changes: { records: [...], settings: {...} } }` — only changed collections |
| `POST` | `/api/state/reset` | admin | Restores the approved demo dataset |
| `GET` | `/api/export` | admin | JSON backup download |
| `POST` | `/api/import` | admin | `{ state: {...} }` — replaces everything |
| `GET` | `/api/resources/:resource` | session | Read-only lists (`employees`, `attendance`, `work-logs`, `leaves`, `advances`, `inventory`, `inventory-requests`, `products`, `orders`, `videos`, `petty-cash`, `blocked-devices`) |
| `GET` | `/api/summary` | session | Counts used by dashboards |

### How syncing works

The approved app keeps its working state in memory (`S`) and calls `persist()`
after every render. `frontend/assets/js/api.js` keeps that contract:

1. `persist()` snapshots the state, skips screen-only keys, and diffs each
   collection against the last synced JSON.
2. Only changed collections are sent, coalesced into one `PUT /api/state` per
   burst of edits (400 ms debounce).
3. The backend writes those collections in a single SQLite transaction.
4. Failed saves retry automatically; a `401` asks the user to sign in again.

This keeps the UI logic untouched while giving every device the same data.

---

## Data model

`database/schema.sql` normalises the demo state into:

- `employees`, `blocked_devices`
- `attendance_records`, `work_logs`, `leave_requests`, `advances`, `advance_deductions`
- `products`, `product_lines`, `inventory_items`, `inventory_requests`
- `production_orders`, `order_stages`, `order_stage_assignments`, `production_videos`
- `petty_cash_settings`, `petty_cash_entries`
- `app_settings` (counters, selected months, Sunday-off rules)
- `users`, `sessions`, `schema_migrations`

Production video **files** stay in the browser's IndexedDB (up to 300 MB each),
exactly as approved — only their metadata is stored in the database. That is
deliberate: a 300 MB clip does not belong in a JSON sync payload.

Regenerating the seed data after a change to the reference demo:

```bash
node tools/extract-demo-state.js
npm run db:reset
```

---

## Authentication (demo scope)

- **Employees** sign in with their staff code/PIN. The PIN is verified
  server-side against a scrypt hash (`EMPLOYEE_DEFAULT_PIN`, default `1234`).
  New employees added in the UI get the same default PIN on first sign-in.
- **Admin** sign-in is demo-scoped: the approved screen ships with prefilled
  demo credentials and no user-management UI, so any non-empty email + password
  opens an admin session. The seeded admin row still stores a scrypt hash in
  `users.password_hash`, ready for real verification once a credential screen
  is added.
- Sessions are opaque random tokens in the `sessions` table, delivered as
  `HttpOnly; SameSite=Lax` cookies and expired after `SESSION_TTL_HOURS`.
- GPG-style extras: same-origin check on every write, CSP, `nosniff`,
  frame-ancestors, and no secrets in the browser.

Set `SECURE_COOKIES=true` when serving over HTTPS.

---

## Configuration

Copy `.env.example` to `.env` to override defaults:

| Variable | Default | Meaning |
| --- | --- | --- |
| `HOST` / `PORT` | `127.0.0.1` / `3000` | Bind address |
| `DATABASE_PATH` | `database/data/avya.sqlite` | SQLite file |
| `SESSION_TTL_HOURS` | `12` | Session lifetime |
| `SECURE_COOKIES` | `false` | Set true behind HTTPS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | demo values | Seeded admin credentials |
| `EMPLOYEE_DEFAULT_PIN` | `1234` | PIN assigned to employees |

`.env` is git-ignored; `.env.example` documents the names only.

---

## Deployment

The app is a single Node process that serves both the API and the static
frontend, so any Node 22.5+ host works (VM, container, Render, Railway, Fly.io).

1. `npm ci --omit=dev`
2. Set the environment variables above.
3. `npm start` behind a reverse proxy that terminates TLS.
4. Back up `database/data/avya.sqlite` (plus `-wal`/`-shm`) or use
   Admin → Data → Export.

For horizontal scaling, replace SQLite with a client/server database — the
repository in `backend/src/repositories/stateRepository.js` is the only file
that speaks SQL.

---

## Tests

```bash
npm test
```

Covers: health, unauthenticated access, public employee list, wrong PIN, session
cookie flags, seeded counts, partial sync round-trip, unknown-collection
rejection, cross-site write blocking, admin-only guards, export + reset, logout.

---

## Notes on fidelity

- `frontend/assets/css/app.css` and the screen logic in
  `frontend/assets/js/app.js` are the approved markup/styles/behaviour; the only
  edits are the storage, sign-in, sign-out and reset hooks that now call the API.
- One approved copy line in **Admin → Data** still says data is stored in "this
  browser on this device" (it described the old demo). It was left untouched to
  keep the approved screens identical; say the word and it can be updated to
  describe the shared database.
- Demo helpers (phone/location switches, "move clock forward") are kept as-is;
  they exercise the same UI states as the approved file.
