'use strict'

var express = require('express');
var api = express.Router();

var controller = require('../controllers/controller');

api.get('/grafico', controller.grafico1);

module.exports = api;
