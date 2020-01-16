const { readdir } = require(`fs`).promises
const _ = require(`../l10n`)

const RGX_MD = /\.(?:md)$/
const markdown = RGX_MD.test.bind(RGX_MD)

async function getFiles (src, log) {
  log.debug(_(`Retrieving files from: %s`, src))

  const files = await readdir(src)
    .catch(err => log.error(err.message))

  const allFiles = {
    md: (files && files.filter(markdown)) || null
  }

  log.debug(_(`Content files:`))
  log.debug(allFiles.content)

  return allFiles
}

module.exports = getFiles
