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
    var configPath = require('resolve-path')(config.config)
    conf = Object.assign({}, config, require(configPath))
  } catch (e) {
    console.log('config file '+config.config+' does not exist');
  }

  var FirebaseTokenGenerator = require("firebase-token-generator");
  var tokenGenerator = new FirebaseTokenGenerator(conf.secret);
  function genToken(uid, provider) {
    return tokenGenerator.createToken({
    provider: provider || 'anonymous', 
    uid: uid }, { debug: true });
  }


  var ops = {read: 'GET', write: 'PUT', push: 'POST', update: 'PATCH'}

  return function(params, callback) {

    if (!callback && typeof params=='function') {
      callback = params
      params = {}
    }
    params = params || {}
    callback = callback || function(results) {
      console.log(results)
    }

    

    function extractAuth(headers) {
      var text = headers && headers['x-firebase-auth-debug'] 
      if (!text) return null;
      var tail = text.replace(/.*?auth=/i,'')
      var json = ""
      for (var i in tail) {
        json += tail[i]
        try { JSON.parse(json); break; } catch (e) {}
      }
      return {
        auth: JSON.parse(json),
        text: text
          .replace('with auth=','')
          .replace(json,'')
          .replace(/=\> (false)/ig,"\n=> \033[31m$1\033[0m\n")
          .replace(/=\> (true)/ig,"\n=> \033[34m$1\033[0m\n")
          .replace(/(\<no rules\>)/ig, "\033[31m$1\033[0m\n")
          .replace(/(\/ \/)/g, '\n\n$1')
      }
    }
    function extractDebug(e, res, body) {
      console.dir(url)
      var headers = e && e.response && e.response.headers || {}
      var error = 
        extractAuth(headers)
      delete headers['x-firebase-auth-debug']
      return {
        headers,
        status: res.status,
        
        error: error,
        success: !error,
        path: path,
        operation: p.operation,
        method: method
      }
    }
    function done(e, res, body) { callback (extractDebug(e, res, body)) }

    var p = Object.assign({}, conf, params)
    var token = genToken(p.uid, p.provider)
    var path = '/' + (p.path || '').trim().replace(/^\/+/,'').replace(/\.json$/i,'') + '.json'
    var url = "https://"+p.app+".firebaseio.com" + path + '?auth='+token
    var method = ops[p.operation]

  
    var r = request(method, url)
    if (p.data) {
      r.send(JSON.stringify(p.data))
      r.type('json')
    }

    r.end(done)
  }
}
