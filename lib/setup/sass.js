const _ = require(`../l10n`)
const path = require(`path`)
const { outputFile } = require(`fs-extra`)

async function compile (files) {
  try {
    const { renderSync } = require(`sass`)
    const includePaths = [path.join(process.env.PME_FOLDER_REVEAL, `css`, `theme`, `template`)]

    const writeFiles = files.map(file => {
      const css = renderSync({ file, includePaths }).css
      const dest = file.replace(/\.s[ac]ss$/, `.css`)
      return outputFile(dest, css)
    })

    await Promise.all(writeFiles)
  } catch (e) {
    process.logger.debug.warn(e.message)
    process.logger.error(
      _`Unable to compile Sass files`,
      _`You need to install Sass to compile your theme Sass files`
    )
  }
}

// ----------------------------------------------------------------------------
module.exports = compile
