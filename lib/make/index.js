require(`dotenv`).config()

const { logger } = require(`../log`)
const { move } = require(`fs-extra`)
const path = require(`path`)
const exec = require(`../exec`)
const outputFormat = require(`./output`)
const files = require(`./files`)
const _ = require(`../l10n`)

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
  const log = logger(options)
  const { ext, cmd } = outputFormat[format] || outputFormat[`html/slides`]
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
}

module.exports = make
