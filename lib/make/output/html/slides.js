const fs = require(`fs-extra`)
const njk = require(`nunjucks`)
const path = require(`path`)
const files = require(`../../files`)
const _ = require(`../../../l10n`)

const tplDir = path.resolve(__dirname, `..`, `..`, `..`, `..`, `tpl`)
const tpl = `revealjs.njk`

async function cmd (src, dest, log) {
  log.debug.sep()
  log.debug(_`Running HTML slide commande`)
  njk.configure([tplDir, src], { autoescape: false })

  const { md } = await files(src, log)

  log.debug.sep()
  log.debug.info(_`Rendering Nunjucks template:`)
  log.debug.warn(path.join(tplDir, tpl))
  const html = njk.render(tpl, {
    files: md
  })

  log.debug.sep()
  log.debug.info(_`Creating file:`)
  log.debug.warn(dest)
  await fs.outputFile(dest, html)
}

module.exports = cmd
