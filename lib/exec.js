const { spawn } = require(`child_process`)
const { logger, transformer } = require(`./log`)
const _ = require(`./l10n`)

function exec (str, option) {
  const log = logger(option)
  const transform = transformer(option)

  const [cmd, ...param] = str.split(` `)
  const run = spawn(cmd, param)
  const pid = run.pid

  log.debug(_(`(%s) Exec command:`, pid))
  log.debug(str)
  log.warn(_(`Running this command can take some time...`))

  run.stdout.pipe(transform.info).pipe(process.stdout)
  run.stderr.pipe(transform.error).pipe(process.stderr)

  return new Promise((resolve, reject) => {
    run.on(`error`, err => {
      log.debug(_(`Got an error on command:`))
      log.debug(str)
      reject(err)
    })

    run.on(`close`, code => {
      if (option.debug || option.verbose) {
        process.stdout.write(`\n`)
      }

      if (code !== 0) {
        log.debug(_(`Got an error on command:`))
        log.debug(str)
        return reject(new Error(_(`Sub process fail with code: %s`, code)))
      }

      log.debug(_(`(%s) Command done`, pid))
      resolve()
    })
  })
}

module.exports = exec
