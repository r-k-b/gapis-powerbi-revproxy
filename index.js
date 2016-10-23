'use strict';

var http = require('http'),
  httpProxy = require('http-proxy');

const port = process.env.PORT || 5050;

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function (req, res) {

  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    if(statusCode === 404 || statusCode === 401) {
      res.oldWriteHead(200, headers);
      return;
    }
    res.oldWriteHead(statusCode, headers);
  };

  proxy.web(req, res, {
    target: 'https://www.googleapis.com/',
    secure: false,
  });
});

console.log(`listening on port ${port}`);
server.listen(port);


proxy.on('proxyReq', function (proxyReq, req, res, options) {
  console.info('proxyReq event');
});

proxy.on('proxyRes', function (proxyReq, req, res, options) {
  console.info('proxyRes event');

  // if (proxyReq.statusCode === 404) {
  //   console.info('404\'d req headers:', req.headers);
  //   res.writeHead(200, {"Content-Type": "application/json"});
  //   res.end(JSON.stringify({
  //     answer:'hi.',
  //     access_token:'nope.'
  //   }, null, 2));
  // }
});


// Listen for the `error` event on `proxy`.
// as we will generate a big bunch of errors
proxy.on('error', function (err, req, res) {
  console.log('error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end("Oops");
});