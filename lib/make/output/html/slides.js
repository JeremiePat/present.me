const fs = require(`fs-extra`)
const njk = require(`nunjucks`)
const path = require(`path`)
const files = require(`../../files`)
const _ = require(`../../../l10n`)

const REVEAL_TPL = `revealjs.njk`
const TPL_DIR = path.resolve(__dirname, `..`, `..`, `..`, `..`, `tpl`)
const filters = require(path.join(TPL_DIR, `filters`))

/**
 * HTML Slide commande
 *
 * @param {string} src The path to the source folder to use
 * @param {string} dest The path to the output file to generate
 * @param {object} theme A theme object to customize the output
 */
async function cmd (src, dest, theme) {
  process.logger.debug.sep()
  process.logger.debug(_`Running HTML slide commande`)

  const env = njk.configure([TPL_DIR, src], { autoescape: false })
  Object.entries(filters).forEach(([name, fn]) => {
    env.addFilter(name, fn)
  })

  const { md } = await files(src)

  process.logger.debug.sep()
  process.logger.debug.info(_`Rendering Nunjucks template:`)
  process.logger.debug.warn(path.join(TPL_DIR, REVEAL_TPL))
  const html = njk.render(REVEAL_TPL, {
    ...theme.config,
    files: md,
    css: theme.css
  })

  process.logger.debug.sep()
  process.logger.debug.info(_`Creating file:`)
  process.logger.debug.warn(dest)
  await fs.outputFile(dest, html)
}

// ----------------------------------------------------------------------------
module.exports = cmd
