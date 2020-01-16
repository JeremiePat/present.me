const path = require(`path`)

const _ = require(`../l10n`)
const files = require(`./files`)
const Logger = require(`../log`)

const outputFormat = {
  // 'html': { ext: `.html`, cmd: require('./output/html') },
  'html/slides': { ext: `.html`, cmd: require(`./output/html/slides`) }
  // 'pdf': { ext: `.pdf`, cmd: require('./output/pdf') },
  // 'pdf/slides': { ext: `.pdf`, cmd: require('./output/pdf/slides') },
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

  const { ext, cmd } = outputFormat[format]
  if (!ext || !cmd) {
    return log.error(`${format} format unknown.`)
  }

  let dest = path.join(origin, `${path.basename(origin)}${ext}`)
  if (options.output) {
    dest = path.resolve(options.output)

    if (ext !== path.extname(dest)) {
      log.debug(_(`OUTPUT: %s`, dest))
      return log.error(_(`The filename extension for the output should be '%s', got '%s' instead`, ext, path.extname(dest)))
    }
  }

  const { md } = await files(src, log)

  await cmd(md.map(s => path.resolve(src, s)), dest).catch(err => console.error(err.message))

  log.info(_(`Done.`))
}

module.exports = make
