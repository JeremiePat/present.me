const { spawn } = require('child_process')
const { logger, transformer } = require('./log')

function exec (str, option) {
  const log = logger(option)
  const transform = transformer(option)

  const [cmd, ...param] = str.split(' ')
  const run = spawn(cmd, param)
  const pid = run.pid

  log.debug(`(${pid}) Exec command:`)
  log.debug(str)
  log.warn('Running this command can take some time...')

  run.stdout.pipe(transform.info).pipe(process.stdout)
  run.stderr.pipe(transform.error).pipe(process.stderr)

  return new Promise((resolve, reject) => {
    run.on('error', err => {
      log.debug('Got an error on command:')
      log.debug(str)
      reject(err)
    })

    run.on('close', code => {
      process.stdout.write('\n')

      if (code !== 0) {
        log.debug('Got an error on command:')
        log.debug(str)
        return reject(new Error(`Sub process fail with code: ${code}`))
      }

      log.debug(`(${pid}) Command done`)
      resolve()
    })
  })
}

module.exports = exec
