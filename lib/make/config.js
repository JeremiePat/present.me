const { readFile } = require(`fs`).promises
const YAML = require(`yaml`)
const combine = require(`../utils/combine`)

/**
 * Create a config object out of YAML files
 *
 * @param {Array} files An array of YAML files
 * @returns {Object}
 */
async function config (files) {
  const data = await Promise.all(files.map(f => readFile(f, `utf8`)))

  return data.reduce((cfg, data) => {
    const conf = YAML.parse(data, {
      prettyErrors: true
    })

    return combine(cfg, conf)
  }, {})
}

// ----------------------------------------------------------------------------
module.exports = config
