#! /usr/bin/env node

var args = require('commander')

args
  .version(require('../package.json').version)
  .usage('[options] <file>')
  .option('-c, --config [file]', 'Config/params file (js or json) path')
  .option('-u, --uid <string>', 'Firebase uid to simulate')
  .option('-o, --operation <op>', 'Check operation: read, write, update', /^(read|write|update)$/i)
  .option('-p, --path <path/to/node>', 'Firebase path to data', '/')
  .option('-d, --data [data]', 'Data to try, defaults to null', JSON.parse, 'null')
  .parse(process.argv)

var sim = require('../index.js')(args)
(args.args || []).forEach(function(filePath) {
  sim(require(filePath))
})
if (args.operation && args.path) sim()

