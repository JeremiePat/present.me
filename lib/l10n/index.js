const path = require(`path`)
const { existsSync } = require(`fs`)

// Extract the 2 chars code lang out of the shell environnement
const LANG = (typeof process.env.LANG === `string` && process.env.LANG.substr(0, 2)) || `en`

/**
 * Translate a string into the global target language
 *
 * This function can be used as template string tranformer (l10n`...`). If so,
 * the target string to translate is rebuild automatically frome the string
 * fragments.
 *
 * @param {array|string} key The string to translate
 * @param {...string} params The params to inject within the tranlated string
 * @returns {string}
 */
function l10n (key, ...params) {
  if (Array.isArray(key)) {
    key = key.reduce((str, sub, index) => `${str}%${index}${sub}`)
  }

  let str = l10n.data[key] || key

  params.forEach((s, i) => {
    str = str.replace(`%${i + 1}`, s)
  })

  return str
}

// ----------------------------------------------------------------------------
// Set up lang data based on the shell local
// ----------------------------------------------------------------------------

l10n.data = require(`./en.json`) // Always fallback to English

if (LANG !== `en` && existsSync(path.resolve(__dirname, `${LANG}.json`))) {
  Object.assign(l10n.data, require(`./${LANG}.json`))
}

// ----------------------------------------------------------------------------
module.exports = l10n
