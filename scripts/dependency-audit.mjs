import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const advisoryId = 'GHSA-vfj7-8cjw-p6xm';
const advisoryUrl = `https://github.com/advisories/${advisoryId}`;
const severities = ['info', 'low', 'moderate', 'high', 'critical'];
const blocks = severity => severity === 'high' || severity === 'critical';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};

export function evaluateAudit(report, status, advisory, lock) {
  requireValue(status === 0 || status === 1, 'Dependency scanner failed.');
  requireValue(object(report) && !('error' in report) && report.auditReportVersion === 2,
    'Invalid npm audit report.');
  requireValue(object(report.vulnerabilities) && object(report.metadata?.vulnerabilities),
    'Missing audit findings or counts.');
  requireValue(object(advisory) && advisory.ghsa_id === advisoryId &&
    'withdrawn_at' in advisory && Array.isArray(advisory.vulnerabilities),
  'Invalid upstream advisory response.');
  const upstream = advisory.vulnerabilities.filter(v =>
    v.package?.ecosystem === 'npm' && v.package?.name === 'braces');
  requireValue(upstream.length === 1 && 'first_patched_version' in upstream[0] &&
    typeof upstream[0].vulnerable_version_range === 'string', 'Missing upstream braces status.');
  // Retire the exception as soon as upstream publishes a fix or withdraws the advisory.
  const active = advisory.withdrawn_at === null && upstream[0].first_patched_version === null;
  requireValue(object(lock?.packages), 'Missing dependency lockfile.');

  const findings = report.vulnerabilities;
  const counts = Object.fromEntries(severities.map(s => [s, 0]));
  for (const [name, finding] of Object.entries(findings)) {
    requireValue(object(finding) && finding.name === name && severities.includes(finding.severity) &&
      Array.isArray(finding.via) && finding.via.length > 0, `Malformed finding: ${name}`);
    counts[finding.severity]++;
  }
  for (const severity of severities) {
    requireValue(report.metadata.vulnerabilities[severity] === counts[severity],
      'Inconsistent audit severity counts.');
  }
  const total = Object.keys(findings).length;
  requireValue(report.metadata.vulnerabilities.total === total && (status !== 1 || total > 0),
    'Inconsistent audit result.');

  function leaves(name, visited = new Set()) {
    requireValue(findings[name] && !visited.has(name), `Broken or cyclic audit chain: ${name}`);
    const next = new Set([...visited, name]);
    return findings[name].via.flatMap(via => {
      if (typeof via === 'string') return leaves(via, next);
      requireValue(object(via) && typeof via.url === 'string' &&
        typeof via.name === 'string' && typeof via.dependency === 'string' &&
        severities.includes(via.severity), `Malformed advisory in ${name}`);
      return [via];
    });
  }

  const ignored = new Set();
  const blocking = new Set();
  for (const [name, finding] of Object.entries(findings)) {
    const resolved = leaves(name);
    if (!blocks(finding.severity) && !resolved.some(v => blocks(v.severity))) continue;
    const severe = resolved.filter(v => blocks(v.severity));
    requireValue(severe.length > 0, `Missing high/critical advisory for ${name}`);
    for (const leaf of severe) {
      const braces = findings.braces;
      const devOnly = Array.isArray(braces?.nodes) && braces.nodes.length > 0 &&
        braces.nodes.every(node => lock.packages[node]?.version === '3.0.3' &&
          lock.packages[node]?.dev === true);
      if (active && leaf.url === advisoryUrl && leaf.name === 'braces' &&
        leaf.dependency === 'braces' && leaf.severity === 'high' && devOnly) {
        ignored.add(leaf.url);
      } else {
        blocking.add(`${name}: ${leaf.url}`);
      }
    }
  }
  return { active, ignored: [...ignored], blocking: [...blocking] };
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024 });
  requireValue(!result.error && !result.signal && result.status !== null, `${command} failed to run.`);
  return result;
}

export function main() {
  const audit = run('npm', ['audit', '--json']);
  if (audit.stderr) process.stderr.write(audit.stderr);
  const upstream = run('gh', ['api', `/advisories/${advisoryId}`]);
  requireValue(upstream.status === 0, 'Cannot verify upstream advisory status.');
  const result = evaluateAudit(JSON.parse(audit.stdout), audit.status,
    JSON.parse(upstream.stdout), JSON.parse(readFileSync('package-lock.json', 'utf8')));
  console.log(JSON.stringify(result, null, 2));
  if (!result.active) console.log('Braces exception retired: upstream published a fix or withdrew the advisory.');
  requireValue(result.blocking.length === 0, 'Unexcepted high/critical vulnerabilities block this release.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
