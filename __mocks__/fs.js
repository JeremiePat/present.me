const fs = jest.genMockFromModule(`fs`)

fs.__DIRECTORIES = {}

function readdir (path, options) {
  if (!fs.__DIRECTORIES[path]) {
    return Promise.reject(new Error(`Unkown path: ${path}`))
  }

  return fs.__DIRECTORIES[path].map(obj => ({ ...obj }))
}

fs.promises = { readdir }

module.exports = fs
