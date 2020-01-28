const strip = require(`strip-ansi`)

/**
 * Split a string into shorter chunck
 *
 * @param {string} str The string to split
 * @param {number} maxLength The max length of each chunck
 * @return {Array} All the chuncks
 */
function limitStringLength (str, maxLength) {
  const rgx = new RegExp(`.{0,${maxLength - 2}}(?:$|\\s|/)`, `g`)

  return str.split(`\n`).reduce((arr, s) => {
    const lns = s.match(rgx)

    // For some weird reason, match() add an extra empty string
    // at the end of the array. The only case it is relevant is
    // when the string is just `^\s*\n$` to preserve the line break.
    // In all other cases we need to get rid of it
    return [...arr, ...(lns.length > 1 ? lns.slice(0, -1) : lns)]
  }, [])
}

/**
 * Format a string to fit a given length with a custom prefix.
 *
 * The format is as follow:
 *
 * @param {string} str The string to format
 * @param {string} prefix The prefix to add to the formated string
 * @param {Function} formater A chalk function to format lines
 * @param {number} lineLength The max length of the string
 * @returns {Array} All the string chuncks properly prefixed
 */
function format (str, prefix, formater, lineLength) {
  const fn = formater || (s => { return s })
  const len = lineLength - strip(prefix).length
  const blank = ` `.repeat(strip(prefix).length)

  return str
    .split(`\n`)
    .reduce((acc, line) => {
      return [...acc, ...limitStringLength(line, len)]
    }, [])
    .map((line, index) => `${index === 0 ? prefix : blank}${fn(line)}`)
}

// ----------------------------------------------------------------------------
module.exports = format
