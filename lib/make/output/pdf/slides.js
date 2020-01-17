const _ = require(`../../../l10n`)
const Logger = require(`../../../log`)
const puppeteer = require(`puppeteer`)

const RENDERING_PORT = 9119
const PDF_CONFIG = {
  printBackground: true,
  landscape: true,
  format: `A4`,
  preferCSSPageSize: true
}

async function cmd (src, dest, log) {
  log.debug(_`Running PDF slide commande`)
  const server = require(`../../../serve`)

  log.debug(_`Start HTML server on port ${RENDERING_PORT}`)
  await server(src, {
    port: RENDERING_PORT,
    log: Logger.get({
      verbose: log.verbose === Logger.VERBOSITY_DEBUG
        ? Logger.VERBOSITY_DEBUG : Logger.VERBOSITY_SILENT
    })
  })

  log.debug(_`Launch headless browser`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const url = `http://localhost:${RENDERING_PORT}/?print-pdf`
  log.debug(_`Access HTML slides:`)
  log.debug(url)
  await page.goto(url, { waitUntil: `networkidle2` })

  log.debug(_`Creating file:`)
  log.debug(dest)
  log.debug(PDF_CONFIG)
  await page.pdf({
    path: dest,
    ...PDF_CONFIG
  })

  log.debug(_`Close headless browser`)
  await browser.close()

  log.info(_`Done.`)
  process.exit(0)
}

module.exports = cmd
