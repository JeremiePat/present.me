const l10n = {}
const LANG = (typeof process.env.LANG === 'string' && process.env.LANG.substr(0, 2)) || 'en'

try {
  Object.assign(l10n, require('./en.json'), require(`./${LANG}.json`))
} catch {
  Object.assign(l10n, require('./en.json'))
}

module.exports = l10n
