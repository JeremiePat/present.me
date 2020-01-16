const fs = require(`fs-extra`)
const njk = require(`nunjucks`)
const path = require(`path`)

njk.configure(`/`, {
  autoescape: false
})

const tpl = path.resolve(__dirname, `..`, `..`, `..`, `..`, `tpl`, `revealjs.njk`)

async function cmd (files, dest) {
  const html = njk.render(tpl, {
    files
  })

  await fs.outputFile(dest, html)
}

module.exports = cmd
