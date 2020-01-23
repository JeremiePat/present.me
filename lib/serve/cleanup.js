const fs = require(`fs-extra`)

const _ = require(`../l10n`)

/**
 * Cleanup operation for when the server is shut down
 *
 * It worth noticing that calling this function will end the current process.
 *
 * @param {object} log The logger to log cleanup info
 * @returns {Promise}
 */
async function cleanup (www, log) {
  if (!log.overwrite) {
    log.nl()
  }

  log.info(_`Cleanup before exit...`)
  await fs.remove(www)
  log.clear()

  if (!log.overwrite) {
    log.info(_`Done.`)
  }

  process.exit()
}

// ----------------------------------------------------------------------------
module.exports = cleanup
