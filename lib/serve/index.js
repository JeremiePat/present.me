const path = require(`path`)
const { remove } = require(`fs-extra`)
const { logger, overwrite } = require(`../log`)
const make = require(`../make`)
const _ = require(`../l10n`)

// Basic server utilities
// TODO: Is koa-static really needed?
const server = require(`koa-static`)
const Koa = require(`koa`)
const app = new Koa()

/**
 * Cleanup operation for when the server is shut down
 *
 * It worth noticing that calling this function will end the current process.
 *
 * @param {string} output The slidedeck path to be removed on cleanup
 * @param {object} log The logger to log cleanup info
 * @param {object} options The options object to know how much verbose we should be
 */
async function cleanup (output, log, options) {
  if (options.debug || options.verbose) {
    log.nl()
  }

  log.info(_(`Cleanup before exit...`))
  await remove(output)
  log.info(_(`All done, bye!`))

  if (!options.debug && !options.verbose) {
    log.nl()
  }

  process.exit()
}

/**
 * Main server logic
 *
 * @param {string} folder The folder with the markdown files to serve
 * @param {object} options The option for configuring the server
 */
async function serve (folder, options) {
  const log = options.debug || options.verbose ? logger(options) : overwrite({ verbose: true })

  // TODO: Maybe it would be better to serve that file from os.tmpdir()
  const output = path.resolve(folder, `index.html`)

  log.info(_(`Setting up slidedeck...`))
  await make(folder, `html/slides`, { ...options, output })

  app.use(server(folder))

  // Handle Ctrl+C
  process.on(`SIGINT`, () => cleanup(output, log, options))

  // Handle terminal behing closed
  process.on(`SIGHUP`, () => cleanup(output, log, options))

  log.info(_(`Access your slides at: http://localhost:%s`, options.port))
  app.listen(options.port || 8888)

  // TODO: Use the 'open' package to launch browser automaticaly?
}

module.exports = serve
