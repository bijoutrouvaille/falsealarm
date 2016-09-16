# falsealarm

A utility for simulating Firebase requests.

## Features

- read, write, push and update testing
- nodejs library 
- clean CLI interfaces

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

## CLI

```
falsealarm -h                                                                           code/web/falsealarm  9:59  [15]

  Usage: falsealarm [options] <files...>

  Firebase request runner and debugger.

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -b, --bail                 Exit with an error code on the first failed test.
    -c, --config [file]        Config/params file (js or json) path
    -u, --uid <string>         Firebase uid to simulate
    -o, --operation <op>       Check operation: read, write, update
    -p, --path <path/to/node>  Firebase path to data
    -d, --data [data]          Data to try, defaults to null

  <files...> are json or js files exporting parameters named below.
  Example: falsealarm -c path/to/config.json path/to/test/file.js
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
sim(testParamsObject, function(results) {
  if (results.success) ...
  else ...
})
```
