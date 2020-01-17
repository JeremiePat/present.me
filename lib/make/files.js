const { readdir } = require(`fs`).promises
const _ = require(`../l10n`)

const RGX_MD = /\.(?:md)$/
const markdown = RGX_MD.test.bind(RGX_MD)

async function getFiles (src, log) {
  log.debug.sep()
  log.debug.info(_`Retrieving files from:`)
  log.debug.warn(src)

  const files = await readdir(src)
    .catch(err => log.error(err.message))

  const allFiles = {
    md: (files && files.filter(markdown)) || null
  }

  log.debug.info(_`Markdown files:`)
  log.debug(allFiles.md)

  return allFiles
}

module.exports = getFiles
