const _ = require(`../../l10n`)
const path = require(`path`)
const getCustomUserTheme = require(`./getCustomUserTheme`)
const { pathExists } = require(`fs-extra`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `..`, `theme`)

/**
 * Check the user, local, and default theme to return the most accurate
 *
 * @param {string} user A potential user theme
 * @param {string} local A potential local theme
 * @return {string} The path to the most accurate theme
 */
async function getThemeFolder (user, local) {
  process.logger.info(_`Retrieving theme folder`)

  const userTheme = await getCustomUserTheme(user)

  if (userTheme) {
    process.logger.debug.info(_`Found a user theme:`)
    process.logger.debug.warn(userTheme)
    return userTheme
  }

  local = path.resolve(local)
  const localTheme = (await pathExists(local)) ? local : null

  if (localTheme) {
    process.logger.debug.info(_`Found a local theme:`)
    process.logger.debug.warn(localTheme)
    return localTheme
  }

  process.logger.debug.info(_`Using the default theme:`)
  process.logger.debug.warn(DEFAULT_THEME_FOLDER)
  return DEFAULT_THEME_FOLDER
}

// ----------------------------------------------------------------------------
module.exports = getThemeFolder
