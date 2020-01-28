const { bold, italic } = require(`chalk`)

function getType (val) {
  if (Array.isArray(val)) { return `array` }
  if (typeof val === `function`) { return `func` }
  if (typeof val === `object` && val !== null) { return `object` }
  return `string`
}

const format = {
  /**
   * Format an Array
   *
   * [
   *   'Array::(length)'
   *   [compactValue...]
   * ]
   *
   * @param {Array} arr The Array to format
   * @returns {Array}
   */
  array (arr) {
    return [
      `${italic(`Array`)}::(${arr.length})`,
      arr.map(value => stringify(value, true))
    ]
  },

  /**
   * Format a Function
   *
   * [
   *   'Function::name(...arity)'
   *   [sourceLine...]
   * ]
   *
   * @param {Function} fn The Function to format
   * @returns {Array}
   */
  func (fn) {
    return [
      `${italic(`Function`)}::${fn.name}(…${fn.length})`,
      fn.toString().split(`\n`)
    ]
  },

  /**
   * Format an Object
   *
   * [
   *   'Object::constructorName(nbrOfKeys)'
   *   [{ key: compactValue }...]
   * ]
   *
   * @param {Function} fn The Function to format
   * @returns {Array}
   */
  object (obj) {
    return [
      `${italic(`Object`)}::${(obj.constructor && obj.constructor.name) || `Object`}::(${Object.keys(obj).length})`,
      Object.keys(obj).map(k => `${italic.dim(k)}: ${stringify(obj[k], true)}`)
    ]
  },

  /**
   * Format a String
   *
   * [
   *   string
   *   []
   * ]
   *
   * @param {Function} fn The Function to format
   * @returns {Array}
   */
  string (str) {
    return [String(str), []]
  }
}

/**
 * Turn any JS value into a proper formated string for log
 *
 * @param {any} val The value to stringify
 * @param {boolean} compact Indicate if the value must be format as a single short line
 * @returns {string}
 */
function stringify (val, compact) {
  const type = getType(val)
  const [title, detail] = format[type](val)

  if (type === `string`) {
    return title
  }

  if (compact) {
    detail.length = 0
  }

  return [
    `${compact ? `` : bold(`• `)}${title}`,
    ...detail.map(s => `${bold(`| `)}${s}`)
  ].join(compact ? ` ` : `\n`)
}

// ----------------------------------------------------------------------------
module.exports = stringify
