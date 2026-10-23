/* eslint-disable @typescript-eslint/no-require-imports -- This Node test loads the CommonJS compiler output. */
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { createNoise3D } = require("simplex-noise");

const source = ts.transpileModule(
  readFileSync(resolve(__dirname, "../../components/ui/wavy-background.tsx"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }
).outputText;

function mountBackground({ reducedMotion = false } = {}) {
  const callbacks = new Map();
  const resizeListeners = new Map();
  const effects = [];
  let nextId = 0;
  let resets = 0;
  let points = [];
  let geometry = [];
  const context = {
    fillRect() { geometry = []; },
    beginPath() { points = []; },
    lineTo(x, y) { points.push([x, y]); },
    stroke() { geometry.push(points); },
    closePath() {},
  };
  const canvas = {
    getContext: () => context,
    set width(value) { resets++; this.canvasWidth = value; },
    set height(value) { resets++; this.canvasHeight = value; },
  };
  const motionPreference = {
    matches: reducedMotion,
    addEventListener() {},
    removeEventListener() {},
  };
  const window = {
    innerWidth: 320,
    innerHeight: 240,
    matchMedia: () => motionPreference,
    addEventListener: (name, listener) => resizeListeners.set(name, listener),
    removeEventListener: (name) => resizeListeners.delete(name),
  };
  const compiledModule = { exports: {} };
  vm.runInNewContext(source, {
    exports: compiledModule.exports,
    module: compiledModule,
    window,
    document: { hidden: false, addEventListener() {}, removeEventListener() {} },
    requestAnimationFrame(callback) {
      const id = ++nextId;
      callbacks.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => callbacks.delete(id),
    require(name) {
      if (name === "react") return {
        useRef: () => ({ current: canvas }),
        useMemo: (factory) => factory(),
        useEffect: (effect) => effects.push(effect),
      };
      if (name === "react/jsx-runtime") return { jsx() {}, jsxs() {} };
      if (name === "@/utils/cn") return { cn: () => "" };
      if (name === "simplex-noise") return {
        createNoise3D: () => createNoise3D(() => 0.5),
      };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  compiledModule.exports.WavyBackground({});
  const cleanup = effects[0]();
  return {
    frame(timestamp) {
      assert.equal(callbacks.size, 1, "Exactly one animation loop should be active");
      const [id, callback] = callbacks.entries().next().value;
      callbacks.delete(id);
      callback(timestamp);
    },
    get geometry() { return geometry; },
    get pendingFrames() { return callbacks.size; },
    get resets() { return resets; },
    resize: () => resizeListeners.get("resize")(),
    cleanup,
  };
}

function assertSameGeometry(actual, expected) {
  assert.equal(actual.length, 5);
  actual.forEach((wave, index) => wave.forEach(([x, y], point) => {
    assert.equal(x, expected[index][point][0]);
    assert.ok(Math.abs(y - expected[index][point][1]) < 1e-8);
  }));
}

test("wave motion covers the same distance at 60Hz and 120Hz", () => {
  const regular = mountBackground();
  const fast = mountBackground();
  for (let frame = 0; frame <= 60; frame++) regular.frame(frame * 1000 / 60);
  for (let frame = 0; frame <= 120; frame++) fast.frame(frame * 1000 / 120);
  assertSameGeometry(fast.geometry, regular.geometry);
  regular.cleanup();
  fast.cleanup();
});

test("a long frame pause produces only a bounded motion step", () => {
  const paused = mountBackground();
  const reference = mountBackground();
  paused.frame(0);
  reference.frame(0);
  const initial = paused.geometry;
  paused.frame(60_000);
  reference.frame(50);
  assertSameGeometry(paused.geometry, reference.geometry);
  assert.notDeepEqual(paused.geometry, initial);
  paused.cleanup();
  reference.cleanup();
});

test("reduced motion renders waves without scheduling animation", () => {
  const background = mountBackground({ reducedMotion: true });
  assert.equal(background.geometry.length, 5);
  assert.equal(background.pendingFrames, 0);
  background.cleanup();
});

test("redundant resize events preserve the canvas buffer", () => {
  const background = mountBackground();
  const initialResets = background.resets;
  background.resize();
  background.resize();
  assert.equal(initialResets, 2);
  assert.equal(background.resets, initialResets);
  background.cleanup();
  assert.equal(background.pendingFrames, 0);
});
