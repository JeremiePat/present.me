const { readdir } = require('fs').promises

const RGX_CONTENT = /\.(?:md|yaml)$/
const content = RGX_CONTENT.test.bind(RGX_CONTENT)

async function getFiles (src, log) {
  log.debug(`Retreving files from: ${src}`)

  const files = await readdir(src)
    .catch(err => log.error(err.message))

  const allFiles = {
    content: (files && files.filter(content)) || null
  }

  log.debug('Content files:')
  log.debug(allFiles.content)

  return allFiles
}

module.exports = getFiles
