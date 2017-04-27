'use strict'

var express = require('express');
var api = express.Router();

var controller = require('../controllers/controller');
var monitorController = require('../controllers/monitorController');
var hostController = require('../controllers/hostController');

api.get('/getUUAA/:name', controller.getUuaa);
api.get('/getIdChannel/:channel', controller.getIdChannel);

api.get('/getMonitors/:iduuaa', monitorController.getMonitors);
api.get('/getDataMonitorComparativa/:idmonitor/:namekpi/fechas/:desde/:hasta', monitorController.getDataMonitorComparativa);

api.get('/getIdHost/:idchannel/:name', hostController.getIdHost);

module.exports = api;
