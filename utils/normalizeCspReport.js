/**
 * @typedef {object} NormalizedCspReport
 * @property {string|null} documentUri URI of the document where the violation occurred.
 * @property {string|null} violatedDirective CSP directive that was violated.
 * @property {string|null} blockedUri URI or scheme blocked by the policy.
 * @property {string|null} sourceFile Source file associated with the violation.
 * @property {number|null} lineNumber Line number of the violation in the source file.
 * @property {number|null} columnNumber Column number of the violation in the source file.
 * @property {string|null} disposition Policy mode, usually `enforce` or `report`.
 * @property {number|null} statusCode HTTP status code of the document.
 */

/**
 * Normalize a legacy CSP report, a Reporting API report, or a report body.
 *
 * Missing fields are returned as `null`. Unknown fields are ignored, and the
 * input object is never modified.
 *
 * @param {object} report A legacy `{ "csp-report": ... }` object,
 *   a Reporting API `{ body: ... }` object, or a CSP report body.
 * @returns {NormalizedCspReport} The normalized CSP violation fields.
 * @throws {TypeError} If report is not an object.
 */
function normalizeCspReport(report) {
  if (report === null || typeof report !== 'object' || Array.isArray(report)) {
    throw new TypeError('report must be an object');
  }

  const legacy = report['csp-report'];
  const body = report.body;
  const sources = [
    body && typeof body === 'object' ? body : null,
    legacy && typeof legacy === 'object' ? legacy : null,
    report,
  ].filter(Boolean);

  const pick = (...names) => {
    for (const source of sources) {
      for (const name of names) {
        if (source[name] !== undefined && source[name] !== null) {
          return source[name];
        }
      }
    }
    return null;
  };

  return {
    documentUri: pick('document-uri', 'documentURL', 'documentUri'),
    violatedDirective: pick(
      'violated-directive',
      'effectiveDirective',
      'violatedDirective'
    ),
    blockedUri: pick('blocked-uri', 'blockedURL', 'blockedUri'),
    sourceFile: pick('source-file', 'sourceFile'),
    lineNumber: pick('line-number', 'lineNumber'),
    columnNumber: pick('column-number', 'columnNumber'),
    disposition: pick('disposition'),
    statusCode: pick('status-code', 'statusCode'),
  };
}

module.exports = normalizeCspReport;
