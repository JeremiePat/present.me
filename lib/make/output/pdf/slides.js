const _ = require(`../../../l10n`)
const Logger = require(`../../../log`)
const puppeteer = require(`puppeteer`)

const PDF_CONFIG = {
  printBackground: true,
  landscape: true,
  format: `A4`,
  preferCSSPageSize: true
}

async function cmd (dest) {
  process.logger.debug.sep()
  process.logger.info(_`Generating PDF sildes...`)
  const server = require(`../../../serve`)

  process.logger.debug.info(_`Start HTML server on any available port`)
  process.logger.debug.sep()

  // We want the server logs to be silent will
  // rendering the PDF, unless we are in debug mode
  const verbose = process.logger.verbose
  process.logger.verbose = verbose === Logger.VERBOSITY_DEBUG
    ? Logger.VERBOSITY_DEBUG : Logger.VERBOSITY_SILENT

  const RENDERING_PORT = await server()

  // restore normal verbose mode for logs
  process.logger.verbose = verbose

  process.logger.debug.sep()
  process.logger.debug.dim(_`Launch headless browser`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const url = `http://localhost:${RENDERING_PORT}/?print-pdf`
  process.logger.debug(_`Access HTML slides:`)
  process.logger.debug.warn(url)
  await page.goto(url, { waitUntil: `networkidle2` })

  process.logger.debug.sep()
  process.logger.debug(_`Creating file:`)
  process.logger.debug.warn(dest)
  process.logger.debug(PDF_CONFIG)
  await page.pdf({
    path: dest,
    ...PDF_CONFIG
  })

  process.logger.debug.sep()
  process.logger.debug.dim(_`Close headless browser`)
  await browser.close()
}

module.exports = cmd
