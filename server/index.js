'use strict'

var config = require('./config').config;
var app = require('./app');
var port = process.env.PORT || config.host.port;
var logger = require('./gestionLog').logger;

app.listen(port, function() {
  logger.info('API Rest favoritos funcionando en http://localhost:'+port);
});
