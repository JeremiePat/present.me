const fs = require(`fs-extra`)
const _ = require(`../l10n`)

/**
 * Cleanup operation for when the server is shut down
 *
 * It worth noticing that calling this function will end the current process.
 *
 * @param {string} www The server root folder to clean
 * @returns {Promise}
 */
async function cleanup (www) {
  if (!process.logger.overwrite) {
    process.logger.nl()
  }

  process.logger.info(_`Cleanup before exit...`)
  await fs.remove(www)
  process.logger.clear()

  if (!process.logger.overwrite) {
    process.logger.info(_`Done.`)
  }

  process.exit()
}

// ----------------------------------------------------------------------------
module.exports = cleanup
