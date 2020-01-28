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
    js: RegExp.prototype.test.bind(/\.js$/i),
    css: RegExp.prototype.test.bind(/\.css$/i),
    img: RegExp.prototype.test.bind(/\.(?:gif|jpe?g|png|svgz?|webp)$/i),
    font: RegExp.prototype.test.bind(/\.(?:eot|otf|ttf|woff2?)$/i),
    html: RegExp.prototype.test.bind(/\.html?$/i),
    sass: RegExp.prototype.test.bind(/\.s[ac]ss$/i),
    yaml: RegExp.prototype.test.bind(/\.ya?ml$/i),
    hidden: RegExp.prototype.test.bind(/^\./i),
    markdown: RegExp.prototype.test.bind(/\.md$/i)
  }
}
