const pkg = require(`../package.json`)
const commander = require(`commander`)
const program = new commander.Command()

const _ = require(`./l10n`)
const serve = require(`./serve`)
const make = require(`./make`)

program
  .name(`pme`)
  .usage(`[global options] command`)
  .version(pkg.version)
  .helpOption(`-h, --help`, _(`Output usage information.`))
  .option(`-v, --verbose`, _(`Let the program telling about what it is doing.`))
  .option(`-d, --debug`, _(`Provide helpful debug information in the terminal.`))

program
  .command(`serve [folder]`)
  .description(_(`Serve a folder of Markdown files as a web slidedeck.`))
  .option(`-p, --port <number>`, _(`The port on the local machine to access the web slidedeck.`), `8888`, Number)
  .action((folder, cmd) => {
    serve(folder, {
      debug: cmd.parent.debug,
      verbose: cmd.parent.verbose,
      port: cmd.port
    }).catch(console.error)
  })

program
  .command(`make [src] [format]`)
  .description(_(`Turn a folder of Markdown files into a slidedeck.`))
  .option(`-o, --output <path>`, _(`A custom path to output the generated file`))
  .action((src, format, cmd) => {
    make(src, format, {
      debug: cmd.parent.debug,
      verbose: cmd.parent.verbose,
      output: cmd.output
    }).catch(console.error)
  })

module.exports = program
