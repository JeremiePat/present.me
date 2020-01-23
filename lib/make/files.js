const { readdir } = require(`fs`).promises
const _ = require(`../l10n`)

const markdown = RegExp.prototype.test.bind(/\.md$/)
const yaml = RegExp.prototype.test.bind(/\.ya?ml$/)
const sass = RegExp.prototype.test.bind(/\.s(?:a|c)ss$/)
const css = RegExp.prototype.test.bind(/\.css$/)

async function getFiles (src, log) {
  log.debug.sep()
  log.debug.info(_`Retrieving files from:`)
  log.debug.warn(src)

  const files = await readdir(src)
    .catch(err => log.error(err.message))

  const allFiles = {
    md: (files && files.filter(markdown)) || [],
    yaml: (files && files.filter(yaml)) || [],
    sass: (files && files.filter(sass)) || [],
    css: (files && files.filter(css)) || []
  }

  log.debug.info(_`Markdown files:`)
  log.debug(allFiles.md)
  log.debug.info(_`YAML files:`)
  log.debug(allFiles.yaml)
  log.debug.info(_`CSS files:`)
  log.debug(allFiles.css)

  return allFiles
}

module.exports = getFiles
