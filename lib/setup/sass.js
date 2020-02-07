const _ = require(`../l10n`)
const path = require(`path`)
const { outputFile } = require(`fs-extra`)

function getSassModule () {
  try {
    // Trying to require the 'sass' module
    return require(`sass`)
  } catch (e) {
    process.logger.debug.warn(e.message)
  }

  try {
    // Trying to require the 'node-sass' module
    return require(`node-sass`)
  } catch (e) {
    process.logger.debug.warn(e.message)
  }

  return {}
}

async function compile (files) {
  if (files.length === 0) { return }

  const includePaths = [path.join(process.env.STUFF_FOLDER_REVEAL, `css`, `theme`, `template`)]
  const { renderSync } = getSassModule()

  if (!renderSync) {
    return process.logger.error(
      _`Unable to compile Sass files`,
      _`You need to install Sass to compile your theme Sass files`
    )
  }

  const writeFiles = files.map(async file => {
    // As per the sass module doc, async render is stupidely slow.
    // https://github.com/sass/dart-sass#javascript-api
    // So we are performing a synchronous rendering, while we are
    // writing the resulting file asynchronously. As it is in an
    // async function it should mitigate (to be confirmed) the problem
    // of the synchronous rendering without the need to use fiber.
    const css = renderSync({ file, includePaths }).css
    const dest = file.replace(/\.s[ac]ss$/, `.css`)
    await outputFile(dest, css)
  })

  await Promise.all(writeFiles)
}

// ----------------------------------------------------------------------------
module.exports = compile
