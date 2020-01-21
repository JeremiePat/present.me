const { green, yellow, red, bold, italic, dim } = require(`chalk`)
const { Writable, Readable } = require(`stream`)
const Logger = require(`../index`)
const format = require(`../format`)

const TTY_LENGTH = 20 + Math.round(Math.random() * 100)
const prefix = Math.round(10000000 + Math.random() * 100000000).toString(36)
const longString = `This is a very long string that will require some line breaking formating.\nWith a long URL for good mesure: http://test.com/with/a/very/long/address`
const shortString = `I'm short`

class MockTTY {
  constructor (length) {
    this.output = ``
    this.isTTY = true
    this.columns = length || TTY_LENGTH
    this.write = jest.fn((data) => {
      this.output += data
    })
  }

  clearLine () {
    this.output = this.output.split(`\n`).slice(0, -1).join(`\n`)
  }

  cursorTo () {}
}

class MockReadableStream extends Readable {
  constructor () {
    super()

    this.data = [`apple\n`, `banana\n`, `orange\n`]
  }

  _read () {
    this.push(this.data.pop() || null)
  }
}

describe(`log`, () => {
  it(`Logger static values`, () => {
    expect(Logger.get).toBeInstanceOf(Function)

    Logger.VERBOSITY_SILENT = 3
    expect(Logger.VERBOSITY_SILENT).toBe(0)
    Logger.VERBOSITY_TALKING = 3
    expect(Logger.VERBOSITY_TALKING).toBe(1)
    Logger.VERBOSITY_DEBUG = 3
    expect(Logger.VERBOSITY_DEBUG).toBe(2)

    expect(Logger.MAX_TTY_LENGTH).toBe(Infinity)
    expect(Logger.MAX_LINE_LENGTH).toBe(80)

    expect(Logger.PREFIX_LOG).toBe(`       `)
    expect(Logger.PREFIX_INFO).toBe(green.bold(`INFO:  `))
    expect(Logger.PREFIX_WARN).toBe(yellow.bold(`WARN:  `))
    expect(Logger.PREFIX_ERROR).toBe(red.bold(`ERROR: `))
    expect(Logger.PREFIX_DEBUG).toBe(bold(`DEBUG: `))
  })

  describe(`Instance creation`, () => {
    it(`new Logger() // default instance`, () => {
      const log = new Logger()

      // Depending how you use Jest, process.stdout isn't always a proper TTY
      const sep = `-`.repeat(Math.max(Logger.PREFIX_LOG.length, Math.min(Logger.MAX_LINE_LENGTH, +process.stdout.columns || 0)))

      expect(log).toBeInstanceOf(Writable)
      expect(log.verbose).toBe(Logger.VERBOSITY_TALKING)
      expect(log.overwrite).toBe(false)
      expect(log.tty).toBe(process.stdout)
      expect(log.separator).toBe(sep)
      expect(log.log).toBeInstanceOf(Function)
      expect(log.info).toBeInstanceOf(Function)
      expect(log.warn).toBeInstanceOf(Function)
      expect(log.error).toBeInstanceOf(Function)
      expect(log.fatal).toBeInstanceOf(Function)
      expect(log.debug).toBeInstanceOf(Function)
      expect(log.debug.sep).toBeInstanceOf(Function)
      expect(log.debug.info).toBeInstanceOf(Function)
      expect(log.debug.warn).toBeInstanceOf(Function)
      expect(log.debug.dim).toBeInstanceOf(Function)
      expect(log.streamLogger).toBe(log.info)
    })

    it(`new Logger({ verbose })`, () => {
      const silent = new Logger({ verbose: Logger.VERBOSITY_SILENT })
      expect(silent.verbose).toBe(Logger.VERBOSITY_SILENT)

      const talking = new Logger({ verbose: Logger.VERBOSITY_TALKING })
      expect(talking.verbose).toBe(Logger.VERBOSITY_TALKING)

      const debug = new Logger({ verbose: Logger.VERBOSITY_DEBUG })
      expect(debug.verbose).toBe(Logger.VERBOSITY_DEBUG)

      const wat = new Logger({ verbose: Math.round(3 + Math.random() * 7) })
      expect(wat.verbose).toBe(Logger.VERBOSITY_TALKING)
    })

    it(`new Logger({ tty })`, () => {
      const tty = new MockTTY()
      const log = new Logger({ tty })
      const max = Logger.MAX_LINE_LENGTH
      const min = Logger.PREFIX_LOG.length

      expect(log.tty).toBe(tty)
      expect(log.separator).toBe(`-`.repeat(Math.max(min, Math.min(max, tty.columns))))
    })

    it(`new Logger({ streamLogger })`, () => {
      const log = new Logger({ streamLogger: `log` })
      expect(log.streamLogger).toBe(log.log)

      const info = new Logger({ streamLogger: `info` })
      expect(info.streamLogger).toBe(info.info)

      const warn = new Logger({ streamLogger: `warn` })
      expect(warn.streamLogger).toBe(warn.warn)

      const debug = new Logger({ streamLogger: `debug` })
      expect(debug.streamLogger).toBe(debug.debug)

      const error = new Logger({ streamLogger: `error` })
      expect(error.streamLogger).toBe(error.error)

      const wat = new Logger({ streamLogger: prefix })
      expect(wat.streamLogger).toBe(wat.info)
    })

    it(`new Logger({ overwrite })`, () => {
      const ok = new Logger({ overwrite: 1 })
      expect(ok.overwrite).toBe(true)

      const ko = new Logger({ overwrite: 0 })
      expect(ko.overwrite).toBe(false)
    })

    it(`Logger.get({ ... })`, () => {
      const log = Logger.get()

      expect(log.verbose).toBe(Logger.VERBOSITY_SILENT)
      expect(log.overwrite).toBe(false)

      const log2 = Logger.get({ overwrite: 1, verbose: true })

      expect(log2.verbose).toBe(Logger.VERBOSITY_TALKING)
      expect(log2.overwrite).toBe(true)

      const log3 = Logger.get({ overwrite: 0, debug: true })

      expect(log3.verbose).toBe(Logger.VERBOSITY_DEBUG)
      expect(log3.overwrite).toBe(false)

      const log4 = Logger.get({ verbose: true, debug: true })

      expect(log4.verbose).toBe(Logger.VERBOSITY_DEBUG)
    })
  })

  describe(`Method call`, () => {
    // log.fn(string)
    [
      [`log`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`log`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`log`, Logger.VERBOSITY_TALKING, false, [`%1`, `%1%2`]],
      [`log`, Logger.VERBOSITY_TALKING, true, [`%1`, `%2`]],
      [`log`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`log`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`info`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`info`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`info`, Logger.VERBOSITY_TALKING, false, [`%1`, `%1%2`]],
      [`info`, Logger.VERBOSITY_TALKING, true, [`%1`, `%2`]],
      [`info`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`info`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`warn`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`warn`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`warn`, Logger.VERBOSITY_TALKING, false, [`%1`, `%1%2`]],
      [`warn`, Logger.VERBOSITY_TALKING, true, [`%1`, `%2`]],
      [`warn`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`warn`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`error`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`error`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`error`, Logger.VERBOSITY_TALKING, false, [`%1`, `%1%2`]],
      [`error`, Logger.VERBOSITY_TALKING, true, [`%1`, `%2`]],
      [`error`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`error`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`fatal`, Logger.VERBOSITY_SILENT, false, [`%1`, `%1%2`]],
      [`fatal`, Logger.VERBOSITY_SILENT, true, [`%1`, `%1%2`]],
      [`fatal`, Logger.VERBOSITY_TALKING, false, [`%1`, `%1%2`]],
      [`fatal`, Logger.VERBOSITY_TALKING, true, [`%1`, `%1%2`]],
      [`fatal`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`fatal`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%1%2`]],

      [`debug`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`debug`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`debug`, Logger.VERBOSITY_TALKING, false, [``, ``]],
      [`debug`, Logger.VERBOSITY_TALKING, true, [``, ``]],
      [`debug`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`debug`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]]
    ].forEach(test => {
      const [fnName, verbose, overwrite, results] = test
      const formater = fnName === `fatal` ? red.italic : null
      const verbosity = [`silent`, `verbose`, `debug`][verbose]
      const prefix = {
        info: Logger.PREFIX_INFO,
        log: Logger.PREFIX_LOG,
        warn: Logger.PREFIX_WARN,
        error: Logger.PREFIX_ERROR,
        fatal: Logger.PREFIX_ERROR,
        debug: Logger.PREFIX_DEBUG
      }[fnName]

      const realOverwrite = fnName === `fatal` ? false : overwrite

      const first = format(longString, prefix, formater, TTY_LENGTH)
        .map(s => realOverwrite ? s.trim() : s)
        .join(realOverwrite ? ` ` : `\n`) + (realOverwrite ? ` ` : `\n`)
      const second = format(shortString, prefix, formater, TTY_LENGTH)
        .map(s => realOverwrite ? s.trim() : s)
        .join(realOverwrite ? ` ` : `\n`) + (realOverwrite ? ` ` : `\n`)

      const [one, two] = results.map(s => {
        return s.replace(`%1`, first).replace(`%2`, second)
      })

      it(`log.${fnName}(string) // ${verbosity}${overwrite ? ` // with overwrite` : ``}`, () => {
        const tty = new MockTTY()
        const log = new Logger({ tty, verbose, overwrite })

        log[fnName](longString)
        expect(tty.output).toBe(one)
        log[fnName](shortString)
        expect(tty.output).toBe(two)
      })
    })

    // log.debug.fn(string)
    ;[
      [`warn`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`warn`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`warn`, Logger.VERBOSITY_TALKING, false, [``, ``]],
      [`warn`, Logger.VERBOSITY_TALKING, true, [``, ``]],
      [`warn`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`warn`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`info`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`info`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`info`, Logger.VERBOSITY_TALKING, false, [``, ``]],
      [`info`, Logger.VERBOSITY_TALKING, true, [``, ``]],
      [`info`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`info`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]],

      [`dim`, Logger.VERBOSITY_SILENT, false, [``, ``]],
      [`dim`, Logger.VERBOSITY_SILENT, true, [``, ``]],
      [`dim`, Logger.VERBOSITY_TALKING, false, [``, ``]],
      [`dim`, Logger.VERBOSITY_TALKING, true, [``, ``]],
      [`dim`, Logger.VERBOSITY_DEBUG, false, [`%1`, `%1%2`]],
      [`dim`, Logger.VERBOSITY_DEBUG, true, [`%1`, `%2`]]
    ].forEach(test => {
      const [fnName, verbose, overwrite, results] = test
      const verbosity = [`silent`, `verbose`, `debug`][verbose]
      const prefix = Logger.PREFIX_DEBUG
      const formater = {
        warn: yellow,
        info: italic,
        dim: dim
      }[fnName]

      const first = format(longString, prefix, formater, TTY_LENGTH)
        .map(s => overwrite ? s.trim() : s)
        .join(overwrite ? ` ` : `\n`) + (overwrite ? ` ` : `\n`)
      const second = format(shortString, prefix, formater, TTY_LENGTH)
        .map(s => overwrite ? s.trim() : s)
        .join(overwrite ? ` ` : `\n`) + (overwrite ? ` ` : `\n`)

      const [one, two] = results.map(s => {
        return s.replace(`%1`, first).replace(`%2`, second)
      })

      it(`log.debug.${fnName}(string) // ${verbosity}${overwrite ? ` // with overwrite` : ``}`, () => {
        const tty = new MockTTY()
        const log = new Logger({ tty, verbose, overwrite })

        log.debug[fnName](longString)
        expect(tty.output).toBe(one)
        log.debug[fnName](shortString)
        expect(tty.output).toBe(two)
      })
    })

    it(`log.debug.sep()`, () => {
      const debug = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_DEBUG })
      const silent = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_SILENT })
      const verbose = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_TALKING })
      const result = format(debug.separator, Logger.PREFIX_LOG, null, debug.tty.columns).join(`\n`) + `\n`

      silent.debug.sep()
      expect(silent.tty.output).toBe(``)

      verbose.debug.sep()
      expect(verbose.tty.output).toBe(``)

      debug.debug.sep()
      expect(debug.tty.output).toBe(result)
    })

    it(`log.nl()`, () => {
      const debug = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_DEBUG })
      const silent = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_SILENT })
      const verbose = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_TALKING })

      silent.nl()
      expect(silent.tty.output).toBe(``)

      verbose.nl()
      expect(verbose.tty.output).toBe(`\n`)

      debug.nl()
      expect(debug.tty.output).toBe(`\n`)
    })

    it(`log.clear()`, () => {
      const multi = new Logger({ tty: new MockTTY(), overwrite: false })
      const single = new Logger({ tty: new MockTTY(), overwrite: true })

      multi.log(shortString)
      expect(multi.tty.output).toBe(`${Logger.PREFIX_LOG}${shortString}\n`)
      multi.clear()
      expect(multi.tty.output).toBe(`${Logger.PREFIX_LOG}${shortString}\n`)

      single.log(shortString)
      expect(single.tty.output).toBe(`${shortString} `)
      single.clear()
      expect(single.tty.output).toBe(``)
    })
  })

  describe(`Writable stream use`, () => {
    it(`input.pipe(log) // silent`, (next) => {
      const input = new MockReadableStream()
      const log = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_SILENT })

      input.pipe(log)
      input.on(`end`, () => {
        expect(log.tty.output).toBe(``)
        next()
      })
    })

    it(`input.pipe(log) // verbose`, (next) => {
      const input = new MockReadableStream()
      const log = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_TALKING })

      input.pipe(log)
      input.on(`end`, () => {
        expect(log.tty.output).toBe(`${Logger.PREFIX_INFO}Opérations en cours: 3 `)
        next()
      })
    })

    it(`input.pipe(log) // debug`, (next) => {
      const input = new MockReadableStream()
      const log = new Logger({ tty: new MockTTY(), verbose: Logger.VERBOSITY_DEBUG })

      input.pipe(log)
      input.on(`end`, () => {
        expect(log.tty.output).toBe(dim(`orange\n`) + dim(`banana\n`) + dim(`apple\n`))
        next()
      })
    })
  })

  describe(`Specific corner cases`, () => {
    it(`What if process.stdout isn't a proper TTY`, () => {
      const tty = new MockTTY()

      const result = format(longString, Logger.PREFIX_INFO, null, Logger.MAX_LINE_LENGTH).join(`\n`) + `\n`

      const log = new Logger({ tty })

      tty.columns = 0 // A very weird terminal size
      log.info(longString)
      expect(tty.output).toBe(result)

      tty.output = ``
      tty.columns = undefined // No columns property (not a TTY)
      log.info(longString)
      expect(tty.output).toBe(result)
    })
  })
})
