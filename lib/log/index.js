const { Writable } = require(`stream`)
const { green, yellow, red, bold, dim, italic } = require(`chalk`)
const stringify = require(`./stringify`)
const format = require(`./format`)
const _ = require(`../l10n`)

// USEFULL CONSTANT
// ----------------------------------------------------------------------------
const PREFIXIES = [`log`, `info`, `warn`, `error`, `debug`]
const FORMATERS = {
  warn: yellow,
  info: italic,
  dim: dim
}

// UTILITIES
// ----------------------------------------------------------------------------

function minmax (value, min = -Infinity, max = +Infinity) {
  return Math.max(min, Math.min(max, +value || 0))
}

// PUBLIC API
// ----------------------------------------------------------------------------

class Logger extends Writable {
  constructor (opt) {
    super({
      write (chunk, enc, next) {
        const log = this[this.streamPrefix]
        const owrt = this.overwrite

        if (this.verbose === Logger.VERBOSITY_DEBUG) {
          this.tty.write(dim(String(chunk)))
        }

        if (this.verbose === Logger.VERBOSITY_TALKING) {
          this.overwrite = true
          log(_`Operations in progress: ${this._count += 1}`)
          this.overwrite = owrt
        }

        next()
      }
    })

    this._count = 0 // We count incoming stream chunks

    // Verbose mode, default to Logger.VERBOSITY_TALKING
    this.verbose = minmax(
      `verbose` in opt ? opt.verbose : Logger.VERBOSITY_TALKING,
      Logger.VERBOSITY_SILENT,
      Logger.VERBOSITY_DEBUG
    )

    // The TTY to write in if any
    this.tty = opt.tty && opt.tty.isTTY ? opt.tty : process.stdout

    this.separator = `-`.repeat(Math.min(this.tty.columns, Logger.MAX_LINE_LENGTH) - Logger.PREFIX_LOG.length)

    // The prefix to use if this object is used as Writable stream
    // A string among: 'log', 'info', 'warn', 'error', 'debug'
    this.streamPrefix = PREFIXIES.includes(opt.streamPrefix)
      ? opt.streamPrefix
      : `info`

    // Only handled if this.tty isn't null
    this.overwrite = Boolean(opt.overwrite)

    // Setup public interface so that it can be "detached"
    PREFIXIES.forEach(prefix => {
      const UPPER = prefix.toUpperCase()
      this[prefix] = this._log.bind(this, Logger[`PREFIX_${UPPER}`])
    })

    this.fatal = (...args) => {
      const verb = this.verbose
      this.verbose = Logger.VERBOSITY_DEBUG
      this.formater = red.italic
      this._log(Logger.PREFIX_ERROR, ...args)
      this.formater = null
      this.verbose = verb
    }

    Object.keys(FORMATERS).forEach(key => {
      this.debug[key] = (...args) => {
        this.formater = FORMATERS[key]
        this.debug(...args)
        this.formater = null
      }
    })

    this.debug.sep = () => {
      if (this.verbose !== Logger.VERBOSITY_DEBUG) { return }

      this._log(Logger.PREFIX_LOG, this.separator)
    }
  }

  _log (prefix, ...args) {
    // If silent, there is nothing to log
    if (this.verbose === Logger.VERBOSITY_SILENT) {
      return
    }

    // this.debug can be called only if VERBOSITY_DEBUG
    if (this.verbose === Logger.VERBOSITY_TALKING && prefix === Logger.PREFIX_DEBUG) {
      return
    }

    const length = minmax(
      (this.tty && this.tty.columns) || Logger.MAX_TTY_LENGTH,
      1, Logger.MAX_TTY_LENGTH
    )

    const lines = format(
      args
        .reduce((arr, val) => [...arr, stringify(val)], [])
        .join(`\n`),
      prefix,
      this.formater,
      length
    )

    this.clear()

    lines.forEach(line => {
      this.tty.write(`${line}${this.overwrite ? ` ` : `\n`}`)
    })
  }

  nl () {
    if (this.verbose !== Logger.VERBOSITY_SILENT) {
      this.tty.write(`\n`)
    }
  }

  clear () {
    if (!this.overwrite) { return }

    this.tty.clearLine(0)
    this.tty.cursorTo(0)
  }
}

Logger.get = (options) => {
  const overwrite = Boolean(options.overwrite)

  let verbose = Logger.VERBOSITY_SILENT

  if (options.verbose) {
    verbose = Logger.VERBOSITY_TALKING
  }

  if (options.debug) {
    verbose = Logger.VERBOSITY_DEBUG
  }

  return new Logger({ verbose, overwrite })
}

Logger.VERBOSITY_SILENT = 0
Logger.VERBOSITY_TALKING = 1
Logger.VERBOSITY_DEBUG = 2

Logger.MAX_TTY_LENGTH = Infinity
Logger.MAX_LINE_LENGTH = 80

Logger.PREFIX_LOG = `       `
Logger.PREFIX_INFO = green.bold(`INFO:  `)
Logger.PREFIX_WARN = yellow.bold(`WARN:  `)
Logger.PREFIX_ERROR = red.bold(`ERROR: `)
Logger.PREFIX_DEBUG = bold(`DEBUG: `)

// EXPOSE THE API
// ----------------------------------------------------------------------------

module.exports = Logger
