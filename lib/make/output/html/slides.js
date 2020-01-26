const _ = require(`../../../l10n`)
const is = require(`../../../utils/is`)
const njk = require(`nunjucks`)
const path = require(`path`)
const config = require(`../../config`)
const { readdir } = require(`fs`).promises
const { outputFile, ensureLink } = require(`fs-extra`)

const REVEAL_TPL = `revealjs.njk`
const TPL_DIR = path.resolve(__dirname, `..`, `..`, `..`, `..`, `tpl`)
const filters = require(path.join(TPL_DIR, `filters`))

/**
 * HTML Slide commande
 *
 * @param {string} dest The path to the output file to generate
 */
async function cmd (dest) {
  const SRC_DIR = process.env.PME_FOLDER_SRC
  const THEME_DIR = process.env.PME_FOLDER_THEME

  process.logger.debug.sep()
  process.logger.debug(_`Generating HTML sildes...`)

  const env = njk.configure([
    TPL_DIR,
    SRC_DIR
  ], { autoescape: false })

  Object.entries(filters).forEach(([name, fn]) => {
    env.addFilter(name, fn)
  })

  const files = (await readdir(SRC_DIR)).filter(is.file.markdown)
  const css = (await readdir(THEME_DIR)).filter(is.file.css)

  const userConfig = await config()

  process.logger.debug.sep()
  process.logger.debug.info(_`Rendering Nunjucks template:`)
  process.logger.debug.warn(path.join(TPL_DIR, REVEAL_TPL))
  const html = njk.render(REVEAL_TPL, {
    ...userConfig,
    files,
    css
  })

  process.logger.debug.sep()
  process.logger.debug.info(_`Creating file:`)
  process.logger.debug.warn(dest)
  await outputFile(dest, html)
  await ensureLink(dest, path.join(process.env.PME_FOLDER_SRC, path.basename(dest)))
}

// ----------------------------------------------------------------------------
module.exports = cmd
