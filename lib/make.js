const path = require(`path`)
const _ = require(`./l10n`)

const outputFormat = {
  // 'html': { ext: `.html`, cmd: require('./make/output/html') },
  'html/slides': { ext: `.html`, cmd: require(`./make/output/html/slides`) },
  // 'pdf': { ext: `.pdf`, cmd: require('./make/output/pdf') },
  'pdf/slides': { ext: `.pdf`, cmd: require(`./make/output/pdf/slides`) }
}

async function make (options = {}) {
  const format = String(options.format).toLowerCase()

  if (!outputFormat[format]) {
    return process.logger.fatal(
      _`Format unknown: ${format}`,
      _`Expect any of: ${Object.keys(outputFormat).join(`, `)}`
    )
  }

  process.logger.info(_`Creating a ${format} document`)

  const { ext, cmd } = outputFormat[format]
  const dest = path.resolve(options.output).replace(/\.___$/, ext)

  if (ext !== path.extname(dest)) {
    process.logger.debug.warn(_`OUTPUT: ${dest}`)
    return process.logger.fatal(_`The filename extension for the output should be '${ext}', got '${path.extname(dest)}' instead`)
  }

  await cmd(dest)
}

module.exports = make
