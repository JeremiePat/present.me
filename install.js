const { writeFile } = require(`fs`).promises
const exec = require(`./lib/exec`)
const Logger = require(`./lib/log`)
const _ = require(`./lib/l10n`)

const log = new Logger({
  verbose: Logger.VERBOSITY_TALKING
})

async function install () {
  const has = {}

  await Promise.all([
    exec(`latex --version`).then(() => { has.latex = true }, () => { has.latex = false }),
    exec(`pandoc --version`).then(() => { has.pandoc = true }, () => { has.pandoc = false }),
    exec(`docker --version`).then(() => { has.docker = true }, () => { has.docker = false })
  ])

  process.env.PME_MAKE_MODE = has.pandoc && has.latex ? `LOCAL`
    : has.docker ? `REMOTE`
      : ``

  await writeFile(`.env`, `PME_MAKE_MODE=${process.env.PME_MAKE_MODE}`, `utf8`)
    .catch(err => log.error(err.message))

  if (!process.env.PME_MAKE_MODE) {
    return log.info(`Install warning`)
  }

  if (process.env.PME_MAKE_MODE === `REMOTE`) {
    await exec(`docker build --no-cache --rm -t pme -f ./pandoc.Dockerfile .`, { debug: true })
      .then(() => {
        log.info(_(`Docker image is ready`))
      }, () => {
        log.error(_(`Something went wrong with docker. Is the docker deamon running?`))
      })
  }
}

install()
