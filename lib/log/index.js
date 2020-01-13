const { Transform, PassThrough } = require('stream')
const { red, yellow, bold, green, dim } = require('chalk')
const noop = () => {}

const stringify = require('./stringify')
const format = require('./format')

const prefixes = {
  log: '       ',
  info: green.bold('INFO:  '),
  warn: yellow.bold('WARN:  '),
  error: red.bold('ERROR: '),
  debug: bold('DEBUG: ')
}

/**
 * Format args and output them in tty
 *
 * @param {WriteStream} tty A TTY writable stream
 * @param {string} prefix A prefix to add to the formated output string
 * @param {boolean} overwrite Indicate if the string should overwrite the last one
 * @param {...any} args The args to log
 */
function log (tty, prefix, overwrite, ...args) {
  const length = tty.columns || 80

  const lines = format(args
    .reduce((arr, val) => [...arr, stringify(val)], [])
    .join('\n'), prefix, length)

  if (overwrite) {
    tty.clearLine(0)
    tty.cursorTo(0)
  }

  lines.forEach(line => {
    tty.write(`${line}${overwrite ? ' ' : '\n'}`)
  })
}

function transform (tty, prefix, debug) {
  const length = tty.columns || 80
  let count = 0

  return new Transform({
    transform (chunck, _, next) {
      if (debug) {
        format(String(chunck), prefix, length).forEach(line => this.push(dim(line + '\n')))
        return next()
      }

      tty.clearLine(0)
      tty.cursorTo(0)
      next(null, `${prefix}Operation in progress: ${count += 1}`)
    }
  })
}

const logger = (overwrite) => (opt) => {
  return {
    log: opt.verbose || opt.debug ? log.bind(null, process.stdout, prefixes.log, overwrite) : noop,
    info: opt.verbose || opt.debug ? log.bind(null, process.stdout, prefixes.info, overwrite) : noop,
    warn: opt.verbose || opt.debug ? log.bind(null, process.stdout, prefixes.warn, overwrite) : noop,
    error: opt.verbose || opt.debug ? log.bind(null, process.stderr, prefixes.error, overwrite) : noop,
    debug: opt.debug ? log.bind(null, process.stdout, prefixes.debug, overwrite) : noop
  }
}

const transformer = (opt) => {
  return {
    log: opt.verbose || opt.debug ? transform.bind(null, process.stdout, prefixes.log, opt.debug)() : new PassThrough(),
    info: opt.verbose || opt.debug ? transform.bind(null, process.stdout, prefixes.info, opt.debug)() : new PassThrough(),
    warn: opt.verbose || opt.debug ? transform.bind(null, process.stdout, prefixes.warn, opt.debug)() : new PassThrough(),
    error: opt.verbose || opt.debug ? transform.bind(null, process.stderr, prefixes.error, opt.debug)() : new PassThrough(),
    debug: opt.debug ? transform.bind(null, process.stdout, prefixes.debug, opt.debug)() : new PassThrough()
  }
}

module.exports = { logger: logger(false), overwrite: logger(true), transformer }
