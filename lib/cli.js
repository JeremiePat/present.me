const pkg = require(`../package.json`)
const commander = require(`commander`)
const program = new commander.Command()

const _ = require(`./l10n`)
const path = require(`path`)
const Logger = require(`./log`)
const { setup } = require(`./setup`)

program
  .name(`pme`)
  .usage(`<command> [options]`)
  .version(pkg.version)
  .helpOption(`-h, --help`, _`Output usage information`)
  .option(`-v, --verbose`, _`Let the program telling about what it is doing`)
  .option(`-d, --debug`, _`Provide helpful debug information in the terminal`)

program
  .command(`serve [folder]`)
  .description(_`Serve a folder of Markdown files as a web slidedeck`)
  .option(`-p, --port <number>`, _`The port on the local machine to access the web slidedeck`, `0`, Number)
  .option(`-t, --theme <path>`, _`The path to a theme folder to customize the output`)
  .option(`-b, --browser`, _`Open presentation in your browser automatically`)
  .action(async (folder, cmd) => {
    const serve = require(`./serve`)

    process.logger = new Logger({
      overwrite: !cmd.parent.debug && !cmd.parent.verbose,
      verbose: cmd.parent.debug ? Logger.VERBOSITY_DEBUG : Logger.VERBOSITY_TALKING
    })

    await setup(path.resolve(folder || `.`), cmd.theme)

    serve({
      port: cmd.port,
      browser: cmd.browser
    }).catch(err => {
      process.logger.fatal(err.stack || err.message)
    })
  })

program
  .command(`make [folder]`)
  .description(_`Turn a folder of Markdown files into a slidedeck`)
  .option(`-f, --format <format>`, _`A string indicating which format to produce`, `pdf/slides`)
  .option(`-o, --output <path>`, _`A custom path to output the generated file`)
  .option(`-t, --theme <path>`, _`The path to a theme folder to customize the output`)
  .option(`-p, --pack <format>`, _`Produce a compressed archive containing the whole presentation`, `zip`)
  .action(async (folder, cmd) => {
    const make = require(`./make`)

    process.logger = Logger.get(cmd.parent)
    const src = path.resolve(folder || `.`)

    await setup(src, cmd.theme)

    await make({
      output: cmd.output || path.join(src, `${path.basename(src)}.___`),
      format: cmd.format,
      pack: cmd.pack
    }).catch(err => {
      process.logger.fatal(err.stack || err.message)
    })

    process.exit(0)
  })

module.exports = program
