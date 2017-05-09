'use strict'

global.config = require('./config');
var app = require('./app');
var port = process.env.PORT || global.config.host.port;
var logger = require('./gestionLog').logger;

app.listen(port, function() {
  logger.info('API Rest favoritos funcionando en http://localhost:'+port);
});
