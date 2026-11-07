# Reference — approved demo

`original.html` is the client-approved single-file demo
(`Avya-Woodcraft-LLP-Attendance-Demo_v3.html`, 267,037 bytes, SHA-256
`14a94d32d961773e4e48502a4f491ce1e3ad13087097418737a08e4d95acbfd9`).

It is kept unchanged for traceability. The three-tier app in this repository is
derived from it:

- `frontend/assets/css/app.css` — the stylesheet blocks, verbatim.
- `frontend/assets/js/app.js` — the screen logic, verbatim apart from the
  storage, sign-in, sign-out and reset hooks that now call the REST API.
- `database/seed/demo-state.json` — the demo's seeded working state, exported by
  `tools/extract-demo-state.js`.

To re-extract after replacing the reference file:

```bash
node tools/extract-demo-state.js
npm run db:reset
```
