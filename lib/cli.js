const pkg = require('../package.json')
const commander = require('commander')
const program = new commander.Command()

const l10n = require('./l10n')
const serve = require('./serve')
const make = require('./make')

program
  .name('pme')
  .usage('[global options] command')
  .version(pkg.version)
  .helpOption('-h, --help', l10n.help)
  .option('-v, --verbose', l10n.verbose)
  .option('-d, --debug', l10n.debug)

program
  .command('serve [folder]')
  .description(l10n.serve)
  .option('-p, --port <number>', l10n.port, '8888', Number)
  .action(serve)

program
  .command('make [src] [format]')
  .description(l10n.make)
  // .option('-o, --output <path>', 'A custom path to output the generated file')
  .action(make)

module.exports = program
