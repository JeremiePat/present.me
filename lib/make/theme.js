const path = require(`path`)
const { pathExists, pathExistsSync, outputFileSync } = require(`fs-extra`)
const files = require(`./files`)
const config = require(`./config`)
const _ = require(`../l10n`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `theme`)
const REVEAL_MODULE_FOLDER = require.resolve(`reveal.js`).replace(/(node_modules\/reveal.js).*/, `$1`)

function sass2css (file) {
  try {
    const { renderSync } = require(`sass`)
    const style = renderSync({
      file,
      includePaths: [
        path.join(REVEAL_MODULE_FOLDER, `css`, `theme`, `template`)
      ]
    })

    const dest = file.replace(/\.s(?:a|c)ss$/, `.css`)
    outputFileSync(dest, style.css)
    return dest
  } catch {
    return false
  }
}

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
 * @returns {Promise<string>} The path to the theme folder
 */
async function getThemeFolder (theme) {
  process.logger.debug.sep()
  process.logger.info(_`Retrieving theme: ${theme || `default`}`)

  if (!theme) {
    process.logger.debug.info(_`No user theme, using the default theme`)
    return DEFAULT_THEME_FOLDER
  }

  if (/^[@a-z]/i.test(theme)) {
    try {
      const root = path.dirname(require.resolve(`${theme}/package.json`))
      const info = require(`${theme}/package.json`)
      process.logger.debug(_`"${theme}" has been installed through NPM`)

      if (info.author) { process.logger.info(_`"${theme}" a theme by ${info.author}`) }
      if (info.description) { process.logger.info(info.description) }

      return [
        path.join(root, ((info.directories && info.directories.theme) || `theme`).replace(/^\.*?\/+/, ``)),
        path.join(root, `theme`),
        root
      ].filter(pathExistsSync)[0]
    } catch {
      process.logger.debug.info(_`Not a theme installed through NPM!`)
    }
  }

  if (await pathExists(path.resolve(theme))) {
    return path.resolve(theme)
  }

  process.logger.debug(_`No theme found in:`)
  process.logger.debug.warn(path.resolve(theme))
  return DEFAULT_THEME_FOLDER
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
 * @returns {object}
 */
async function theme (src, options) {
  process.logger.debug.sep()
  process.logger.debug(_`Retrieving theme information`)
  const themeFolder = await getThemeFolder(options.theme || path.resolve(src, `theme`))

  process.logger.debug.info(_`Theme found in:`)
  process.logger.debug.warn(themeFolder)

  const { yaml, css, sass } = await files(themeFolder)
  const userConfig = await config([
    path.join(DEFAULT_THEME_FOLDER, `config.yaml`),
    ...yaml.map(f => path.join(themeFolder, f))
  ])

  process.logger.debug.sep()
  process.logger.debug.info(_`Transforming SASS files:`)
  const scss = []
  for (const file of sass) {
    const result = sass2css(path.join(themeFolder, file))

    if (!result) { break }
    scss.push(path.basename(scss))
  }
  process.logger.debug(scss)

  if (scss.length !== sass.length) {
    process.logger.warn(_`Unable to compile all SASS files`)
    process.logger.warn(_`You need to install sass to compile your theme SASS files`)
  }

  process.logger.debug.sep()
  process.logger.debug.info(_`Configuration:`)
  process.logger.debug(userConfig)

  return {
    folder: themeFolder,
    config: userConfig,
    css: Array.from(new Set([...css, ...scss]))
  }
}

// ----------------------------------------------------------------------------
module.exports = theme
