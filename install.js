const debug = process.argv.includes('--debug')
const { writeFile } = require('fs').promises
const exec = require('./lib/exec')
const log = require('./lib/log').logger({ verbose: true })

async function install () {
  const has = {}

  await Promise.all([
    exec('latex --version').then(() => { has.latex = true }, () => { has.latex = false }),
    exec('pandoc --version').then(() => { has.pandoc = true }, () => { has.pandoc = false }),
    exec('docker --version').then(() => { has.docker = true }, () => { has.docker = false })
  ])

  process.env.PME_MAKE_MODE = has.pandoc && has.latex ? 'LOCAL'
    : has.docker ? 'REMOTE'
      : ''

  await writeFile('.env', `PME_MAKE_MODE=${process.env.PME_MAKE_MODE}`, 'utf8')
    .catch(err => log.error(err.message))

  if (!process.env.PME_MAKE_MODE) {
    return log.info(
`  present.me needs external dependencies to work: Pandoc and LaTeX.

  Because we don't want to clutter you environnement, we suggest that
  you install those dependencies yourself in order to stay in controle:

  Pandoc: https://pandoc.org/installing.html
  LaTeX: http://www.tug.org/texlive/
  (this is only a suggestion, use the TeX envrionnement of your choice)

  Alternatively, if you don't want to add those tools in your
  environnement. You can install Docker. If so, we will be able to setup
  a Docker container (https://hub.docker.com/r/pandoc/latex) that will contain
  all the necessary tools without the hassle of doing it yourself and without
  altering your environnement.

  Docker Community Edition:
    macos: https://download.docker.com/mac/stable/Docker.dmg
    windows: https://download.docker.com/win/stable/Docker Desktop Installer.exe
    For linux users, it depends on your distribution, see: https://docs.docker.com/install/

  Once done, try installing present.me again.`)
  }

  if (process.env.PME_MAKE_MODE === 'REMOTE') {
    await exec('docker build --no-cache --rm -t pme ./pandoc.Dockerfile', debug)
      .then(() => {
        log.info('Docker image is ready')
      }, () => {
        log.error('Something went wrong with docker. Is the docker deamon running?')
      })
  }
}

install()
