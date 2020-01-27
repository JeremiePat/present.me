const { readdir } = require(`fs`).promises
const path = require(`path`)

/**
 * Read a folder and its subfolders recursively
 *
 * @param {string} folder The folder or subfolder to read
 * @param {string} prefix The relative path to the initial parent folder
 * @returns {Promise<Array>} A Promise providing a list of fs.Dirent objects
 */
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

// ----------------------------------------------------------------------------
// PUBLIC API
// ----------------------------------------------------------------------------

/**
 * Provide a list of all the files of a folder and its subfolders.
 *
 * Files from subfolders are provide as a path relative to the initial folder.
 * If files are return as fs.Dirent objects, the `name`'s value will be that
 * relative path.
 *
 * Note that the options are the same as those defined for the readdir
 * function provide in the File System module:
 * https://nodejs.org/api/fs.html#fs_fspromises_readdir_path_options
 *
 * @param {string} folder The path to the folder to read
 * @param {object} options Standard readdir option object
 */
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
