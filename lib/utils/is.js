module.exports = {
  enum (obj) { return obj && typeof obj === `object` && !Array.isArray(obj) },
  object (obj) { return obj && typeof obj === `object` },
  array (arr) { return Array.isArray(arr) },
  number (num) { return num === +num },
  func (fn) { return typeof fn === `function` }
}
