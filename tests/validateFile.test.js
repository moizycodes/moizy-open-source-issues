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

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("rejects oversized file", () => {
    const result = validateFile(validFile, {
      maxSize: 1000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "File size exceeds maximum limit"
    );
  });

  test("rejects invalid mime type", () => {
    const result = validateFile(validFile, {
      allowedTypes: ["image/jpeg"],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "File type is not allowed"
    );
  });

  test("rejects missing required file", () => {
    const result = validateFile(null, {
      required: true,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "File is required"
    );
  });

  test("handles missing optional file", () => {
    const result = validateFile(null);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("rejects invalid file object", () => {
    const result = validateFile({});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Invalid file object"
    );
  });

  test("allows zero-byte file unless restricted", () => {
    const result = validateFile({
      name: "empty.png",
      size: 0,
      type: "image/png",
    });

    expect(result.valid).toBe(true);
  });
});