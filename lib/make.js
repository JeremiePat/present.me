const _ = require(`./l10n`)
const pack = require(`./make/pack`)
const path = require(`path`)
const { remove } = require(`fs-extra`)

const outputFormat = {
  'html/slides': { ext: `.html`, create: require(`./make/output/html/slides`) },
  'pdf/slides': { ext: `.pdf`, create: require(`./make/output/pdf/slides`) }
}

/**
 * Main creation sanitization logic
 *
 * @param {object} options The options to produce the document
 * @returns {Promise}
 */
async function make (options = {}) {
  // Let's check the expected format
  const format = String(options.format).toLowerCase() // Sanitize

  if (!outputFormat[format]) { // Oups!
    return process.logger.fatal(
      _`Format unknown: ${format}`,
      _`Expect any of: ${Object.keys(outputFormat).join(`, `)}`
    )
  }

  const { ext, create } = outputFormat[format]

  // Let's check output filename validity
  const output = path.resolve(options.output).replace(/\.___$/, ext) // Sanitize

  if (ext !== path.extname(output)) { // Oups!
    process.logger.debug.warn(_`OUTPUT: ${output}`)
    return process.logger.fatal(_`The filename extension for the output should be '${ext}', got '${path.extname(output)}' instead`)
  }

  // We are good to create the expected output
  process.logger.info(_`Creating a ${format} document`)
  await create(output)

  // Let's check if we can pack the output
  if (options.pack) {
    if (!pack[options.pack]) { // Meh!
      process.logger.error(_`Unknown pack format: ${options.pack}`)
      process.logger.error(_`Expect any of: ${Object.keys(pack).join(`, `)}`)
      return
    }

    if (ext === `.pdf`) {
      await pack[options.pack](output, output)
    } else {
      await pack[options.pack](process.env.PME_FOLDER_SRC, output)
    }

    // If the source have been packed, we remove the original
    // source. Only the archive must remain available.
    await remove(output)
  }
}

// ----------------------------------------------------------------------------
module.exports = make
