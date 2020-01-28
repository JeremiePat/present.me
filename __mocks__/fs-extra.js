const fsx = jest.genMockFromModule(`fs-extra`)

fsx.__FILES = {}

fsx.pathExists = async function pathExists (file) {
  return Object.prototype.hasOwnProperty.call(fsx.__FILES, file)
}

module.exports = fsx
