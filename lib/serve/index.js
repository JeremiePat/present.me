const os = require(`os`)
const fs = require(`fs-extra`)
const path = require(`path`)
const http = require(`http`)
const open = require(`open`)
const { readdir } = require(`fs`).promises

const _ = require(`../l10n`)
const make = require(`../make`)
const Logger = require(`../log`)

const tmpDir = path.join(os.tmpdir(), `pme-www`)

// Basic server utilities
const root = require(`koa-static`)
const Koa = require(`koa`)
const app = new Koa()

const nm = require.resolve(`reveal.js`).replace(/(node_modules).*/, `$1`)

/**
 * Setup operation to prepare a safe root folder for serving
 *
 * @param {string} src The original source folder
 * @param {Logger} log The logger to log setup info
 * @param {object} options some options tp handle
 * @returns {Promise}
 */
async function setup (src, log, options) {
  log.info(_`Preparing data...`)
  log.debug.sep()
  log.debug(_`Symlink source files:`)
  log.debug.warn(_`FROM: ${src}`)
  log.debug.warn(_`TO:   ${tmpDir}`)
  await fs.emptyDir(tmpDir)

  const files = await readdir(src)
  log.debug(files)

  await Promise.all(files
    .map(file => fs
      .ensureSymlink(path.join(src, file), path.join(tmpDir, file))
    )
  )

  if (options.theme && fs.existsSync(options.theme)) {
    log.debug(`Symlink custom theme:`)
    log.debug.warn(_`FROM: ${options.theme}`)
    log.debug.warn(_`TO:   ${path.join(tmpDir, `theme`)}`)
    fs.ensureSymlink(options.theme, path.join(tmpDir, `theme`))
  }

  log.debug.dim(_`Symlink reveal.js`)
  await fs.ensureSymlink(path.join(nm, `reveal.js`), path.join(tmpDir, `reveal.js`))

  log.info(_`Setting up slidedeck...`)
  await make(tmpDir, {
    output: path.resolve(tmpDir, `index.html`),
    format: `html/slides`,
    theme: options.theme,
    debug: options.debug
  })

  app.use(root(tmpDir))
}

/**
 * Cleanup operation for when the server is shut down
 *
 * It worth noticing that calling this function will end the current process.
 *
 * @param {object} log The logger to log cleanup info
 * @returns {Promise}
 */
async function cleanup (log) {
  if (!log.overwrite) {
    log.nl()
  }

  log.info(_`Cleanup before exit...`)
  await fs.remove(tmpDir)
  log.clear()

  if (!log.overwrite) {
    log.info(_`Done.`)
  }

  process.exit()
}

/**
 * Main server logic
 *
 * @param {string} folder The folder with the markdown files to serve
 * @param {object} options The option for configuring the server
 * @returns {Promise}
 */
async function server (folder, options = {}) {
  folder = path.resolve(folder || `.`)

  const log = options.log || new Logger({
    overwrite: !options.debug && !options.verbose,
    verbose: options.debug ? Logger.VERBOSITY_DEBUG : Logger.VERBOSITY_TALKING
  })

  await setup(folder, log, options)

  // Handle Ctrl+C
  process.on(`SIGINT`, () => cleanup(log, options))
  // process.on(`SIGQUIT`, () => cleanup(log, options))

  // Handle terminal being closed and other term signals
  process.on(`SIGHUP`, () => cleanup(log, options))
  // process.on(`SIGTERM`, () => cleanup(log, options))

  return new Promise((resolve, reject) => {
    const srv = http.createServer(app.callback()).listen(options.port, (err) => {
      if (err) { return reject(err) }

      const port = srv.address().port
      log.info(_`Access your slides at: http:// localhost:${port}`)

      if (options.browser) {
        open(`http://localhost:${port}`)
      }

      // TODO: Use the 'open' package to launch browser automaticaly?
      resolve(port)
    })
  })
}

module.exports = server
