'use strict'

var express = require('express');
var api = express.Router();

var db = require('../controllers/queries');

api.get('/consulta', db.consulta);

module.exports = api;
