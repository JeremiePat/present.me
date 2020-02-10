const _ = require(`../../l10n`)
const path = require(`path`)
const { pathExists } = require(`fs-extra`)

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
async function getCustomUserTheme (theme) {
  if (!theme) { return null }

  // NPM module should only start with a @ (scoped package) or a letter
  if (/^[@a-z]/i.test(theme)) {
    try {
      const root = path.dirname(require.resolve(`${theme}/package.json`))
      const info = require(`${theme}/package.json`)
      process.logger.debug.info(_`"${theme}" has been installed through NPM`)

      if (info.author) { process.logger.info(_`"${theme}" a theme by ${info.author.name}`) }
      if (info.description) { process.logger.info(info.description) }

      let folder = path.join(root, ((info.directories && info.directories.theme) || `theme`).replace(/^\.*?\/+/, ``))

      // The theme folder has been set through the { directory.theme } key
      if (await pathExists(folder)) {
        return folder
      }

      folder = path.join(root, `theme`)

      // The theme folder is the folder `theme` within the package folder
      if (await pathExists(folder)) {
        return folder
      }

      // The theme folder is the package folder itself
      return root
    } catch {
      process.logger.debug.info(_`Not a theme installed through NPM!`)
    }
  }

  theme = path.resolve(theme)

  if (await pathExists(theme)) {
    process.logger.debug.info(_`Theme found in the file system:`)
    process.logger.debug.warn(theme)
    return theme
  }

  // No user theme found
  return null
}

// ----------------------------------------------------------------------------
module.exports = getCustomUserTheme
