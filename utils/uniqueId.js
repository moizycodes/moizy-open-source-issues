/**
 * Generate unique incremental IDs.
 */

let counter = 0;

function uniqueId(prefix = 'id') {
  counter += 1;

  const finalPrefix =
    prefix === ''
      ? 'id'
      : prefix;

  return `${finalPrefix}_${counter}`;
}

module.exports = uniqueId;