import assert from 'node:assert/strict';
import test from 'node:test';
import { advisoryId, evaluateAudit } from '../../scripts/dependency-audit.mjs';

const url = `https://github.com/advisories/${advisoryId}`;
const leaf = (severity = 'high', advisoryUrl = url) => ({
  name: 'braces', dependency: 'braces', severity, url: advisoryUrl,
});
function fixture() {
  const vulnerabilities = {};
  for (const [name, via] of [
    ['braces', [leaf()]], ['micromatch', ['braces']], ['fast-glob', ['micromatch']],
    ['@next/eslint-plugin-next', ['fast-glob']], ['eslint-config-next', ['@next/eslint-plugin-next']],
  ]) vulnerabilities[name] = { name, severity: 'high', via, nodes: [`node_modules/${name}`] };
  return {
    report: { auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: {
      info: 0, low: 0, moderate: 0, high: 5, critical: 0, total: 5,
    } } },
    advisory: { ghsa_id: advisoryId, withdrawn_at: null, vulnerabilities: [{
      package: { ecosystem: 'npm', name: 'braces' }, first_patched_version: null,
      vulnerable_version_range: '<= 3.0.3',
    }] },
    lock: { packages: { 'node_modules/braces': { version: '3.0.3', dev: true } } },
  };
}
const evaluate = f => evaluateAudit(f.report, 1, f.advisory, f.lock);

test('Exempts only the known advisory through the five-node chain', () => {
  assert.deepEqual(evaluate(fixture()).blocking, []);
  assert.deepEqual(evaluate(fixture()).ignored, [url]);
});
for (const severity of ['high', 'critical']) {
  test(`Blocks another ${severity} advisory on braces and every parent`, () => {
    const f = fixture();
    f.report.vulnerabilities.braces.via.push(leaf(severity, 'https://github.com/advisories/GHSA-other'));
    assert.equal(evaluate(f).blocking.length, 5);
  });
  test(`Blocks an unrelated ${severity} package`, () => {
    const f = fixture();
    f.report.vulnerabilities.other = { name: 'other', severity,
      via: [{ name: 'other', dependency: 'other', severity, url: 'https://github.com/advisories/GHSA-other' }] };
    f.report.metadata.vulnerabilities[severity]++;
    f.report.metadata.vulnerabilities.total++;
    assert.equal(evaluate(f).blocking.length, 1);
  });
}
for (const severity of ['low', 'moderate']) {
  test(`Preserves the nonblocking ${severity} threshold`, () => {
    const f = fixture();
    f.report.vulnerabilities.other = { name: 'other', severity,
      via: [{ name: 'other', dependency: 'other', severity, url: 'https://github.com/advisories/GHSA-other' }] };
    f.report.metadata.vulnerabilities[severity]++;
    f.report.metadata.vulnerabilities.total++;
    assert.deepEqual(evaluate(f).blocking, []);
  });
}
for (const [label, change] of [
  ['withdrawal', f => { f.advisory.withdrawn_at = '2026-10-13T00:00:00Z'; }],
  ['patched release', f => { f.advisory.vulnerabilities[0].first_patched_version = '3.0.4'; }],
  ['production dependency', f => { f.lock.packages['node_modules/braces'].dev = false; }],
  ['different installed version', f => { f.lock.packages['node_modules/braces'].version = '3.0.4'; }],
]) {
  test(`Stops exempting on ${label}`, () => {
    const f = fixture(); change(f);
    assert.equal(evaluate(f).blocking.length, 5);
    assert.deepEqual(evaluate(f).ignored, []);
  });
}
for (const [label, change] of [
  ['scanner error', f => { f.report.error = { code: 'E503' }; }],
  ['unsupported schema', f => { f.report.auditReportVersion = 3; }],
  ['missing counts', f => { delete f.report.metadata; }],
  ['inconsistent counts', f => { f.report.metadata.vulnerabilities.high = 0; }],
  ['dangling reference', f => { f.report.vulnerabilities.braces.via = ['missing']; }],
  ['cycle', f => { f.report.vulnerabilities.braces.via = ['micromatch']; }],
  ['empty chain', f => { f.report.vulnerabilities.braces.via = []; }],
  ['invalid severity', f => { f.report.vulnerabilities.braces.via[0].severity = 'unknown'; }],
  ['unavailable upstream status', f => { f.advisory = null; }],
  ['missing upstream patch status', f => { delete f.advisory.vulnerabilities[0].first_patched_version; }],
]) {
  test(`Fails closed on ${label}`, () => {
    const f = fixture(); change(f);
    assert.throws(() => evaluate(f));
  });
}
test('Rejects scanner execution failure', () => {
  const f = fixture();
  assert.throws(() => evaluateAudit(f.report, 2, f.advisory, f.lock));
});
test('Passes a clean audit after upstream withdraws the advisory', () => {
  const f = fixture();
  f.report.vulnerabilities = {};
  f.report.metadata.vulnerabilities = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
  f.advisory.withdrawn_at = '2026-10-13T00:00:00Z';
  const result = evaluateAudit(f.report, 0, f.advisory, f.lock);
  assert.equal(result.active, false);
  assert.deepEqual(result.blocking, []);
});

test('Blocks a critical leaf even if the package severity is understated', () => {
  const f = fixture();
  f.report.vulnerabilities.braces.via.push(leaf('critical', 'https://github.com/advisories/GHSA-other'));
  f.report.vulnerabilities.braces.severity = 'low';
  f.report.metadata.vulnerabilities.high--;
  f.report.metadata.vulnerabilities.low++;
  assert.equal(evaluate(f).blocking.length, 5);
});
