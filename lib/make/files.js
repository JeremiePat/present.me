const { readdir } = require(`fs`).promises
const _ = require(`../l10n`)

const FILE_MD = RegExp.prototype.test.bind(/\.md$/)
const FILE_CSS = RegExp.prototype.test.bind(/\.css$/)
const FILE_SASS = RegExp.prototype.test.bind(/\.s(?:a|c)ss$/)
const FILE_YAML = RegExp.prototype.test.bind(/\.ya?ml$/)

/**
 * Provide a list of the files available in a folder filtered by type
 *
 * @param {string} folder The path to a folder to read
 */
async function getFiles (folder) {
  process.logger.debug.sep()
  process.logger.debug.info(_`Retrieving files from:`)
  process.logger.debug.warn(folder)

  const files = await readdir(folder)
    .catch(err => process.logger.error(err.message))

  const allFiles = {
    md: (files && files.filter(FILE_MD)) || [],
    css: (files && files.filter(FILE_CSS)) || [],
    sass: (files && files.filter(FILE_SASS)) || [],
    yaml: (files && files.filter(FILE_YAML)) || []
  }

  process.logger.debug.dim(_`Markdown files:`)
  process.logger.debug(allFiles.md)
  process.logger.debug.dim(_`YAML files:`)
  process.logger.debug(allFiles.yaml)
  process.logger.debug.dim(_`CSS files:`)
  process.logger.debug(allFiles.css)
  process.logger.debug.dim(_`SASS files:`)
  process.logger.debug(allFiles.sass)

  return allFiles
}

// ----------------------------------------------------------------------------
module.exports = getFiles
