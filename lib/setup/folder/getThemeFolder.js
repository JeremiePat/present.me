const _ = require(`../l10n`)
const path = require(`path`)
const getCustomUserTheme = require(`./getCustomUserTheme`)
const { pathExists } = require(`fs-extra`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `..`, `theme`)

/**
 *
 * @param {array} themes A list of possible theme sources to walk through.
 */
async function getThemeFolder (themes) {
  process.logger.debug.sep()
  process.logger.info(_`Retrieving theme folder`)

  const userTheme = await getCustomUserTheme(themes[0])
  const localTheme = (await pathExists(themes[1])) ? themes[1] : null

  if (userTheme) {
    process.logger.debug.info(_`Found a user theme:`)
    process.logger.debug.warn(userTheme)
    return userTheme
  }

  if (localTheme) {
    process.logger.debug.info(_`Found a local theme:`)
    process.logger.debug.warn(localTheme)
    return localTheme
  }

  process.logger.debug(_`Using the default theme:`)
  process.logger.debug.warn(DEFAULT_THEME_FOLDER)
  return DEFAULT_THEME_FOLDER
}

// ----------------------------------------------------------------------------
module.exports = getThemeFolder
