var fs = require('fs')
var request = require('superagent')
// config should contain keys 
//    app: name of the app, e.g. popping-heat-2900 
//    uid: firebase uid of the simulated
//    secret: app secret
// it can optionally contain
//    config: path to js or json file with all the other values
//    provider: default is 'anonymous'
module.exports = function(config) {
  var conf = config
  if (config.config) try {
    conf = Object.assign({}, config, require(config.config))
  } catch (e) {
    console.log('config file '+config.config+' does not exist');
  }

  var FirebaseTokenGenerator = require("firebase-token-generator");
  var tokenGenerator = new FirebaseTokenGenerator(conf.secret);
  var token = tokenGenerator.createToken({
    provider: conf.provider || 'anonymous', 
    uid: conf.uid }, { debug: true });

  var url = "https://"+conf.app+".firebaseio.com/" + (conf.path || '') + '.json?auth='+token


  var ops = {read: 'GET', write: 'PUT', push: 'POST', update: 'PATCH'}

  return function(params, callback) {

    if (!callback && typeof params=='function') {
      callback = params
      params = {}
    }
    params = params || {}
    callback = callback || function(err, body) { console.log('request finished', error, body) }

    function done(e,d) { callback (e, d ? d.text : d) }
    var p = Object.assign({}, conf, params)
  
    
    var r = request(ops[p.operation], url)
    if (p.data) r.send(p.data)
    r.end(done)
  }
}
