# Architecture

## Goals

1. Ship the **same interface** the client approved — same markup, styles,
   copy, interactions and demo helpers.
2. Give it a **real three-tier architecture**: presentation, application,
   data.
3. Keep the change surface small and reviewable.

## Tiers

```
┌───────────────────────────────┐
│ Presentation tier             │  frontend/
│ Static SPA (HTML/CSS/JS)      │  index.html, assets/css/app.css, assets/js/*
│ No build step                 │
└───────────────┬───────────────┘
                │ JSON over fetch, same-origin cookies
┌───────────────▼───────────────┐
│ Application tier              │  backend/
│ Express 5 REST API            │  routes → repositories → db
│ Sessions, validation, CSP     │
└───────────────┬───────────────┘
                │ parameterised SQL, transactions
┌───────────────▼───────────────┐
│ Data tier                     │  database/
│ SQLite (WAL)                  │  schema.sql, seed/demo-state.json
└───────────────────────────────┘
```

The frontend is served by the same Node process, so the browser talks to the
API on the same origin: no CORS, and `HttpOnly; SameSite=Lax` cookies can carry
the session without any token handling in JavaScript.

## Why the sync endpoint looks like this

The approved app is a synchronous SPA: it mutates an in-memory object `S` and
re-renders. Rewriting every handler to call granular REST endpoints would have
touched hundreds of lines and risked changing behaviour the client signed off.

Instead:

- `GET /api/bootstrap` returns the whole working state in the exact shape the UI
  renders (assembled from normalised tables, not a JSON blob).
- `PUT /api/state` accepts a **partial** payload: only collections that changed.
- `frontend/assets/js/api.js` diffs `S` per collection, debounces 400 ms,
  coalesces bursts, retries on failure, and asks for re-login on `401`.

The database stays normalised; the API stays RESTful; the UI logic stays byte-for-byte
the approved version apart from the storage hooks.

## Request lifecycle

1. `securityHeaders` sets CSP and hardening headers.
2. `requestLogger` assigns a request id and logs method/status/duration.
3. `express.json` parses up to 32 MB (selfies and photos are data URLs).
4. `attachSession` resolves the opaque cookie against `sessions`.
5. Route guards: `requireAuth`, `requireAdmin`, `sameOriginOnly`.
6. `validateChanges` / `validateState` reject malformed payloads before writes.
7. Repository writes inside `BEGIN IMMEDIATE … COMMIT`; rollback on error.
8. `errorHandler` returns `{ error: { message, code }, requestId }`.

## Database design

- Integer primary keys mirror the ids used by the UI, so no id remapping is
  needed on sync.
- Child rows use `ON DELETE CASCADE` where the parent fully owns them (product
  lines, order stages, advance deductions, petty-cash entries).
- Employees are **upserted** rather than deleted on edit, so credentials and
  attendance history survive routine changes.
- `app_settings` stores counters and preferences (`nextId`, `month`,
  `sunWeeks`, `sun`, …) as JSON values, because they are small scalars that the
  approved UI reads and writes freely.
- Indexes cover the report queries: attendance by employee+date, work logs by
  employee+date, petty cash by date.

## Security posture

- No secrets in the browser. Sessions are opaque 256-bit tokens; PINs and the
  seeded admin password are scrypt hashes.
- Writes are blocked when the `Origin` header does not match the host.
- CSP allows only same-origin scripts, the Google Fonts stylesheet, and
  `data:`/`blob:` images and media (generated avatars, selfies, video previews).
- Errors never leak SQL or stack traces to clients.

## Known demo-scope decisions

| Area | Decision | Reason |
| --- | --- | --- |
| Admin login | Any non-empty email/password | Approved screen has prefilled demo credentials and no user management |
| Employee PIN | Server-verified `1234` (configurable) | Matches the approved copy, but now checked on the server |
| Video files | IndexedDB in the browser | Approved limitation; 300 MB clips do not belong in JSON sync |
| Teams | Fixed list in the frontend | Approved screen treats team ids/colours as constants |
| "Stored in this browser" copy in Admin → Data | Left as approved | Requested zero UI changes; documented in README |

## Scaling path

`backend/src/repositories/stateRepository.js` is the only module with SQL. To
move to PostgreSQL or MySQL, reimplement its four entry points
(`readState`, `writeState`, `applyChanges`, `listPublicEmployees`) and keep the
API contract identical. Session storage follows the same pattern.
