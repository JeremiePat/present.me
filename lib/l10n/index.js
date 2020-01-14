const path = require(`path`)
const { existsSync } = require(`fs`)

const data = require(`./en.json`)
const LANG = (typeof process.env.LANG === `string` && process.env.LANG.substr(0, 2)) || `en`

if (LANG !== `en` && existsSync(path.resolve(__dirname, `${LANG}.json`))) {
  Object.assign(data, require(`./${LANG}.json`))
}

module.exports = function l10n (key, ...params) {
  let str = data[key] || key

  params.forEach(s => {
    str = str.replace(`%s`, s)
  })

  return str
}
