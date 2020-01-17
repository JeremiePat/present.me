const os = require(`os`)
const fs = require(`fs-extra`)
const path = require(`path`)

const _ = require(`../l10n`)
const make = require(`../make`)
const Logger = require(`../log`)

const tmpDir = path.join(os.tmpdir(), `pme-www`)

// Basic server utilities
const server = require(`koa-static`)
const Koa = require(`koa`)
const app = new Koa()

const nm = require.resolve(`reveal.js`).replace(/(node_modules).*/, `$1`)

/**
 * Setup operation to prepare a safe root folder for serving
 */
async function setup (src, log, options) {
  log.info(_(`Preparing data...`))
  log.debug(_(`Copy source files:`))
  log.debug(_(`FROM: %s`, src))
  log.debug(_(`TO: %s`, tmpDir))
  await fs.emptyDir(tmpDir)
  await fs.copy(src, tmpDir)

  log.debug(_(`Symlink reveal.js`))
  await fs.ensureSymlink(path.join(nm, `reveal.js`), path.join(tmpDir, `reveal.js`))

  const output = path.resolve(tmpDir, `index.html`)

  log.info(_(`Setting up slidedeck...`))
  log.debug(_(`OUTPUT: %s`, output))
  await make(tmpDir, `html/slides`, { output, debug: options.debug })

  app.use(server(tmpDir))
}

/**
 * Cleanup operation for when the server is shut down
 *
 * It worth noticing that calling this function will end the current process.
 *
 * @param {string} output The slidedeck path to be removed on cleanup
 * @param {object} log The logger to log cleanup info
 * @param {object} options The options object to know how much verbose we should be
 */
async function cleanup (log, options) {
  if (!log.overwrite) {
    log.nl()
  }

  log.info(_(`Cleanup before exit...`))
  await fs.remove(tmpDir)
  log.clear()

  if (!log.overwrite) {
    log.info(_(`Done.`))
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
  folder = path.resolve(folder || `.`)

  const log = new Logger({
    overwrite: !options.debug && !options.verbose,
    verbose: options.debug ? Logger.VERBOSITY_DEBUG : Logger.VERBOSITY_TALKING
  })

  await setup(folder, log, options)

  // Handle Ctrl+C
  process.on(`SIGINT`, () => cleanup(log, options))

  // Handle terminal being closed
  process.on(`SIGHUP`, () => cleanup(log, options))

  log.info(_(`Access your slides at: http://localhost:%s`, options.port))
  app.listen(options.port || 8888)

  // TODO: Use the 'open' package to launch browser automaticaly?
}

module.exports = serve
