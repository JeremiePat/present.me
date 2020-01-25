const path = require(`path`)
const http = require(`http`)
const open = require(`open`)

const _ = require(`./l10n`)
const make = require(`./make`)

// Basic server utilities
const root = require(`koa-static`)
const Koa = require(`koa`)

/**
 * Main server logic
 *
 * @param {string} folder The folder with the markdown files to serve
 * @param {object} options The option for configuring the server
 * @returns {Promise}
 */
async function server (options = {}) {
  const app = new Koa()
  app.use(root(process.env.PME_FOLDER_SRC))

  await make({
    output: path.join(process.env.PME_FOLDER_SRC, `index.html`),
    format: `html/slides`
  })

  return new Promise((resolve, reject) => {
    const srv = http
      .createServer(app.callback())
      .listen(options.port, (err) => {
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

// ----------------------------------------------------------------------------
module.exports = server
