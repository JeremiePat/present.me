const is = require(`../utils/is`)
const os = require(`os`)
const path = require(`path`)
const crypto = require(`crypto`)
const readDirDeep = require(`../utils/readDirDeep`)
const { promisify } = require(`util`)
const { ensureLink } = require(`fs-extra`)
const getThemeFolder = require(`./folder/getThemeFolder`)

const randomBytes = promisify(crypto.randomBytes)
const isTest = RegExp.prototype.test.bind(/test/i)
const isLicense = RegExp.prototype.test.bind(/license/i)

const makeLink = (from, to) => entry => {
  const origin = path.join(from, entry.name)
  const dest = path.join(to, entry.name)
  return ensureLink(origin, dest)
}

/**
 * Create a temprary theme folder linking the files of the original theme folder
 *
 * Create a temporary folder, pick the best theme folder among all possible
 * theme sources, link the original theme files so that we can create and
 * manipulate them safely and repeateadly.
 *
 * @param {string} src The path of the original source folder
 * @param {string} theme The path or name of the theme to use
 * @returns {string} The path to the temporary folder
 */
async function createSafeThemeFolder (src, theme) {
  // By creating our temporary directory into the OS tmp folder, we make
  // sure that if the process end badly, our folder will be removed by
  // the OS cleaning routine.
  const TMP_DIRECTORY = path.join(os.tmpdir(), `stuffme-${(await randomBytes(8)).toString(`hex`)}`)

  // Let's retrieve the most accurate them folder.
  const source = await getThemeFolder(theme, path.join(src, `theme`))

  // We link all the file from the original them folder
  // into our safe theme folder. Among many things it will
  // let us compile sass file without adding the resulting files
  // into the original theme folder.
  //
  // TODO: Shouldn't we copy css files instead of linking them in order
  //       to prevent rewriting them while compiling Sass files? (for example
  //       if we have both foo.css and foo.sass in the same folder, the Sass
  //       compilation will overwrite the foo.css file)
  const linking = (await readDirDeep(source, { withFileTypes: true }))
    .filter(entry => !entry.isDirectory())
    .map(makeLink(source, TMP_DIRECTORY))

  await Promise.all(linking)

  return TMP_DIRECTORY
}

/**
 * Create a temprary source folder linking the files of the original source folder
 *
 * Create a temporary folder and link the original source files so that we can
 * create and manipulate source safely and repeateadly. It also link the theme
 * folder and the reveal folder inside our temporary folder so that we have a
 * clean ready to use source folder with all its dependencies.
 *
 * @param {string} src The path of the original source folder
 * @param {string} theme The path or name of the theme to use
 * @returns {string} The path to the temporary folder
 */
async function createSafeSourceFolder (src, theme) {
  // By creating our temporary directory into the OS tmp folder, we make
  // sure that if the process end badly, our folder will be removed by
  // the OS cleaning routine.
  const TMP_DIRECTORY = path.join(os.tmpdir(), `stuffme-${(await randomBytes(8)).toString(`hex`)}`)
  const TMP_DIRECTORY_THEME = path.join(TMP_DIRECTORY, `theme`)
  const TMP_DIRECTORY_REVEAL = path.join(TMP_DIRECTORY, `reveal.js`)

  const linkingSRC = (await readDirDeep(src, { withFileTypes: true }))
    .filter(entry => {
      return (
        !entry.isDirectory() &&
        entry.name.indexOf(`theme`) !== 0 && // theme is a special case
        entry.name.indexOf(`reveal.js`) !== 0 // reveal.js is a special case
      )
    })
    .map(makeLink(src, TMP_DIRECTORY))

  // We create a theme directory within the source directory and
  // we make sure that it doesn't contain Sass or hidden files.
  // This makes it safe for packing
  const linkingTheme = (await readDirDeep(theme, { withFileTypes: true }))
    .filter(entry => {
      return (
        !entry.isDirectory() &&
        !is.file.sass(entry.name) &&
        !is.file.hidden(entry.name)
      )
    })
    .map(makeLink(theme, TMP_DIRECTORY_THEME))

  // Create a reveal.js folder within our source folder that contain only
  // JS, CSS, IMG, FONT and license files, without tests. This makes it safe
  // for packing without unnecessary files
  const linkingReveal = (await readDirDeep(process.env.STUFF_FOLDER_REVEAL, { withFileTypes: true }))
    .filter(entry => {
      return (
        !entry.isDirectory() &&
        !isTest(entry.name) && (
          is.file.js(entry.name) ||
          is.file.css(entry.name) ||
          is.file.img(entry.name) ||
          is.file.font(entry.name) ||
          isLicense()
        )
      )
    })
    .map(makeLink(process.env.STUFF_FOLDER_REVEAL, TMP_DIRECTORY_REVEAL))

  await Promise.all([...linkingSRC, ...linkingTheme, ...linkingReveal])

  return TMP_DIRECTORY
}

// ----------------------------------------------------------------------------
module.exports = {
  createSafeSourceFolder,
  createSafeThemeFolder
}
