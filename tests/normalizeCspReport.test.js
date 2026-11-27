const assert = require("node:assert/strict");
const { test } = require("node:test");
const normalizeCspReport = require("../utils/normalizeCspReport");

test("normalizes the complete legacy report from the issue example", () => {
  const report = {
    "csp-report": {
      "document-uri": "https://example.com/",
      "violated-directive": "img-src",
      "blocked-uri": "https://tracker.example.com/image.gif",
      disposition: "report",
    },
  };

  assert.deepEqual(normalizeCspReport(report), {
    documentUri: "https://example.com/",
    violatedDirective: "img-src",
    blockedUri: "https://tracker.example.com/image.gif",
    sourceFile: null,
    lineNumber: null,
    columnNumber: null,
    disposition: "report",
    statusCode: null,
  });
});

test("normalizes a complete legacy report with all supported fields", () => {
  const report = {
    "csp-report": {
      "document-uri": "https://example.com/dashboard",
      "violated-directive": "script-src",
      "blocked-uri": "https://evil.example/script.js",
      "source-file": "https://example.com/app.js",
      "line-number": 42,
      "column-number": 7,
      disposition: "enforce",
      "status-code": 200,
    },
  };

  assert.deepEqual(normalizeCspReport(report), {
    documentUri: "https://example.com/dashboard",
    violatedDirective: "script-src",
    blockedUri: "https://evil.example/script.js",
    sourceFile: "https://example.com/app.js",
    lineNumber: 42,
    columnNumber: 7,
    disposition: "enforce",
    statusCode: 200,
  });
});

test("normalizes modern Reporting API field names", () => {
  const report = {
    type: "csp-violation",
    url: "https://example.com/report-endpoint",
    body: {
      documentURL: "https://example.com/dashboard",
      effectiveDirective: "script-src",
      blockedURL: "https://evil.example/script.js",
      sourceFile: "https://example.com/app.js",
      lineNumber: 42,
      columnNumber: 7,
      disposition: "report",
      statusCode: 200,
      originalPolicy: "default-src 'self'",
    },
  };

  assert.deepEqual(normalizeCspReport(report), {
    documentUri: "https://example.com/dashboard",
    violatedDirective: "script-src",
    blockedUri: "https://evil.example/script.js",
    sourceFile: "https://example.com/app.js",
    lineNumber: 42,
    columnNumber: 7,
    disposition: "report",
    statusCode: 200,
  });
});

test("accepts a modern CSP report body directly", () => {
  assert.deepEqual(
    normalizeCspReport({
      documentURL: "https://example.com/",
      effectiveDirective: "img-src",
      blockedURL: "data",
    }),
    {
      documentUri: "https://example.com/",
      violatedDirective: "img-src",
      blockedUri: "data",
      sourceFile: null,
      lineNumber: null,
      columnNumber: null,
      disposition: null,
      statusCode: null,
    },
  );
});

test("returns the normalized schema with null fields for an empty report", () => {
  assert.deepEqual(normalizeCspReport({}), {
    documentUri: null,
    violatedDirective: null,
    blockedUri: null,
    sourceFile: null,
    lineNumber: null,
    columnNumber: null,
    disposition: null,
    statusCode: null,
  });
});

test("handles partial and malformed nested reports without throwing", () => {
  assert.deepEqual(normalizeCspReport({ "csp-report": null }), {
    documentUri: null,
    violatedDirective: null,
    blockedUri: null,
    sourceFile: null,
    lineNumber: null,
    columnNumber: null,
    disposition: null,
    statusCode: null,
  });

  assert.deepEqual(normalizeCspReport({ body: "not an object" }), {
    documentUri: null,
    violatedDirective: null,
    blockedUri: null,
    sourceFile: null,
    lineNumber: null,
    columnNumber: null,
    disposition: null,
    statusCode: null,
  });
});

test("does not let unknown additional properties change the output schema", () => {
  const normalized = normalizeCspReport({
    "csp-report": {
      "document-uri": "https://example.com/",
      "unknown-property": "ignored",
      "original-policy": "default-src 'self'",
    },
    extra: true,
  });

  assert.deepEqual(Object.keys(normalized), [
    "documentUri",
    "violatedDirective",
    "blockedUri",
    "sourceFile",
    "lineNumber",
    "columnNumber",
    "disposition",
    "statusCode",
  ]);
  assert.equal(normalized.documentUri, "https://example.com/");
});

test("does not mutate the input report", () => {
  const report = {
    "csp-report": {
      "document-uri": "https://example.com/",
      "violated-directive": "img-src",
      "blocked-uri": "https://tracker.example.com/image.gif",
    },
  };
  const original = structuredClone(report);

  normalizeCspReport(report);

  assert.deepEqual(report, original);
});

test("preserves zero-valued line, column, and status numbers", () => {
  assert.deepEqual(
    normalizeCspReport({
      "line-number": 0,
      "column-number": 0,
      "status-code": 0,
    }),
    {
      documentUri: null,
      violatedDirective: null,
      blockedUri: null,
      sourceFile: null,
      lineNumber: 0,
      columnNumber: 0,
      disposition: null,
      statusCode: 0,
    },
  );
});

test("throws a TypeError for fundamentally invalid top-level input", () => {
  for (const report of [null, undefined, [], "text", 42, true]) {
    assert.throws(() => normalizeCspReport(report), TypeError);
  }
});
