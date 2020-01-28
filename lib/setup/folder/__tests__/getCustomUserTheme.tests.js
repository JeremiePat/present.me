jest.mock(`fs-extra`)

const path = require(`path`)
const fsx = require(`fs-extra`)

process.env.LANG = `en`
process.logger = {
  debug: () => {},
  info: jest.fn()
}
process.logger.debug.info = jest.fn()
process.logger.debug.warn = jest.fn()

const getCustomUserTheme = require(`../getCustomUserTheme`)

describe(`setup::folder::getCustomeUserTheme`, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test(`getCustomUserTheme()`, async () => {
    const theme = await getCustomUserTheme()
    expect(theme).toBe(null)
  })

  test(`getCustomUserTheme(npmModuleName) // Module folder`, async () => {
    const theme = await getCustomUserTheme(`my-theme`)
    // expect(theme).toBe(null)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`"my-theme" has been installed through NPM`)
    expect(process.logger.info).toHaveBeenCalledWith(`"my-theme" a theme by me me me`)
    expect(process.logger.info).toHaveBeenCalledWith(`This is awesome`)
    expect(theme).toBe(path.join(__dirname, `my-theme`))
  })

  test(`getCustomUserTheme(npmModuleName) // theme folder`, async () => {
    const themeDir = path.join(__dirname, `my-theme`, `theme`)
    fsx.__FILES = {
      [themeDir]: ``
    }

    const theme = await getCustomUserTheme(`my-theme`)
    // expect(theme).toBe(null)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`"my-theme" has been installed through NPM`)
    expect(process.logger.info).toHaveBeenCalledWith(`"my-theme" a theme by me me me`)
    expect(process.logger.info).toHaveBeenCalledWith(`This is awesome`)
    expect(theme).toBe(themeDir)
  })

  test(`getCustomUserTheme(npmModuleName) // directories.theme`, async () => {
    const foo = path.join(__dirname, `my-theme-dir`, `foo`)
    fsx.__FILES = {
      [foo]: ``
    }

    const theme = await getCustomUserTheme(`my-theme-dir`)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`"my-theme-dir" has been installed through NPM`)
    expect(process.logger.info).not.toHaveBeenCalledWith(`"my-theme" a theme by me me me`)
    expect(process.logger.info).not.toHaveBeenCalledWith(`This is awesome`)
    expect(theme).toBe(foo)
  })

  test(`getCustomUserTheme(npmModuleName) // theme fallback folder`, async () => {
    const themeDir = path.join(__dirname, `my-theme-dir`, `theme`)
    fsx.__FILES = {
      [themeDir]: ``
    }

    const theme = await getCustomUserTheme(`my-theme-dir`)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`"my-theme-dir" has been installed through NPM`)
    expect(process.logger.info).not.toHaveBeenCalledWith(`"my-theme" a theme by me me me`)
    expect(process.logger.info).not.toHaveBeenCalledWith(`This is awesome`)
    expect(theme).toBe(themeDir)
  })

  test(`getCustomUserTheme(string) // not exist`, async () => {
    const theme = await getCustomUserTheme(`foo`)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`Not a theme installed through NPM!`)
    expect(theme).toBe(null)
  })

  test(`getCustomUserTheme(path) // not exist`, async () => {
    const themeDir = path.resolve(`./foo`)
    fsx.__FILES = {
      [themeDir]: ``
    }
    const theme = await getCustomUserTheme(`./foo`)
    expect(process.logger.debug.info).toHaveBeenCalledWith(`Theme found in the file system:`)
    expect(process.logger.debug.warn).toHaveBeenCalledWith(themeDir)
    expect(theme).toBe(themeDir)
  })
})
