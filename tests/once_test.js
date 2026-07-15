const once = require("../utils/once");

test("once should only call function once", () => {
  let count = 0;
  const increment = () => count++;

  const incrementOnce = once(increment);

  incrementOnce();
  incrementOnce();
  incrementOnce();

  expect(count).toBe(1);
});