module.exports = {
  enum (obj) {
    try {
      const proto = Object.getPrototypeOf(obj)
      return proto &&
        proto.constructor &&
        proto.constructor.name === `Object`
    } catch {
      return false
    }
  },

  object (obj) {
    return Boolean(obj && typeof obj === `object`)
  },

  array (arr) {
    return Array.isArray(arr)
  },

  number (num) {
    return typeof num === `number` && !Number.isNaN(num)
  },

  func (fn) {
    return typeof fn === `function`
  },

  file: {
    css: RegExp.prototype.test.bind(/\.css$/i),
    html: RegExp.prototype.test.bind(/\.html?$/i),
    sass: RegExp.prototype.test.bind(/\.s[ac]ss$/i),
    yaml: RegExp.prototype.test.bind(/\.ya?ml$/i),
    markdown: RegExp.prototype.test.bind(/\.md$/i)
  }
}
