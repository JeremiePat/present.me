jest.mock(`fs`)

const fs = require(`fs`)
const readDirDeep = require(`../readDirDeep`)

const ISTRUE = () => true
const ISFALSE = () => false

// Let's mock a directory structure and some fake fs.Dirent object
fs.__DIRECTORIES = {
  'my/test/path': [
    { name: `file.txt`, isDirectory: ISFALSE },
    { name: `anotherfile.txt`, isDirectory: ISFALSE },
    { name: `subdir`, isDirectory: ISTRUE },
    { name: `emptysubdir`, isDirectory: ISTRUE }
  ],
  'my/test/path/subdir': [
    { name: `asubfile.md`, isDirectory: ISFALSE }
  ],
  'my/test/path/emptysubdir': []
}

describe(`utils::readDirDeep`, () => {
  test(`readDirDeep(string)`, async () => {
    const result = await readDirDeep(`my/test/path`)
    expect(result).toEqual([
      `file.txt`,
      `anotherfile.txt`,
      `subdir/asubfile.md`
    ])
  })

  test(`readDirDeep(string, 'base64')`, async () => {
    const result = await readDirDeep(`my/test/path`, `base64`)
    expect(result).toEqual([
      Buffer.from(`file.txt`).toString(`base64`),
      Buffer.from(`anotherfile.txt`).toString(`base64`),
      Buffer.from(`subdir/asubfile.md`).toString(`base64`)
    ])
  })

  test(`readDirDeep(string, { encoding: 'utf8' })`, async () => {
    const result = await readDirDeep(`my/test/path`, { encoding: `utf8` })
    expect(result).toEqual([
      `file.txt`,
      `anotherfile.txt`,
      `subdir/asubfile.md`
    ])
  })

  test(`readDirDeep(string, { encoding: 'buffer' })`, async () => {
    const result = await readDirDeep(`my/test/path`, { encoding: `buffer` })
    expect(result).toEqual([
      Buffer.from(`file.txt`),
      Buffer.from(`anotherfile.txt`),
      Buffer.from(`subdir/asubfile.md`)
    ])
  })

  test(`readDirDeep(string, { withFileTypes: true })`, async () => {
    const result = await readDirDeep(`my/test/path`, { withFileTypes: true })
    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ name: `file.txt`, isDirectory: ISFALSE })
    expect(result).toContainEqual({ name: `anotherfile.txt`, isDirectory: ISFALSE })
    expect(result).toContainEqual({ name: `subdir/asubfile.md`, isDirectory: ISFALSE })
  })
})
