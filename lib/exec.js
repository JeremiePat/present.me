const { spawn } = require(`child_process`)
const Logger = require(`./log`)
const _ = require(`./l10n`)

function exec (str, option) {
  const log = new Logger({
    verbose: option.debug ? Logger.VERBOSITY_DEBUG
      : option.verbose ? Logger.VERBOSITY_TALKING
        : Logger.VERBOSITY_SILENT
  })

  const [cmd, ...param] = str.split(` `)
  const run = spawn(cmd, param)
  const pid = run.pid

  log.debug(_(`(%s) Exec command:`, pid))
  log.debug(str)
  log.warn(_(`Running this command can take some time...`))

  log.debug(_(`Output remote console `).padEnd(Math.min(log.tty.columns - 10, 70), `-`))
  run.stdout.pipe(log)
  run.stderr.pipe(log)

  return new Promise((resolve, reject) => {
    run.on(`error`, err => {
      log.debug(_(`Got an error on command:`))
      log.debug(str)
      reject(err)
    })

    run.on(`close`, code => {
      log.nl()

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
