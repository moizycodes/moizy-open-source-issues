const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const { checkHtmlAccessibility } = require("../utils/checkHtmlAccessibility");

describe("checkHtmlAccessibility", () => {
  test("returns valid for empty HTML", () => {
    const result = checkHtmlAccessibility("");
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  test("returns valid for null input", () => {
    const result = checkHtmlAccessibility(null);
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  test("returns valid for accessible image", () => {
    const result = checkHtmlAccessibility('<img src="a.png" alt="A cat">');
    assert.equal(result.valid, true);
  });

  test("flags image missing alt", () => {
    const result = checkHtmlAccessibility('<img src="a.png">');
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "image-alt");
  });

  test("allows decorative images", () => {
    const result = checkHtmlAccessibility('<img src="a.png" alt="" role="presentation">');
    assert.equal(result.valid, true);
  });

  test("flags unlabeled input", () => {
    const result = checkHtmlAccessibility('<input type="text" id="name">');
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "form-label");
  });

  test("allows labelled input via for/id", () => {
    const html = '<label for="name">Name</label><input type="text" id="name">';
    const result = checkHtmlAccessibility(html);
    assert.equal(result.valid, true);
  });

  test("allows input with aria-label", () => {
    const result = checkHtmlAccessibility('<input type="text" aria-label="Name">');
    assert.equal(result.valid, true);
  });

  test("flags button with no text", () => {
    const result = checkHtmlAccessibility("<button></button>");
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "button-name");
  });

  test("allows button with text", () => {
    const result = checkHtmlAccessibility("<button>Submit</button>");
    assert.equal(result.valid, true);
  });

  test("flags empty link", () => {
    const result = checkHtmlAccessibility('<a href="/x"></a>');
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "link-name");
  });

  test("allows link with text", () => {
    const result = checkHtmlAccessibility('<a href="/x">Home</a>');
    assert.equal(result.valid, true);
  });

  test("flags missing lang on html", () => {
    const result = checkHtmlAccessibility("<html><body></body></html>");
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "html-lang");
  });

  test("allows html with lang", () => {
    const result = checkHtmlAccessibility('<html lang="en"><body></body></html>');
    assert.equal(result.valid, true);
  });

  test("flags skipped heading level", () => {
    const result = checkHtmlAccessibility("<h1>Title</h1><h3>Section</h3>");
    assert.equal(result.valid, false);
    assert.equal(result.errors[0].rule, "heading-order");
  });

  test("allows correct heading hierarchy", () => {
    const result = checkHtmlAccessibility("<h1>Title</h1><h2>Section</h2>");
    assert.equal(result.valid, true);
  });

  test("reports multiple violations", () => {
    const html = '<html><body><img src="a.png"><a href="/x"></a></body></html>';
    const result = checkHtmlAccessibility(html);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length >= 3);
  });

  test("respects disabled rules", () => {
    const result = checkHtmlAccessibility('<img src="a.png">', {
      rules: { "image-alt": false },
    });
    assert.equal(result.valid, true);
  });

  test("handles malformed HTML without throwing", () => {
    assert.doesNotThrow(() => checkHtmlAccessibility("<img src='a.png'"));
  });

  test("does not modify the original HTML", () => {
    const html = '<img src="a.png">';
    checkHtmlAccessibility(html);
    assert.equal(html, '<img src="a.png">');
  });

  test("handles multiple independent documents", () => {
    const r1 = checkHtmlAccessibility("<html><body></body></html>");
    const r2 = checkHtmlAccessibility('<html lang="en"><body></body></html>');
    assert.equal(r1.valid, false);
    assert.equal(r2.valid, true);
  });
});