const os = require(`os`)
const path = require(`path`)
const http = require(`http`)
const open = require(`open`)

const _ = require(`./l10n`)
const setup = require(`./serve/setup`)
const cleanup = require(`./serve/cleanup`)

const ROOT_DIR = path.join(os.tmpdir(), `pme-www`)

// Basic server utilities
const root = require(`koa-static`)
const Koa = require(`koa`)
const app = new Koa()

/**
 * Main server logic
 *
 * @param {string} folder The folder with the markdown files to serve
 * @param {object} options The option for configuring the server
 * @returns {Promise}
 */
async function server (folder, options = {}) {
  folder = path.resolve(folder || `.`)

  await setup(folder, ROOT_DIR, options)
  app.use(root(ROOT_DIR))

  // Handle Ctrl+C
  process.on(`SIGINT`, () => cleanup(ROOT_DIR))
  // process.on(`SIGQUIT`, () => cleanup(log, options))

  // Handle terminal being closed and other term signals
  process.on(`SIGHUP`, () => cleanup(ROOT_DIR))
  // process.on(`SIGTERM`, () => cleanup(log, options))

  return new Promise((resolve, reject) => {
    const srv = http.createServer(app.callback()).listen(options.port, (err) => {
      if (err) { return reject(err) }

      const port = srv.address().port
      process.logger.info(_`Access your slides at: http://localhost:${port}`)

      if (options.browser) {
        open(`http://localhost:${port}`)
      }

      // TODO: Use the 'open' package to launch browser automaticaly?
      resolve(port)
    })
  })
}

module.exports = server
