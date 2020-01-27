const _ = require(`./l10n`)
const path = require(`path`)
const pack = require(`./make/pack`)
const { remove } = require(`fs-extra`)

const outputFormat = {
  // 'html': { ext: `.html`, create: require('./make/output/html') },
  'html/slides': { ext: `.html`, create: require(`./make/output/html/slides`) },
  // 'pdf': { ext: `.pdf`, create: require('./make/output/pdf') },
  'pdf/slides': { ext: `.pdf`, create: require(`./make/output/pdf/slides`) }
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

  const { ext, create } = outputFormat[format]
  const dest = path.resolve(options.output).replace(/\.___$/, ext)

  if (ext !== path.extname(dest)) {
    process.logger.debug.warn(_`OUTPUT: ${dest}`)
    return process.logger.fatal(_`The filename extension for the output should be '${ext}', got '${path.extname(dest)}' instead`)
  }

  await create(dest)

  if (options.pack) {
    if (!pack[options.pack]) {
      process.logger.error(_`Unknown pack format: ${options.pack}`)
      process.logger.error(_`Expect any of: ${Object.keys(pack).join(`, `)}`)
      return
    }

    if (ext === `.pdf`) {
      await pack[options.pack](dest, dest)
    } else {
      await pack[options.pack](process.env.PME_FOLDER_SRC, dest)
    }

    await remove(dest)
  }
}

module.exports = make
