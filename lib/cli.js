const pkg = require(`../package.json`)
const commander = require(`commander`)
const program = new commander.Command()

const _ = require(`./l10n`)
const make = require(`./make`)
const serve = require(`./serve`)

program
  .name(`pme`)
  .usage(`<command> [options]`)
  .version(pkg.version)
  .helpOption(`-h, --help`, _`Output usage information.`)
  .option(`-v, --verbose`, _`Let the program telling about what it is doing.`)
  .option(`-d, --debug`, _`Provide helpful debug information in the terminal.`)

program
  .command(`serve [folder]`)
  .description(_`Serve a folder of Markdown files as a web slidedeck.`)
  .option(`-p, --port <number>`, _`The port on the local machine to access the web slidedeck.`, `0`, Number)
  .option(`-t, --theme <path>`, _`The path to a theme folder to customize the output.`)
  .action((folder, cmd) => {
    serve(folder, {
      debug: cmd.parent.debug,
      verbose: cmd.parent.verbose,
      port: cmd.port,
      theme: cmd.theme
    }).catch(console.error)
  })

program
  .command(`make [folder]`)
  .description(_`Turn a folder of Markdown files into a slidedeck.`)
  .option(`-f, --format <format>`, _`A string indicating which format to produce`, `html/slides`)
  .option(`-o, --output <path>`, _`A custom path to output the generated file`)
  .option(`-t, --theme <path>`, _`The path to a theme folder to customize the output.`)
  .action((src, cmd) => {
    make(src, {
      debug: cmd.parent.debug,
      verbose: cmd.parent.verbose,
      output: cmd.output,
      format: cmd.format,
      theme: cmd.theme
    }).catch(console.error)
  })

module.exports = program
