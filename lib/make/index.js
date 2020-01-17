const path = require(`path`)

const _ = require(`../l10n`)
const Logger = require(`../log`)

const outputFormat = {
  // 'html': { ext: `.html`, cmd: require('./output/html') },
  'html/slides': { ext: `.html`, cmd: require(`./output/html/slides`) },
  // 'pdf': { ext: `.pdf`, cmd: require('./output/pdf') },
  'pdf/slides': { ext: `.pdf`, cmd: require(`./output/pdf/slides`) }
}

async function make (src, format, options) {
  // Contextual logger
  const log = Logger.get(options)

  // Base value
  src = src || `.`
  format = format || `html/slides`

  log.info(_`Creating a ${format} document out of '${src}'`)

  const origin = path.resolve(src)
  log.debug(_`ORIGIN: ${origin}`)

  if (!outputFormat[format]) {
    return log.error(_`Format unknown: ${format}`)
  }

  const { ext, cmd } = outputFormat[format]

  let dest = path.join(origin, `${path.basename(origin)}${ext}`)
  if (options.output) {
    dest = path.resolve(options.output)

    if (ext !== path.extname(dest)) {
      log.debug(_`OUTPUT: ${dest}`)
      return log.error(_`The filename extension for the output should be '${ext}', got '${path.extname(dest)}' instead`)
    }
  }

  await cmd(origin, dest, log).catch(console.error)

  log.info(_`Done.`)
}

module.exports = make
