/**
 * NJK Filter that make sure that reveal.js option are properly formated
 *
 * @param {string} str The value to filter
 * @param {string} key The original key of the value
 * @return {string}
 */
function filterRevealJSSafeOptions (str, key) {
  if (str === null) {
    return `null`
  }

  // Only autoSlideMethod can get a raw string (which is a function name).
  // All other strings must be wrapped into quotes as the output is epxected
  // to be a valid JS value.
  if (typeof str === `string` && key !== `autoSlideMethod`) {
    return `'${str}'`
  }

  return str
}

// ----------------------------------------------------------------------------
module.exports = filterRevealJSSafeOptions
