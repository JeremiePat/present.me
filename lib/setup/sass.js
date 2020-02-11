const _ = require(`../l10n`)
const path = require(`path`)
const { outputFile } = require(`fs-extra`)

function getModule (name) {
  try {
    return require(name)
  } catch (e) {
    process.logger.debug.warn(e.message)
  }
}

function getSassModule () {
  if (process.env.STUFF_THEME_MODULES) {
    return getModule(path.join(process.env.STUFF_THEME_MODULES, `sass`)) ||
      getModule(path.join(process.env.STUFF_THEME_MODULES, `node-sass`)) ||
      getModule(`sass`) || getModule(`node-sass`) || {}
  }

  return getModule(`sass`) || getModule(`node-sass`) || {}
}

async function compile (files) {
  if (files.length === 0) { return }

  const includePaths = [path.join(process.env.STUFF_FOLDER_REVEAL, `css`, `theme`, `template`)]
  const { renderSync } = getSassModule()

  if (!renderSync) {
    return process.logger.fatal(
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
