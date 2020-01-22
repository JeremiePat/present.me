const { readFile } = require(`fs`).promises
const path = require(`path`)
const YAML = require(`yaml`)
const { pathExists, pathExistsSync } = require(`fs-extra`)
const files = require(`./files`)
const _ = require(`../l10n`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `theme`)

/**
 * Retrive a theme folder out of its name or path
 *
 * If the theme folder has been installed through NPM,
 * we will read the following properties from its package.json:
 *  - `directory`: We look for the `theme` key, it is necessary if the theme folder isn't the package root folder nor a folder named `theme`
 *  - `author`: So that we give credits in verbose mode
 *  - `description`: To be displayed in verbose mode
 *
 * The theme itself (a YAML file and some CSS files) can be either the NPM root
 * package folder, a folder named `theme` direct child of the NPM root package
 * folder, or any folder within the NPM package folder that is specified
 * through the `directories.theme` key
 *
 * @param {string} theme The theme to found (either a npm module name or a path)
 * @param {Logger} log A Logger to log what needs to be logged
 * @returns {Promise<string>} The path to the theme folder
 */
async function getThemeFolder (theme, log) {
  log.info(_`Retriving theme: ${theme || `default`}`)

  if (!theme) {
    return DEFAULT_THEME_FOLDER
  }

  if (/^[@a-z]/i.test(theme)) {
    try {
      const root = path.dirname(require.resolve(`${theme}/package.json`))
      const info = require(`${theme}/package.json`)
      log.debug(_`"${theme}" has been installed through NPM`)

      if (info.author) { log.info(_`"${theme}" a theme by ${info.author}`) }
      if (info.description) { log.info(info.description) }

      return [
        path.join(root, ((info.directories && info.directories.theme) || `theme`).replace(/^\.*?\/+/, ``)),
        path.join(root, `theme`),
        root
      ].filter(pathExistsSync)[0]
    } catch {
      log.debug(_`Not a theme installed through NPM!`)
    }
  }

  if (await pathExists(path.resolve(theme))) {
    return path.resolve(theme)
  }

  return DEFAULT_THEME_FOLDER
}

/**
 * Create a config object out of YAML files
 *
 * @param {Array} files An array of YAML files
 * @returns {Object}
 */
async function config (files) {
  const data = await Promise.all(files.map(f => readFile(f, `utf8`)))

  return data.reduce((cfg, data) => {
    return {
      ...cfg,
      ...YAML.parse(data, {
        prettyErrors: true
      })
    }
  }, {})
}

/**
 * Retrive and provide all necessary theme info
 *
 * The object return has the following properties:
 *  - `folder`: The absolute path the to the used theme folder
 *  - `config`: The configuration extracted from the theme
 *  - `css`: An Array of all the root css files available in the theme folder
 *
 * @param {string} src The path to the src folder containing the potential theme folder
 * @param {object} options A confifguration object
 * @param {Logger} log A Logger object to log what needs to be logged
 * @returns {object}
 */
async function theme (src, options, log) {
  log.debug.sep()
  log.debug(_`Retriving theme info`)
  const themeFolder = await getThemeFolder(options.theme || path.resolve(src, `theme`), log)

  log.debug.info(_`Theme found in:`)
  log.debug.warn(themeFolder)

  const { yaml, css } = await files(themeFolder, log)
  const userConfig = await config([
    path.join(DEFAULT_THEME_FOLDER, `config.yaml`),
    ...yaml.map(f => path.join(themeFolder, f))
  ])

  log.debug.sep()
  log.debug.info(_`Configuration:`)
  log.debug(userConfig)

  return {
    folder: themeFolder,
    config: userConfig,
    css: css
  }
}

module.exports = theme
