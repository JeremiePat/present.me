const _ = require(`../l10n`)
const is = require(`../utils/is`)
const path = require(`path`)
const YAML = require(`yaml`)
const combine = require(`../utils/combine`)
const { readFile, readdir } = require(`fs`).promises

function readTextFile (file) {
  return readFile(file, `utf8`)
}

const DEFAULT_CONFIG = path.resolve(__dirname, `..`, `..`, `theme`, `config.yaml`)
const YAML_PARSE_CONFIG = {
  prettyErrors: true,
  schema: `yaml-1.1`
}

async function getYAMLThemeFiles () {
  return (await readdir(process.env.PME_FOLDER_THEME))
    .filter(is.file.yaml)
    .map(file => path.join(process.env.PME_FOLDER_THEME, file))
}

/**
 * Get user matadata
 *
 * User metadata must be set in a YAML file at the root of the source folder.
 * Only the following keys are allowed: title, description, authors, date, lang
 *
 * @return {object}
 */
async function metadata () {
  const files = (await readdir(process.env.PME_FOLDER_SRC))
    .filter(is.file.yaml)
    .map(readTextFile)

  const data = (await Promise.all(files))
    .map(txt => YAML.parse(txt, YAML_PARSE_CONFIG))

  // We allowed the following keys only as valide user metadata
  return [
    `title`,
    `description`,
    `authors`,
    `date`,
    `lang`
  ].reduce((safe, key) => {
    if (key in data) {
      safe[key] = data[key]
    }

    return safe
  }, {})
}

/**
 * Provide the user configuration extract from all the relevant files
 *
 * @returns {Object}
 */
async function config () {
  process.logger.debug.sep()
  process.logger.debug.info(_`Configuration:`)

  const files = [
    DEFAULT_CONFIG,
    ...(await getYAMLThemeFiles())
  ].map(readTextFile)

  const data = (await Promise.all(files))
    .map(txt => YAML.parse(txt, YAML_PARSE_CONFIG))

  // User metadata always overwrite theme metadata
  const configuration = combine({}, ...data, await metadata())

  process.logger.debug(configuration)
  return configuration
}

// ----------------------------------------------------------------------------
module.exports = config
