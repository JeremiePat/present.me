const { red, yellow, bold, green } = require('chalk')
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

const logger = (overwrite) => (opt) => {
  return {
    log: opt.verbose || opt.debug ? log.bind(null, process.stdout, prefixes.log, overwrite) : noop,
    info: opt.verbose || opt.debug ? log.bind(null, process.stdout, prefixes.info, overwrite) : noop,
    error: opt.verbose || opt.debug ? log.bind(null, process.stderr, prefixes.error, overwrite) : noop,
    warn: opt.debug ? log.bind(null, process.stdout, prefixes.warn, overwrite) : noop,
    debug: opt.debug ? log.bind(null, process.stdout, prefixes.debug, overwrite) : noop
  }
}

module.exports = { logger: logger(false), overwrite: logger(false) }
