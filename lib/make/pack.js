const _ = require(`../l10n`)
const is = require(`../utils/is`)
const path = require(`path`)
const archiver = require(`archiver`)
const readDirDeep = require(`../utils/readDirDeep`)
const { createWriteStream } = require(`fs`)

const ZLIB_OPTIONS = {
  level: 9
}

const OPTIONS = {
  zip: {
    zlib: ZLIB_OPTIONS
  },

  tar: {
    gzip: true,
    gzipOptions: ZLIB_OPTIONS
  }
}

/**
 * Create an archive based on source (Folder or file)
 *
 * @param {string} src The path to the source to compress
 * @param {string} dest The path to the archive to produce
 * @param {string} format The compression format to use
 */
function pack (src, dest, format) {
  return new Promise((resolve, reject) => {
    process.logger.debug.sep()
    process.logger.info(_`Create a new archive...`)

    const output = createWriteStream(dest)

    output.on(`close`, () => {
      process.logger.info(_`Compressed archive done.`)
      process.logger.debug.warn(dest)
      resolve(dest)
    })

    const archive = archiver(format, OPTIONS[format])

    archive.on(`error`, reject)
    archive.on(`entry`, data => {
      process.logger.debug.dim(data.name)
    })
    archive.on(`warning`, err => {
      if (err.code === `ENOENT`) {
        process.logger.debug.warn(err.message)
      } else {
        reject(err)
      }
    })
    archive.pipe(output)

    function isDir (files) {
      return files.map(name => [path.join(src, name), { name }])
    }

    function isFile () {
      return [[src, { name: path.basename(src) }]]
    }

    readDirDeep(src)
      .then(isDir, isFile)
      .then(files => files
        .forEach(file => {
          if (!is.file.hidden(path.basename(file[0]))) {
            archive.file(...file)
          }
        }))
      .then(() => archive.finalize())
  })
}

// ----------------------------------------------------------------------------
// PUBLIC API
// ----------------------------------------------------------------------------

function zip (src, dest) {
  return pack(src, dest.replace(path.extname(dest) || /$/, `.zip`), `zip`)
}

function tar (src, dest) {
  return pack(src, dest.replace(path.extname(dest) || /$/, `.tar.gz`), `tar`)
}

// ----------------------------------------------------------------------------
module.exports = { zip, tar }
