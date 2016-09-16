#! /usr/bin/env node

var resolve = require('resolve-path')
var args = require('commander')

args
  .version(require('../package.json').version)
  .usage('[options] <file>')
  .option('-b, --bail', 'Exit with an error code on the first failed test.')
  .option('-c, --config [file]', 'Config/params file (js or json) path')
  .option('-u, --uid <string>', 'Firebase uid to simulate')
  .option('-o, --operation <op>', 'Check operation: read, write, update', /^(read|write|update)$/i)
  .option('-p, --path <path/to/node>', 'Firebase path to data', '/')
  .option('-d, --data [data]', 'Data to try, defaults to null', JSON.parse, 'null')
  .parse(process.argv)


function print(results) {
  var o = Object.assign({}, results)
  if (o.error) {
    console.log(o.error.text)
    delete o.error.text
  }
  console.log(o)
  if (args.bail) process.exit(1)
}
var sim = require('../index.js')(args);
console.log(''); // token generator bug workaround. try without this line
(args.args || []).forEach(function(filePath) {
  var resolved = resolve(filePath)
  sim(require(resolved), print)
})
if (args.operation && args.path) sim(print)
