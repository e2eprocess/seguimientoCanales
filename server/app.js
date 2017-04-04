'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var api = require('./routes/router');

global.config = require('./config');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api',api);

module.exports = app;
