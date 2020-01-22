const { readFile } = require(`fs`).promises
const YAML = require(`yaml`)
const is = require(`../utils/is`)

/**
 * Deep combine two objects
 *
 * This function is pure, the original objects pass
 * to the function are never mutated in any ways
 *
 * Some behaviors to know:
 *  - combine([1], [2]) => [1,2]
 *  - combine([1], {b:2}) => {b:2} // Not the same object as the input
 *  - combine({a:1}, [2]) => {a:1} // Not the same object as the input
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
    return [...prev, ...next]
  }

  if (is.array(prev)) {
    return { ...next }
  }

  if (is.array(next)) {
    return { ...prev }
  }

  return {
    ...prev,
    ...Object.keys(next).reduce((obj, key) => {
      if (is.object(prev[key]) && is.object(next[key])) {
        obj[key] = combine(prev[key], next[key])
      } else if (is.object(next[key])) {
        obj[key] = is.array(next[key]) ? [...next[key]] : { ...next[key] }
      } else {
        obj[key] = next[key]
      }

      return obj
    }, {})
  }
}

/**
 * Create a config object out of YAML files
 *
 * @param {Array} files An array of YAML files
 * @returns {Object}
 */
async function config (files) {
  const data = await Promise.all(files.map(f => readFile(f, `utf8`)))

  return data.reduce((cfg, data) => {
    const conf = YAML.parse(data, {
      prettyErrors: true
    })

    return combine(cfg, conf)
  }, {})
}

module.exports = config
