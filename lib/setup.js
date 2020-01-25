const { removeSync } = require(`fs-extra`)
const { readdir } = require(`fs`).promises
const _ = require(`./l10n`)
const is = require(`./utils/is`)
const sass = require(`./setup/sass`)
const path = require(`path`)
const { createSafeSourceFolder, createSafeThemeFolder } = require(`./setup/folder`)

/**
 * Remove all out temporary folders when the process exit
 *
 * This method should never be called directly,
 * triggering process.exit() will call it automatically.
 */
function cleanup () {
  if (!process.logger.overwrite) {
    process.logger.nl()
  }

  process.logger.info(_`Cleanup before exit...`)
  removeSync(process.env.PME_FOLDER_SRC)
  removeSync(process.env.PME_FOLDER_THEME)
  process.logger.clear()

  if (!process.logger.overwrite) {
    process.logger.info(_`Done.`)
  }
}

/**
 * Prepare temporary folders to ease access to the content and theme ressources
 *
 * We also define the following ENV constant:
 *  - process.env.PME_FOLDER_SRC : The path to the safe workable source folder
 *  - process.env.PME_FOLDER_THEME : The path to the safe workable theme folder
 *  - process.env.PME_FOLDER_REVEAL : The path to the NPM reveal.js folder
 *
 * @param {string} src The path to the original source folder
 * @param {string} theme The string indicating which custom theme to use
 */
async function setup (src, theme) {
  process.env.PME_FOLDER_THEME = require
    .resolve(`reveal.js`)
    .replace(/(node_modules\/reveal\.js).*/, `$1`)

  process.env.PME_FOLDER_THEME = await createSafeThemeFolder(src, theme)

  const files = (await readdir(process.env.PME_FOLDER_THEME))
    .filter(is.file.sass)
    .map(file => path.join(process.env.PME_FOLDER_THEME, file))

  if (files.length > 0) {
    sass(files)
  }

  process.env.PME_FOLDER_SRC = await createSafeSourceFolder(src, process.env.PME_FOLDER_THEME)

  // Handle Ctrl+C
  process.on(`SIGINT`, () => process.exit())

  // Handle terminal being closed and other term signals
  process.on(`SIGHUP`, () => process.exit())
  process.on(`SIGTERM`, () => process.exit())

  process.on(`exit`, cleanup)
}

// ----------------------------------------------------------------------------
module.exports = { setup, cleanup }
