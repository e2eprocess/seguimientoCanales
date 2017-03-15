'use strict'

var app = require('./app');
var port = process.env.PORT || 3678;
var pg = require('pg');

app.listen(port, function() {
  console.log('API Rest favoritos funcionando en http://localhost:'+port);
});
