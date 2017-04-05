'use strict'

var express = require('express');
var api = express.Router();

var controller = require('../controllers/controller');

api.get('/getUUAA/:name', controller.getUuaa);
api.get('/getMonitors/:iduuaa', controller.getMonitors);
api.get('/getDataMonitor/:idmonitor/:namekpi/fechas/:desde/:hasta', controller.getDataMonitor);

module.exports = api;
