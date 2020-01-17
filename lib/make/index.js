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

  log.info(_(`Creating a %s document out of '%s'`, format, src))

  const origin = path.resolve(src)
  log.debug(_(`ORIGIN: %s`, origin))

  if (!outputFormat[format]) {
    return log.error(`${format} format unknown.`)
  }

  const { ext, cmd } = outputFormat[format]

  let dest = path.join(origin, `${path.basename(origin)}${ext}`)
  if (options.output) {
    dest = path.resolve(options.output)

    if (ext !== path.extname(dest)) {
      log.debug(_(`OUTPUT: %s`, dest))
      return log.error(_(`The filename extension for the output should be '%s', got '%s' instead`, ext, path.extname(dest)))
    }
  }

  await cmd(origin, dest, log).catch(console.error)

  log.info(_(`Done.`))
}

module.exports = make
