'use strict';

var http = require('http'),
    httpProxy = require('http-proxy');

const port = process.env.PORT || 5050;

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  let cameFromMCode = !!req.headers['X-Request-Code-Source'];

  if (req.method === 'GET' || !cameFromMCode) {
    console.info('headers:', req.headers);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({
      answer:'hi.',
      access_token:'nope.'
    }, null, 2));
    return;
  }

  proxy.web(req, res, {
    target: 'https://www.googleapis.com/oauth2/v4/token',
    secure: false,
  });
});

console.log(`listening on port ${port}`);
server.listen(port);