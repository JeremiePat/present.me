const path = require(`path`)
const { existsSync } = require(`fs`)

const LANG = (typeof process.env.LANG === `string` && process.env.LANG.substr(0, 2)) || `en`

function l10n (key, ...params) {
  if (Array.isArray(key)) {
    key = key.reduce((str, sub, index) => {
      if (index === 0) { return str }
      return `${str}%${index}${sub}`
    })
  }

  let str = l10n.data[key] || key

  params.forEach((s, i) => {
    str = str.replace(`%${i + 1}`, s)
  })

  return str
}

l10n.data = require(`./en.json`)

if (LANG !== `en` && existsSync(path.resolve(__dirname, `${LANG}.json`))) {
  Object.assign(l10n.data, require(`./${LANG}.json`))
}

module.exports = l10n
