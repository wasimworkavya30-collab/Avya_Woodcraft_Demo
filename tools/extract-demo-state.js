/**
 * Extracts the demo's in-browser state (`S`) from the approved single-file HTML,
 * so the database seed can be generated from the exact data the client approved.
 *
 * Usage: node tools/extract-demo-state.js
 * Output: database/seed/demo-state.json
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '_source', 'original.html'), 'utf8');
const lines = html.split('\n');

const start = lines.findIndex((l) => l.trim() === '<script>');
const end = lines.findIndex((l, i) => i > start && l.trim() === '</script>');
if (start < 0 || end < 0) throw new Error('script block not found');

let js = lines.slice(start + 1, end).join('\n');
// expose the closure state right before the IIFE closes
const tail = /\}\)\(\);\s*$/;
if (!tail.test(js)) throw new Error('IIFE tail not found');
js = js.replace(tail, 'globalThis.__S__ = S;\n})();');

function canvasStub() {
  const ctx = {
    createLinearGradient: () => ({ addColorStop() {} }),
    fillRect() {}, beginPath() {}, ellipse() {}, arc() {}, fill() {}, fillText() {},
    drawImage() {}, set fillStyle(v) {}, get fillStyle() { return '#000'; },
    set font(v) {}, get font() { return ''; },
    set strokeStyle(v) {}, set lineWidth(v) {},
    moveTo() {}, lineTo() {}, stroke() {}, closePath() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
  };
  return {
    width: 0,
    height: 0,
    getContext: () => ctx,
    toDataURL: () => null,
  };
}

function node() {
  const target = {
    style: {},
    dataset: {},
    children: [],
    classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
    textContent: '',
    innerHTML: '',
    value: '',
    checked: false,
  };
  return new Proxy(target, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'createElement') return (tag) => (tag === 'canvas' ? canvasStub() : node());
      if (k === 'querySelector') return () => node();
      if (k === 'querySelectorAll') return () => [];
      if (k === 'closest') return () => null;
      if (k === 'appendChild' || k === 'insertAdjacentHTML') return () => {};
      if (k === 'setAttribute' || k === 'removeAttribute') return () => {};
      if (k === 'addEventListener' || k === 'removeEventListener') return () => {};
      if (k === 'focus' || k === 'blur' || k === 'play' || k === 'pause' || k === 'load') return () => {};
      if (k === 'getContext') return () => null;
      if (k === 'matches') return () => false;
      if (k === 'getBoundingClientRect') return () => ({ top: 0, left: 0, width: 0, height: 0 });
      return undefined;
    },
    set(t, k, v) {
      t[k] = v;
      return true;
    },
  });
}

const sandbox = {
  console: { log() {}, warn() {}, error() {} },
  document: Object.assign(node(), { body: node() }),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  navigator: { userAgent: 'node', mediaDevices: undefined },
  location: { href: 'http://localhost/', reload() {}, hash: '' },
  setTimeout: () => 0,
  clearTimeout: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: () => 0,
  matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
  fetch: () => Promise.reject(new Error('no network in extraction')),
  URL: { createObjectURL: () => '' , revokeObjectURL() {} },
  Blob: function Blob() {},
  FileReader: function FileReader() { this.readAsDataURL = () => {}; },
  Image: function Image() {},
  alert: () => {},
  innerWidth: 1440,
  innerHeight: 900,
  devicePixelRatio: 1,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
try {
  vm.runInContext(js, sandbox, { filename: 'demo.js' });
} catch (err) {
  console.error('script threw (state may still be captured):', err.message);
}

const S = sandbox.__S__;
if (!S) throw new Error('state S was not captured');

const outDir = path.join(root, 'database', 'seed');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'demo-state.json');
fs.writeFileSync(outFile, JSON.stringify(S, null, 2));

const summary = {};
for (const [k, v] of Object.entries(S)) {
  summary[k] = Array.isArray(v) ? `array(${v.length})` : typeof v === 'object' && v ? `object{${Object.keys(v).join(',')}}` : v;
}
console.log('wrote', path.relative(root, outFile));
console.log(JSON.stringify(summary, null, 2));
