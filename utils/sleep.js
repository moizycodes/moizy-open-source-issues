/**
 * Sleep Utility Function
 * ----------------------
 * Delays execution for a specified amount of time.
 */

function sleep(ms) {
  const delay =
    typeof ms === "number" && ms > 0
      ? ms
      : 0;

  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

module.exports = sleep;