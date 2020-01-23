const fs = require(`fs-extra`)
const path = require(`path`)
const { readdir } = require(`fs`).promises

const make = require(`../make`)
const _ = require(`../l10n`)

const NODE_MODULES = require.resolve(`reveal.js`).replace(/(node_modules).*/, `$1`)

/**
 * Setup operation to prepare a safe root folder for serving
 *
 * @param {string} src The original source folder
 * @param {string} www The target dirtory that will be used as the root folder
 * @param {object} options some options tp handle
 * @param {Logger} log The logger to log setup info
 * @returns {Promise}
 */
async function setup (src, www, options, log) {
  log.info(_`Preparing data...`)
  log.debug.sep()
  log.debug(_`Symlink source files:`)
  log.debug.warn(_`FROM: ${src}`)
  log.debug.warn(_`TO:   ${www}`)
  await fs.emptyDir(www)

  const files = await readdir(src)
  log.debug(files)

  await Promise.all(files
    .map(file => fs
      .ensureSymlink(path.join(src, file), path.join(www, file))
    )
  )

  if (options.theme && fs.existsSync(path.resolve(options.theme))) {
    log.debug(`Symlink custom theme:`)
    log.debug.warn(_`FROM: ${path.resolve(options.theme)}`)
    log.debug.warn(_`TO:   ${path.join(www, `theme`)}`)

    // We want to unlink the theme folder if it exists in order
    // to replace it with the one define through the options
    await fs.remove(path.join(www, `theme`))

    // And we link the new one
    await fs.ensureSymlink(path.resolve(options.theme), path.join(www, `theme`))
  }

  log.debug.dim(_`Symlink reveal.js`)
  await fs.ensureSymlink(path.join(NODE_MODULES, `reveal.js`), path.join(www, `reveal.js`))

  log.info(_`Setting up slidedeck...`)
  await make(www, {
    output: path.resolve(www, `index.html`),
    format: `html/slides`,
    theme: path.join(www, `theme`),
    debug: options.debug
  })
}

// ----------------------------------------------------------------------------
module.exports = setup
