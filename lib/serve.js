const _ = require(`./l10n`)
const http = require(`http`)
const make = require(`./make`)
const open = require(`open`)
const path = require(`path`)

// Basic server utilities
const root = require(`koa-static`)
const Koa = require(`koa`)

/**
 * Main server logic
 *
 * @param {object} options The option to configue the server
 * @returns {Promise}
 */
async function server (options = {}) {
  // Set up our basic static server
  const app = new Koa()
  app.use(root(process.env.STUFF_FOLDER_SRC))

  // We make sure that we have a document to serve
  await make({
    output: path.join(process.env.STUFF_FOLDER_SRC, `index.html`),
    format: `html/slides`
  })

  // Because http.createServer doesn't provide a Promise based API
  // we return our own Promise to react to the listen callback.
  return new Promise((resolve, reject) => {
    const srv = http
      .createServer(app.callback())
      .listen(options.port, (err) => {
        if (err) { return reject(err) }

        // We need to use http.createServer in order to be able to get back
        // the port used by our server (especially if the port hasn't been
        // set explicitely, we have to log it back to the user.).
        // Koa cannot do this out of the box
        const port = srv.address().port
        process.logger.info(_`Access your slides at: http://localhost:${port}`)

        if (options.browser) {
          open(`http://localhost:${port}`)
        }

        // When we used a headless browser to generate a PDF document, we
        // need to get back the port to let the headless browser know where
        // to navigate.
        resolve(port)
      })
  })
}

// ----------------------------------------------------------------------------
module.exports = server
