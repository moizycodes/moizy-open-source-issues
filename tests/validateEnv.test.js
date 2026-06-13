"use strict";

/**
 * Tests for utils/validateEnv.js
 *
 * Uses a self-contained test runner — no external dependencies required.
 * Run with: node tests/validateEnv.test.js
 *
 * process.exit is mocked to prevent the test process from terminating,
 * allowing validation failures to be asserted like any other outcome.
 */

const validateEnv = require("../utils/validateEnv");

// ---------------------------------------------------------------------------
// Minimal test runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✔  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || "Assertion failed");
};

const assertEquals = (actual, expected, label = "") => {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
};

// ---------------------------------------------------------------------------
// process.exit mock helpers
// ---------------------------------------------------------------------------

/**
 * Runs a callback with process.exit replaced by a spy.
 * Returns the exit code that was passed, or null if exit was not called.
 *
 * @param {Function} fn
 * @returns {{ exitCode: number|null, stderrOutput: string[] }}
 */
function withMockedExit(fn) {
  const originalExit = process.exit;
  const originalStderrWrite = process.stderr.write.bind(process.stderr);

  let exitCode = null;
  const stderrOutput = [];

  process.exit = (code) => {
    exitCode = code ?? 0;
    throw new Error(`__process_exit__:${exitCode}`);
  };

  process.stderr.write = (chunk) => {
    stderrOutput.push(String(chunk));
    return true;
  };

  try {
    fn();
  } catch (err) {
    if (!String(err.message).startsWith("__process_exit__")) {
      process.exit = originalExit;
      process.stderr.write = originalStderrWrite;
      throw err;
    }
  } finally {
    process.exit = originalExit;
    process.stderr.write = originalStderrWrite;
  }

  return { exitCode, stderrOutput };
}

// ---------------------------------------------------------------------------
// Helpers to set / clean up env vars within a test
// ---------------------------------------------------------------------------

