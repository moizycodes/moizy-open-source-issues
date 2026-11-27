const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const validateFile = require("../utils/validateFile");

describe("validateFile", () => {
  const validFile = {
    name: "profile.png",
    size: 204800,
    type: "image/png",
  };

  test("accepts valid file", () => {
    const result = validateFile(validFile, {
      maxSize: 500000,
      allowedTypes: ["image/png"],
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  test("rejects oversized file", () => {
    const result = validateFile(validFile, {
      maxSize: 1000,
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("File size exceeds maximum limit"));
  });

  test("rejects invalid mime type", () => {
    const result = validateFile(validFile, {
      allowedTypes: ["image/jpeg"],
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("File type is not allowed"));
  });

  test("rejects missing required file", () => {
    const result = validateFile(null, {
      required: true,
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("File is required"));
  });

  test("handles missing optional file", () => {
    const result = validateFile(null);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  test("rejects invalid file object", () => {
    const result = validateFile({});

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("Invalid file object"));
  });

  test("allows zero-byte file unless restricted", () => {
    const result = validateFile({
      name: "empty.png",
      size: 0,
      type: "image/png",
    });

    assert.equal(result.valid, true);
  });
});