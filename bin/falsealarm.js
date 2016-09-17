#! /usr/bin/env node

var resolve = require('resolve-path')
var args = require('commander')

args
  .version(require('../package.json').version)
  .description('Firebase request runner and debugger.')
  .usage('[options] <files...>')
  .option('-s, --simulate', 'Simulate write operations, do not perform actual writes. Note: this makes requrest slow.')
  .option('-b, --bail', 'Exit with an error code on the first failed test.')
  .option('-c, --config [file]', 'Config/params file (js or json) path')
  .option('-u, --uid <string>', 'Firebase uid to simulate')
  .option('-o, --operation <op>', 'Check operation: read, write, update', /^(read|write|update)$/i)
  .option('-a, --app <db name>', 'Firebase db name')
  .option('-p, --path <path/to/node>', 'Firebase path to data', '/')
  .option('-d, --data [data]', 'Data to try, defaults to null', JSON.parse, 'null')
  .on('--help', function(){
    console.log('  <files...> are json or js files exporting parameters named below.');
    console.log('  Example: falsealarm -c path/to/config.json path/to/test/file.js');
    console.log('  See an example setup in the examples folder');
  })
  .parse(process.argv)


function print(error, results) {
  if (error) {
    console.log(error);
    process.exit(2)
  }
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
