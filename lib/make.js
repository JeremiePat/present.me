const path = require(`path`)

const _ = require(`./l10n`)
const theme = require(`./make/theme`)

const outputFormat = {
  // 'html': { ext: `.html`, cmd: require('./make/output/html') },
  'html/slides': { ext: `.html`, cmd: require(`./make/output/html/slides`) },
  // 'pdf': { ext: `.pdf`, cmd: require('./make/output/pdf') },
  'pdf/slides': { ext: `.pdf`, cmd: require(`./make/output/pdf/slides`) }
}

async function make (src, options) {
  // Base value
  src = src || `.`
  const format = String(options.format).toLowerCase()

  if (!outputFormat[format]) {
    return process.logger.fatal(
      _`Format unknown: ${format}`,
      _`Expect any of: ${Object.keys(outputFormat).join(`, `)}`
    )
  }

  process.logger.info(_`Creating a ${format} document out of '${src}'`)

  const { ext, cmd } = outputFormat[format]
  const origin = path.resolve(src)
  let dest = path.join(origin, `${path.basename(origin)}${ext}`)

  if (options.output) {
    dest = path.resolve(options.output)

    if (ext !== path.extname(dest)) {
      process.logger.debug.warn(_`OUTPUT: ${dest}`)
      return process.logger.fatal(_`The filename extension for the output should be '${ext}', got '${path.extname(dest)}' instead`)
    }
  }

  const custom = await theme(src, options)
  await cmd(origin, dest, custom) // .catch(console.error)

  process.logger.debug.sep()
  process.logger.info(_`Done.`)
}

module.exports = make
