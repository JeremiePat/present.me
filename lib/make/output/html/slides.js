const _ = require(`../../../l10n`)
const is = require(`../../../utils/is`)
const njk = require(`nunjucks`)
const path = require(`path`)
const config = require(`../../config`)
const { readdir } = require(`fs`).promises
const { outputFile } = require(`fs-extra`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `..`, `..`, `theme`)
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
  const themeFiles = await readdir(THEME_DIR)
  const css = themeFiles.filter(is.file.css)
  const yml = themeFiles.filter(is.file.yaml)

  const userConfig = await config([
    path.join(DEFAULT_THEME_FOLDER, `config.yaml`),
    ...yml.map(file => path.join(THEME_DIR, file))
  ])

  process.logger.debug.sep()
  process.logger.debug.info(_`Configuration:`)
  process.logger.debug(userConfig)

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
}

// ----------------------------------------------------------------------------
module.exports = cmd
