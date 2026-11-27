const test = require("node:test");
const assert = require("node:assert/strict");

const once = require("../utils/once");

test("once should only call function once", () => {
  let count = 0;
  const increment = () => count++;

  const incrementOnce = once(increment);

  incrementOnce();
  incrementOnce();
  incrementOnce();

  assert.equal(count, 1);
});

test("once preserves the calling context (this)", () => {
  const user = {
    name: "Moeez",
    greet: once(function () {
      return this.name;
    }),
  };

  assert.equal(user.greet(), "Moeez");
});

test("once forwards arguments and caches the first result", () => {
  const obj = {
    base: 10,
    add: once(function (a, b) {
      return this.base + a + b;
    }),
  };

  assert.equal(obj.add(1, 2), 13);
  // Subsequent calls return the cached result, ignoring new arguments.
  assert.equal(obj.add(3, 4), 13);
});