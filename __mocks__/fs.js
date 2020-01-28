const fs = jest.genMockFromModule(`fs`)

fs.__FILES = {}
fs.__DIRECTORIES = {}

function readdir (path, options) {
  if (!fs.__DIRECTORIES[path]) {
    return Promise.reject(new Error(`Unkown path: ${path}`))
  }

  return fs.__DIRECTORIES[path].map(obj => ({ ...obj }))
}

function readFile (path, options) {
  if (!fs.__FILES[path]) {
    return Promise.reject(new Error(`Unkown path: ${path}`))
  }

  if (options) {
    const encoding = options.encoding || options
    return Promise.resolve(fs.__FILES[path].toString(encoding))
  }

  return Promise.resolve(fs.__FILES[path])
}

function writeFile (path, data) {
  fs.__FILES[path] = Buffer.from(data)
}

fs.promises = { readFile, writeFile, readdir }

module.exports = fs
