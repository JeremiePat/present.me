/**
 * Turn a value into a proper Array
 *
 * Note that is a value is a string it will be wrapped into an array
 * and not split into an Array of its characaters.
 *
 * @param {any} value A value to cast into an Array
 * @return {Array}
 */
function filterToArray (value) {
  if (value === null) {
    return []
  }

  if (
    typeof value[Symbol.iterator] === `function` &&
    typeof value !== `string` // Strings are iterable but we don't want each individual letters in this case.
  ) {
    return Array.from(value)
  }

  return [value]
}

// ----------------------------------------------------------------------------
module.exports = filterToArray
