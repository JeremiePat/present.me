const is = require(`./is`)

/**
 * Deep combine two objects
 *
 * This function is pure, the original objects pass
 * to the function are never mutated in any ways
 *
 * /!\ If Arrays have duplicated entries, ** they ARE deduplicated **.
 * Trying to combine a mix of Objects and Arrays,
 * will result in Arrays to be dissmised.
 *
 * Some behaviors to know:
 *  - combine([1,2], [1,3]) => [1,2,3]
 *  - combine([1], {b:2}) => {b:2} // Not the same object as the input
 *  - combine({a:1}, [2]) => {a:1} // Not the same object as the input
 *  - combine({a:1}, {b:2}) => {a:1, b:2}
 *  - combine({a:1}, {a:2}) => {a:2}
 *  - combine({a:{b:1,c:1}}, {a:{c:2,d:2}}) => {a:{b:1,c:2,d:2}}
 *
 * @param {object|array} args The original objects to combine, in order
 * @return {object|array}
 */
function combine (...args) {
  if (args.some(obj => !is.object(obj) || !is.object(obj))) {
    throw new Error(`Expect Object or Array as input`)
  }

  if (args.every(is.array)) {
    return [...new Set([].concat(...args))]
  }

  args = args.filter(is.enum)

  return args.reduce((prev, next) => {
    return {
      ...prev,
      ...Object.keys(next).reduce((obj, key) => {
        if (
          (is.enum(prev[key]) && is.enum(next[key])) ||
          (is.array(prev[key]) && is.array(next[key]))
        ) {
          obj[key] = combine(prev[key], next[key])
        } else if (is.enum(next[key])) {
          obj[key] = { ...next[key] }
        } else if (is.array(next[key])) {
          obj[key] = [...next[key]]
        } else {
          obj[key] = next[key]
        }

        return obj
      }, {})
    }
  }, {})
}

// ----------------------------------------------------------------------------
module.exports = combine
