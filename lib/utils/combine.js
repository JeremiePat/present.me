const is = require(`./is`)

/**
 * Deep combine two objects
 *
 * This function is pure, the original objects pass
 * to the function are never mutated in any ways
 *
 * /!\ If Arrays have duplicated entries, ** they ARE deduplicated **.
 *
 * Some behaviors to know:
 *  - combine([1], [2]) => [1,2]
 *  - combine([1], {b:2}) => {b:2} // Not the same object as the input
 *  - combine({a:1}, [2]) => [2] // Not the same array as the input
 *  - combine({a:1}, {b:2}) => {a:1, b:2}
 *  - combine({a:1}, {a:2}) => {a:2}
 *  - combine({a:{b:1,c:1}}, {a:{c:2,d:2}}) => {a:{b:1,c:2,d:2}}
 *
 * @param {object|array} prev The original object to override
 * @param {object|array} next The new object that must override the original object
 * @return {object|array}
 */
function combine (prev, next) {
  if (!is.object(prev) || !is.object(next)) {
    throw new Error(`Expect Object or Array as input`)
  }

  if (is.array(prev) && is.array(next)) {
    return Array.from(new Set([...prev, ...next]))
  }

  if (is.array(prev)) {
    return { ...next }
  }

  if (is.array(next)) {
    return [...next]
  }

  return {
    ...prev,
    ...Object.keys(next).reduce((obj, key) => {
      if (is.object(prev[key]) && is.object(next[key])) {
        obj[key] = combine(prev[key], next[key])
      } else if (is.object(next[key])) {
        obj[key] = combine({}, next[key])
      } else {
        obj[key] = next[key]
      }

      return obj
    }, {})
  }
}

// ----------------------------------------------------------------------------
module.exports = combine
