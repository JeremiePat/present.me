const _ = require(`./l10n`)
const is = require(`./utils/is`)
const sass = require(`./setup/sass`)
const path = require(`path`)
const { readdir } = require(`fs`).promises
const { removeSync } = require(`fs-extra`)
const { createSafeSourceFolder, createSafeThemeFolder } = require(`./setup/folder`)

/**
 * Remove all out temporary folders when the process exit
 *
 * This method should never be called directly,
 * triggering process.exit() should call it automatically.
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
  // Let's retrieve the Reveal.js source folder
  // TODO: Shouldn't we make reveal a peer dependency?
  process.env.PME_FOLDER_REVEAL = require
    .resolve(`reveal.js`)
    .replace(/(node_modules\/reveal\.js).*/, `$1`)

  // Let's create a safe theme folder
  process.env.PME_FOLDER_THEME = await createSafeThemeFolder(src, theme)

  // Let's try to compile our Sass file into our safe folder
  // That way we do not cluter the original theme folder
  const files = (await readdir(process.env.PME_FOLDER_THEME))
    .filter(is.file.sass)
    .map(file => path.join(process.env.PME_FOLDER_THEME, file))

  // Note that compiling file in an existing css file will override that file
  // This can mess up with the theme original files if the authors has mixed
  // sass files and css files with the same name.
  //
  // TODO: Shouldn't createSafeThemeFolder copy the files into
  //       the safe them folder rather than linking them?
  sass(files)

  // Let's create a safe source folder
  process.env.PME_FOLDER_SRC = await createSafeSourceFolder(
    src,
    process.env.PME_FOLDER_THEME
  )

  // Handle Ctrl+C
  process.on(`SIGINT`, () => process.exit())

  // Handle terminal being closed and other useful term signals
  process.on(`SIGHUP`, () => process.exit())
  process.on(`SIGTERM`, () => process.exit())

  // Each time our process end nicely, we cleanup our temp folder mess.
  process.on(`exit`, cleanup)
}

// ----------------------------------------------------------------------------
module.exports = { setup, cleanup }
