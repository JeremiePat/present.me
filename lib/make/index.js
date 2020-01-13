require('dotenv').config()

const { logger } = require('../log')
const { move } = require('fs-extra')
const path = require('path')
const exec = require('../exec')
const outputFormat = require('./output')
const files = require('./files')

function makeBin (src) {
  if (process.env.PME_MAKE_MODE === 'REMOTE') {
    return [
      'docker run',
      '--rm',
      `--mount type=bind,source=${path.resolve('pandoc')},target=/root/.pandoc,readonly`,
      `-v ${path.resolve(src)}:/src`,
      '-w /src',
      // '--user `id -u`:`id -g`',
      '-t presentme'
      // 'pandoc'
    ].join(' ')
  } else {
    process.chdir(src)
    return 'pandoc'
  }
}

async function make (src, format, options) {
  const log = logger(options)
  const { ext, cmd } = outputFormat[format] || outputFormat['html/slides']
  const dest = path.basename(path.resolve(src)) + ext
  let output = dest

  log.info(`Creating a ${format in outputFormat ? format : 'html/slides'} document out of '${src}'`)

  if (options.output) {
    output = path.resolve(options.output)

    if (ext !== path.extname(output)) {
      log.debug(`OUTPUT: ${output}`)
      return log.error(`The filename extension for the output should be '${ext}', got '${path.extname(output)}' instead`)
    }
  }

  const pandocBin = makeBin(src)
  const { content } = files(src, log)
  if (!content) { return }

  await exec(cmd(pandocBin, content, dest), options)

  if (output !== dest) {
    const origin = path.resolve(src, dest)
    log.info(`Creating file: ${options.output}`)
    log.debug('Moving output file:')
    log.debug(`FROM: ${origin}`)
    log.debug(`TO: ${output}`)

    await move(origin, output, { overwrite: true })
      .catch(err => log.error(err.message))
  }
}

module.exports = make
