const { readdir } = require(`fs`).promises
const _ = require(`../l10n`)

const markdown = RegExp.prototype.test.bind(/\.md$/)
const yaml = RegExp.prototype.test.bind(/\.ya?ml$/)
const sass = RegExp.prototype.test.bind(/\.s(?:a|c)ss$/)
const css = RegExp.prototype.test.bind(/\.css$/)

async function getFiles (src) {
  process.logger.debug.sep()
  process.logger.debug.info(_`Retrieving files from:`)
  process.logger.debug.warn(src)

  const files = await readdir(src)
    .catch(err => process.logger.error(err.message))

  const allFiles = {
    md: (files && files.filter(markdown)) || [],
    yaml: (files && files.filter(yaml)) || [],
    sass: (files && files.filter(sass)) || [],
    css: (files && files.filter(css)) || []
  }

  process.logger.debug.info(_`Markdown files:`)
  process.logger.debug(allFiles.md)
  process.logger.debug.info(_`YAML files:`)
  process.logger.debug(allFiles.yaml)
  process.logger.debug.info(_`CSS files:`)
  process.logger.debug(allFiles.css)

  return allFiles
}

module.exports = getFiles
