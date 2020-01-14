require(`dotenv`).config()

const path = require(`path`)
const { move } = require(`fs-extra`)

const _ = require(`../l10n`)
const exec = require(`../exec`)
const files = require(`./files`)
const Logger = require(`../log`)
const outputFormat = require(`./output`)

function makeBin (src) {
  if (process.env.PME_MAKE_MODE === `REMOTE`) {
    return [
      `docker run`,
      `--rm`,
      `--mount type=bind,source=${path.resolve(__dirname, `..`, `..`, `pandoc`)},target=/root/.pandoc,readonly`,
      `-v ${path.resolve(src)}:/src`,
      `-w /src`,
      // '--user `id -u`:`id -g`',
      `-t presentme`
      // 'pandoc'
    ].join(` `)
  } else {
    process.chdir(src)
    return `pandoc`
  }
}

async function make (src, format, options) {
  src = src || `.`
  format = format || `html/slides`

  const log = new Logger({
    verbose: options.debug ? Logger.VERBOSITY_DEBUG
      : options.verbose ? Logger.VERBOSITY_TALKING
        : Logger.VERBOSITY_SILENT
  })

  const { ext, cmd } = outputFormat[format] || outputFormat[`html/slides`]
  // It would worth having a tmp name to avoid deleting the file if 'serve'
  // is call after 'make', or maybe 'serve' should use the existing file
  const dest = path.basename(path.resolve(src)) + ext
  let output = dest

  log.info(_(`Creating a %s document out of '%s'`, format in outputFormat ? format : `html/slides`, src))

  if (options.output) {
    output = path.resolve(options.output)

    if (ext !== path.extname(output)) {
      log.debug(_(`OUTPUT: %s`, output))
      return log.error(_(`The filename extension for the output should be '%s', got '%s' instead`, ext, path.extname(output)))
    }
  }

  const pandocBin = makeBin(src)
  const { content } = await files(src, log)
  if (!content) { return }

  await exec(cmd(pandocBin, content, dest), options)

  if (output !== dest) {
    const origin = path.resolve(src, dest)
    log.info(_(`Creating file: %s`, options.output))
    log.debug(_(`Moving output file:`))
    log.debug(_(`FROM: %s`, origin))
    log.debug(_(`TO: %s`, output))

    await move(origin, output, { overwrite: true })
      .catch(err => log.error(err.message))
  }

  log.info(_(`Done.`))
}

module.exports = make
