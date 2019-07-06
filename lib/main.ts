const argv = require('yargs')
              .usage('Usage: $0 <command> [options]')
              .command('generate', 'Generate an API Client from a JSON swatter')
              .example('$0 generate -f foo.jsson', 'Generate an API Client from the given file')
              .alias('f', 'file')
              .nargs('f', 1)
              .describe('f', 'Path to file')
              .demandOption(['f'])
              .help('h')
              .alias('h', 'help')
              .epilog('copyright 2019')
              .argv;

import prepare from "./prepareSwagger";
const template = require('path').resolve(__dirname, "../templates/client.mustache")

const swaggerLocation = argv.file;

require('child_process')
  .exec(`${JSON.stringify(prepare(require(swaggerLocation)))} | $(npm bin)/mustache - ${template} > output.ts`);
