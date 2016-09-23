var fs = require('fs')
var request = require('superagent')

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
  function genToken(uid, provider, simulate) {
    if (!uid) throw new Error('uid not provided to token generator')
    return tokenGenerator.createToken({
      provider: provider || 'anonymous', 
      uid: uid }, { debug: true, simulate: simulate===true});
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
      var rawText = text.replace('with auth=','').replace(json,'')
      return {
        auth: JSON.parse(json),
        rawText: rawText,
        text: rawText
          .replace(/=\> (false)/ig,"\n=> \033[31m$1\033[0m\n")
          .replace(/=\> (true)/ig,"\n=> \033[34m$1\033[0m\n")
          .replace(/(\<no rules\>)/ig, "\033[31m$1\033[0m\n")
          .replace(/(\/ \/)/g, '\n\n$1')
      }
    }
    function extractDebug(e, res, body, token) {

      var headers = e && e.response && e.response.headers || {}

      var error = 
        extractAuth(headers)
      delete headers['x-firebase-auth-debug']
      var status = res ? res.status : e ? (e.status || e.res && e.res.status || -1) : -1
      return {
        token,
        headers,
        status: status,
        
        error: error,
        success: !error && (status < 400),
        path: path,
        operation: p.operation,
        method: method
      }
    }
    function done(e, res, body) { callback (null, extractDebug(e, res, body, token)) }
    function notFound(key) { callback('parameter `'+key+'` was not provided') }

    var p = Object.assign({}, conf, params)

    if (!p.uid) return notFound('uid')
    var token = genToken(p.uid, p.provider, p.simulate)
    if (p.generateToken) return callback(null, {token})

    var missing = ['uid', 'secret', 'app', 'operation'].find(key=>!p[key])
    if (missing) return notFound(missing)

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
