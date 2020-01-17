const { readFile } = require(`fs`).promises
const path = require(`path`)
const YAML = require(`yaml`)
const { pathExists } = require(`fs-extra`)
const files = require(`./files`)
const _ = require(`../l10n`)

const DEFAULT_THEME_FOLDER = path.resolve(__dirname, `..`, `..`, `theme`)

async function config (files) {
  const data = await Promise.all(files.map(f => readFile(f, `utf8`)))

  return data.reduce((cfg, data) => {
    return { ...cfg, ...YAML.parse(data) }
  }, {})
}

async function theme (src, options, log) {
  log.debug.sep()
  log.debug(_`Retriving theme info`)
  let themeFolder = DEFAULT_THEME_FOLDER

  if (options.theme && (await pathExists(path.resolve(options.theme)))) {
    themeFolder = path.resolve(options.theme)
  } else if (await pathExists(path.resolve(src, `theme`))) {
    themeFolder = path.resolve(src, `theme`)
  }

  const { yaml, css } = await files(themeFolder, log)
  const userConfig = await config([
    path.join(DEFAULT_THEME_FOLDER, `config.yaml`),
    ...yaml.map(f => path.join(themeFolder, f))
  ])

  log.debug.sep()
  log.debug.info(_`Configuration:`)
  log.debug(userConfig)

  return {
    folder: themeFolder,
    config: userConfig,
    css: css
  }
}

module.exports = theme
