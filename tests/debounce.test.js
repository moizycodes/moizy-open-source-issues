const test = require("node:test");
const assert = require("node:assert/strict");

const debounce = require("../utils/debounce");

test("debounce delays function execution", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let count = 0;
  const increment = () => count++;
  const debounced = debounce(increment, 300);

  debounced();
  assert.equal(count, 0);

  t.mock.timers.tick(299);
  assert.equal(count, 0);

  t.mock.timers.tick(1);
  assert.equal(count, 1);
});

test("debounce only calls the function once for rapid successive calls", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let count = 0;
  const increment = () => count++;
  const debounced = debounce(increment, 300);

  debounced();
  debounced();
  debounced();

  t.mock.timers.tick(300);
  assert.equal(count, 1);
});

test("debounce preserves the calling context (this)", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const user = {
    name: "Moeez",
    greet: debounce(function () {
      this.captured = this.name;
    }, 300),
  };

  user.greet();
  t.mock.timers.tick(300);

  assert.equal(user.captured, "Moeez");
});

test("debounce forwards arguments correctly", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let received;
  const fn = (a, b) => {
    received = a + b;
  };
  const debounced = debounce(fn, 300);

  debounced(2, 3);
  t.mock.timers.tick(300);

  assert.equal(received, 5);
});
