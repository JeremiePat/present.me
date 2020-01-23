const path = require(`path`)

const _ = require(`./l10n`)
const Logger = require(`./log`)
const theme = require(`./make/theme`)

const outputFormat = {
  // 'html': { ext: `.html`, cmd: require('./output/html') },
  'html/slides': { ext: `.html`, cmd: require(`./output/html/slides`) },
  // 'pdf': { ext: `.pdf`, cmd: require('./output/pdf') },
  'pdf/slides': { ext: `.pdf`, cmd: require(`./output/pdf/slides`) }
}

async function make (src, options) {
  // Contextual logger
  const log = Logger.get(options)

  // Base value
  src = src || `.`
  const format = String(options.format).toLowerCase()

  if (!outputFormat[format]) {
    return log.fatal(
      _`Format unknown: ${format}`,
      _`Expect any of: ${Object.keys(outputFormat).join(`, `)}`
    )
  }

  log.info(_`Creating a ${format} document out of '${src}'`)

  const { ext, cmd } = outputFormat[format]
  const origin = path.resolve(src)
  let dest = path.join(origin, `${path.basename(origin)}${ext}`)

  if (options.output) {
    dest = path.resolve(options.output)

    if (ext !== path.extname(dest)) {
      log.debug.warn(_`OUTPUT: ${dest}`)
      return log.fatal(_`The filename extension for the output should be '${ext}', got '${path.extname(dest)}' instead`)
    }
  }

  const custom = await theme(src, options, log)
  await cmd(origin, dest, custom, log).catch(console.error)

  log.debug.sep()
  log.info(_`Done.`)
}

module.exports = make
