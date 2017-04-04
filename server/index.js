'use strict'

global.config = require('./config');
var app = require('./app');
var port = process.env.PORT || global.config.host.port;

app.listen(port, function() {
  console.log('API Rest favoritos funcionando en http://localhost:'+port);
});
