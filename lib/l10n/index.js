const path = require(`path`)
const { existsSync } = require(`fs`)

const data = require(`./en.json`)
const LANG = (typeof process.env.LANG === `string` && process.env.LANG.substr(0, 2)) || `en`

if (LANG !== `en` && existsSync(path.resolve(__dirname, `${LANG}.json`))) {
  Object.assign(data, require(`./${LANG}.json`))
}

module.exports = function l10n (key, ...params) {
  if (Array.isArray(key)) {
    key = key.reduce((str, sub, index) => {
      if (index === 0) { return str }
      return `${str}%${index}${sub}`
    })
  }

  let str = data[key] || key

  params.forEach((s, i) => {
    str = str.replace(`%${i + 1}`, s)
  })

  return str
}
