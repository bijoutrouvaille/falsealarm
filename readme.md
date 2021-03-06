# falsealarm

A utility for simulating Firebase requests.

## Features

- read, write, push and update testing
- works as a nodejs library 
- or through a clean CLI interface

## Two Important Notes

- Passing the `simulate` flag makes the tests _much_ slower and may even break the operation with a strange error. It is marked "internal only," wherever it was documented, therefore the simulation is disabled by default, and *write operations actually write to the database*. Pass `-s` or `--simulate` to try simulating anyway.
- Neither this project nor its creator are affiliated with Firebase.

## Install

For CLI,

`npm install -g falsealarm`

For library use,

`npm install falsealarm`

## Examples

Examples are included in the examples folder.

Passing,

```
falsealarm -c examples/env.js examples/pass.js
```

Failing,

```
falsealarm -c examples/env.js examples/fail.js
```

Failing output,

```
'https://false-alarm-drill.firebaseio.com/.json?auth=...
Attempt to write Sparse data to /  /: /detectives: /detectives/6biFtd1XO1SJFbvCYcHMjtDLvao2: .write: "auth.uid==$did && $did==newData.child('detectiveId').val()"
=> false
: : No .write rule allowed the operation.: /: /singlestickLevels: /singlestickLevels/6biFtd1XO1SJFbvCYcHMjtDLvao2: .write: "auth.uid==$did"
=> true
: Write was denied.:
{ headers:
   { server: 'nginx',
     date: 'Fri, 16 Sep 2016 14:28:50 GMT',
     'content-type': 'application/json; charset=utf-8',
     'content-length': '36',
     'access-control-allow-origin': '*',
     'cache-control': 'no-cache',
     connection: 'close' },
  status: 401,
  error:
   { auth:
      { provider: 'anonymous',
        uid: '6biFtd1XO1SJFbvCYcHMjtDLvao2',
        token: [Object] },
     rawText: 'Attempt to write Sparse data to /  /: /detectives: /detectives/6biFtd1XO1SJFbvCYcHMjtDLvao2: .write: "auth.uid==$did && $did==newData.child(\'detectiveId\').val()" => false: : No .write rule allowed the operation.: /: /singlestickLevels: /singlestickLevels/6biFtd1XO1SJFbvCYcHMjtDLvao2: .write: "auth.uid==$did" => true: Write was denied.:' },
  success: false,
  path: '/.json',
  operation: 'update',
  method: 'PATCH' }

```

## Required Parameters

The required parameters for a test, however passed (conflig, cli or test files), are:

- app: app name, not the full URL
- secret: your db secret
- uid: auth uid
- operation: one of read write push update 
- path: path to data node, root by default
- data: data payload, null by default

## CLI

```sh
$ falsealarm -h

  Usage: falsealarm [options] <files...>

  Firebase request runner and debugger.

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -s, --simulate             Simulate write operations, do not perform actual writes. Note: this makes requrest slow.
    -b, --bail                 Exit with an error code on the first failed test.
    -c, --config [file]        Config/params file (js or json) path
    -u, --uid <string>         Firebase uid to simulate
    -o, --operation <op>       Check operation: read, write, update
    -a, --app <db name>        Firebase db name
    -p, --path <path/to/node>  Firebase path to data
    -d, --data [data]          Data to try, defaults to null

  <files...> are json or js files exporting parameters named below.
  Example: falsealarm -c path/to/config.json path/to/test/file.js
  See an example setup in the examples folder
```

The recommended approach is to have a js or json file with your app name and secret as a config, 
and as many of the test files as there are tests you wish to run. However it doesn't matter where 
you provide the necessary parameters, as long as you do. The three sources of parameters are: 

- command line arguments
- config file
- test file

If you choose to follow the recommendation, you would run it like so,

`falsealarm --config path/to/config.js file/with/tests.js`

## Module API

```
// initialize
var sim = require('falsealarm')(configParamsObject)
// perform any number of calls with the initialized simulator
sim(testParamsObject, function(error, results) {
  if (results.success) ...
  else ...
})
```

Simulation's callback function passes two arguments: error and results. The first arguments
will inform you if you have not passed all required paramters. `error` will be null if the
simulation took place, even if the read/write did not succed.

## License

MIT License

Copyright (c) 2016 Bijou Trouvaille

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
