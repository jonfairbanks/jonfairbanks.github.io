# Braces Advisory Exception

Approved October 12, 2026. This exception covers only [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) in development-only `braces@3.0.3`.

The dependency path is `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. The site exports static files to GitHub Pages. No public input path to this lint dependency has been established. The maintainer disputes the advisory; no official patched release exists at approval time. The finding remains a known risk, not a remediated vulnerability.

The required `dependency-audit` check runs `npm audit --json` and resolves each finding to its advisory leaves. It permits this exact advisory and inherited findings caused only by it. Other high/critical advisories remain blocking, including another advisory affecting braces or a parent package. Low/moderate findings retain the existing nonblocking threshold. Scanner failures, invalid reports, broken dependency chains, and unavailable upstream status fail the check.

Every run reads the [GitHub advisory API](https://api.github.com/advisories/GHSA-vfj7-8cjw-p6xm). A withdrawal or published patched version immediately deactivates the exception. Vulnerable installed packages then block normally; a clean audit passes. The exception also stops matching if braces leaves the development-only dependency scope or changes from 3.0.3. No branch rules are relaxed.

## Removal

When upstream publishes a supported fix, update the affected packages and lockfile through a PR to develop. If the advisory is withdrawn, confirm the audit no longer reports it. Remove this document and the advisory-specific policy from `scripts/dependency-audit.mjs`, preserving fail-closed high/critical enforcement and regression tests. Promote develop to main through the normal release workflow. Weekly upstream verification tracks this cleanup.

Track [the advisory correction](https://github.com/github/advisory-database/pull/10132) and [official release discussion](https://github.com/micromatch/braces/issues/73). Do not replace braces with an unofficial fork or suppress all development-dependency findings.
