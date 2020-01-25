const _ = require(`../l10n`)
const is = require(`../utils/is`)
const path = require(`path`)
const YAML = require(`yaml`)
const combine = require(`../utils/combine`)
const { readFile, readdir } = require(`fs`).promises

function readTextFile (file) {
  return readFile(file, `utf8`)
}

const YAML_PARSE_CONFIG = {
  prettyErrors: true,
  schema: `yaml-1.1`
}

const isMetadataEntry = RegExp.prototype.test.bind(/^(?:title|date|description|authors|lang)$/)

const DEFAULT_CONFIG = path.resolve(__dirname, `..`, `..`, `theme`, `config.yaml`)
const YAML_THEME_FILES = async () => {
  return (await readdir(process.env.PME_FOLDER_THEME))
    .filter(is.file.yaml)
    .map(file => path.join(process.env.PME_FOLDER_THEME, file))
}

async function metadata () {
  const files = (await readdir(process.env.PME_FOLDER_SRC))
    .filter(is.file.yaml)
    .map(readTextFile)

  const data = (await Promise.all(files))
    .map(txt => YAML.parse(txt, YAML_PARSE_CONFIG))

  return Object.fromEntries(
    Object
      .entries(combine({}, ...data))
      .filter(([key]) => isMetadataEntry(key))
  )
}

/**
 * Provide the user configuration through all the relevant files
 *
 * @returns {Object}
 */
async function config () {
  process.logger.debug.sep()
  process.logger.debug.info(_`Configuration:`)

  const files = [
    DEFAULT_CONFIG,
    ...(await YAML_THEME_FILES())
  ].map(readTextFile)

  const data = (await Promise.all(files))
    .map(txt => YAML.parse(txt, YAML_PARSE_CONFIG))

  const configuration = combine({}, ...data, await metadata())

  process.logger.debug(configuration)
  return configuration
}

// ----------------------------------------------------------------------------
module.exports = config
