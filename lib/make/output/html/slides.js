const fs = require(`fs-extra`)
const njk = require(`nunjucks`)
const path = require(`path`)
const files = require(`../../files`)
const _ = require(`../../../l10n`)

const tpl = `revealjs.njk`
const tplDir = path.resolve(__dirname, `..`, `..`, `..`, `..`, `tpl`)
const filters = require(path.join(tplDir, `filters`))

async function cmd (src, dest, theme) {
  process.logger.debug.sep()
  process.logger.debug(_`Running HTML slide commande`)

  const env = njk.configure([tplDir, src], { autoescape: false })
  Object.entries(filters).forEach(([name, fn]) => {
    env.addFilter(name, fn)
  })

  const { md } = await files(src)

  process.logger.debug.sep()
  process.logger.debug.info(_`Rendering Nunjucks template:`)
  process.logger.debug.warn(path.join(tplDir, tpl))
  const html = njk.render(tpl, {
    ...theme.config,
    files: md,
    css: theme.css
  })

  process.logger.debug.sep()
  process.logger.debug.info(_`Creating file:`)
  process.logger.debug.warn(dest)
  await fs.outputFile(dest, html)
}

module.exports = cmd
