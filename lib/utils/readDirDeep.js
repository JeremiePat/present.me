const { readdir } = require(`fs`).promises
const path = require(`path`)

async function recursiveReadDir (folder, prefix = ``) {
  const entries = (await readdir(folder, { withFileTypes: true })).map(async entry => {
    if (entry.isDirectory()) {
      const nextFolder = path.join(folder, entry.name)
      const nextPrefix = path.join(prefix, entry.name)
      return recursiveReadDir(nextFolder, nextPrefix)
    } else {
      entry.name = path.join(prefix, entry.name)
      return [entry]
    }
  })

  return (await Promise.all(entries)).flat()
}

async function readDirDeep (folder, options) {
  const entries = await recursiveReadDir(folder)

  if (options && options.withFileTypes) {
    return entries
  }

  if (options) {
    const buffers = entries.map(entry => Buffer.from(entry.name))

    if (options.encoding === `buffer`) {
      return buffers
    }

    return buffers.map(buf => buf.toString(options.encoding || options))
  }

  return entries.map(entry => entry.name)
}

// ----------------------------------------------------------------------------
module.exports = readDirDeep