function withEnv(vars, fn) {
  const previous = {};

  for (const [k, v] of Object.entries(vars)) {
    previous[k] = process.env[k];
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }

  try {
    fn();
  } finally {
    for (const [k, v] of Object.entries(previous)) {
      if (v === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = v;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Suite: valid configuration — process.exit must NOT be called
// ---------------------------------------------------------------------------

console.log("\nValid configuration");

test("passes when all required string variables are set", () => {
  withEnv({ TEST_DB_URL: "postgres://localhost/db" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_DB_URL: "string" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when a required number variable holds a valid numeric string", () => {
  withEnv({ TEST_PORT: "3000" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_PORT: "number" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when a required boolean variable holds 'true'", () => {
  withEnv({ TEST_FLAG: "true" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_FLAG: "boolean" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when a required boolean variable holds '1'", () => {
  withEnv({ TEST_FLAG: "1" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_FLAG: "boolean" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when a required boolean variable holds 'false'", () => {
  withEnv({ TEST_FLAG: "false" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_FLAG: "boolean" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when a required boolean variable holds '0'", () => {
  withEnv({ TEST_FLAG: "0" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_FLAG: "boolean" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when an optional variable is absent", () => {
  withEnv({ TEST_REDIS_URL: undefined }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_REDIS_URL: { type: "string", required: false } });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("passes when all mixed required and optional variables are correct", () => {
  withEnv({ TEST_DB_URL: "postgres://localhost/db", TEST_PORT: "5432" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({
        TEST_DB_URL: "string",
        TEST_PORT: "number",
        TEST_REDIS_URL: { type: "string", required: false },
      });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("treats a descriptor object with required: true the same as shorthand", () => {
  withEnv({ TEST_SECRET: "my-secret" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_SECRET: { type: "string", required: true } });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

// ---------------------------------------------------------------------------
// Suite: missing required variables
// ---------------------------------------------------------------------------

console.log("\nMissing required variables");

test("exits with code 1 when a required variable is absent", () => {
  withEnv({ TEST_MISSING_VAR: undefined }, () => {
    const { exitCode, stderrOutput } = withMockedExit(() => {
      validateEnv({ TEST_MISSING_VAR: "string" });
    });
    assertEquals(exitCode, 1, "exitCode");
    assert(
      stderrOutput.some((line) => line.includes("TEST_MISSING_VAR")),
      "stderr should name the missing variable"
    );
  });
});

test("exits with code 1 when a required variable is an empty string", () => {
  withEnv({ TEST_EMPTY_VAR: "" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_EMPTY_VAR: "string" });
    });
    assertEquals(exitCode, 1, "exitCode");
  });
});

test("exits with code 1 when a required variable is a whitespace-only string", () => {
  withEnv({ TEST_BLANK_VAR: "   " }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_BLANK_VAR: "string" });
    });
    assertEquals(exitCode, 1, "exitCode");
  });
});

test("does NOT exit when an optional variable is absent", () => {
  withEnv({ TEST_OPT: undefined }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_OPT: { type: "string", required: false } });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("does NOT exit when an optional variable is an empty string", () => {
  withEnv({ TEST_OPT_EMPTY: "" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_OPT_EMPTY: { type: "string", required: false } });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

// ---------------------------------------------------------------------------
// Suite: type validation
// ---------------------------------------------------------------------------

console.log("\nType validation");

test("exits with code 1 when a number variable holds a non-numeric string", () => {
  withEnv({ TEST_PORT_INVALID: "abc" }, () => {
    const { exitCode, stderrOutput } = withMockedExit(() => {
      validateEnv({ TEST_PORT_INVALID: "number" });
    });
    assertEquals(exitCode, 1, "exitCode");
    assert(
      stderrOutput.some((line) => line.includes("TEST_PORT_INVALID")),
      "stderr should name the invalid variable"
    );
  });
});

test("exits with code 1 when a boolean variable holds an unrecognised string", () => {
  withEnv({ TEST_BOOL_INVALID: "yes" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_BOOL_INVALID: "boolean" });
    });
    assertEquals(exitCode, 1, "exitCode");
  });
});

test("boolean type-check is case-insensitive for 'TRUE'", () => {
  withEnv({ TEST_BOOL_UPPER: "TRUE" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_BOOL_UPPER: "boolean" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("number variable with value '0' is valid", () => {
  withEnv({ TEST_ZERO: "0" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_ZERO: "number" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

test("number variable with a decimal string is valid", () => {
  withEnv({ TEST_DECIMAL: "3.14" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_DECIMAL: "number" });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

// ---------------------------------------------------------------------------
// Suite: multiple errors reported before exit
// ---------------------------------------------------------------------------

console.log("\nMultiple errors");

test("collects and prints all errors before exiting", () => {
  withEnv(
    {
      TEST_MULTI_DB: undefined,
      TEST_MULTI_PORT: "not-a-number",
    },
    () => {
      const { exitCode, stderrOutput } = withMockedExit(() => {
        validateEnv({
          TEST_MULTI_DB: "string",
          TEST_MULTI_PORT: "number",
        });
      });
      assertEquals(exitCode, 1, "exitCode");
      const combinedOutput = stderrOutput.join("");
      assert(
        combinedOutput.includes("TEST_MULTI_DB"),
        "stderr should mention TEST_MULTI_DB"
      );
      assert(
        combinedOutput.includes("TEST_MULTI_PORT"),
        "stderr should mention TEST_MULTI_PORT"
      );
    }
  );
});

// ---------------------------------------------------------------------------
// Suite: edge cases
// ---------------------------------------------------------------------------

console.log("\nEdge cases");

test("returns without error for null schema", () => {
  const { exitCode } = withMockedExit(() => {
    validateEnv(null);
  });
  assertEquals(exitCode, null, "exitCode");
});

test("returns without error for undefined schema", () => {
  const { exitCode } = withMockedExit(() => {
    validateEnv(undefined);
  });
  assertEquals(exitCode, null, "exitCode");
});

test("returns without error for empty schema object", () => {
  const { exitCode } = withMockedExit(() => {
    validateEnv({});
  });
  assertEquals(exitCode, null, "exitCode");
});

test("reports unknown type and exits", () => {
  withEnv({ TEST_UNKNOWN_TYPE: "value" }, () => {
    const { exitCode, stderrOutput } = withMockedExit(() => {
      validateEnv({ TEST_UNKNOWN_TYPE: "date" });
    });
    assertEquals(exitCode, 1, "exitCode");
    assert(
      stderrOutput.some((line) => line.includes("TEST_UNKNOWN_TYPE")),
      "stderr should name the variable with an unknown type"
    );
  });
});

test("skips non-string, non-object definition entries silently", () => {
  withEnv({ TEST_SKIP: "value" }, () => {
    const { exitCode } = withMockedExit(() => {
      validateEnv({ TEST_SKIP: null });
    });
    assertEquals(exitCode, null, "exitCode");
  });
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${"─".repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("─".repeat(50));

if (failed > 0) process.exit(1);
