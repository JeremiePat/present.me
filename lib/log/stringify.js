const { bold, italic } = require(`chalk`)

function is (val) {
  if (Array.isArray(val)) { return `array` }
  if (typeof val === `function`) { return `func` }
  if (typeof val === `object` && val !== null) { return `object` }
  return `string`
}

const format = {
  array (arr) {
    return [
      `${italic(`Array`)}::(${arr.length})`,
      arr.map(value => stringify(value, true))
    ]
  },

  func (fn) {
    return [
      `${italic(`Function`)}::${fn.name}(…${fn.length})`,
      fn.toString().split(`\n`)
    ]
  },

  object (obj) {
    return [
      `${italic(`Object`)}::${(obj.constructor && obj.constructor.name) || `Object`}::(${Object.keys(obj).length})`,
      Object.keys(obj).map(k => `${bold(k)}: ${stringify(obj[k], true)}`)
    ]
  },

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
  const type = is(val)
  const [title, detail] = format[type](val)

  if (type === `string`) {
    return title
  }

  if (compact) {
    detail.length = 0
  }

  return [
    `${compact ? `` : bold(`• `)}${title}`,
    ...detail.map(s => `${compact ? `` : bold(`| `)}${s}`)
  ].join(compact ? ` ` : `\n`)
}

module.exports = stringify
