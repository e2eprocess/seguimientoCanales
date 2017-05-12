'use strict'

var express = require('express');
var api = express.Router();

var controller = require('../controllers/controller');
var monitorController = require('../controllers/monitorController');
var hostController = require('../controllers/hostController');
var clonController = require('../controllers/clonController');

api.get('/getIdUuaa/:idchannel/:name', controller.getIdUuaa);
api.get('/getIdChannel/:channel', controller.getIdChannel);

api.get('/getMonitors/:iduuaa', monitorController.getMonitors);
api.get('/getDataMonitorComparativa/:idmonitor/:namekpi/fechas/:desde/:hasta', monitorController.getDateAndDataValueMonitor);
api.get('/getDataValueMonitor/:idmonitor/:namekpi/fechas/:desde/:hasta', monitorController.getDataValueMonitor);
api.get('/getWaterMark/:monitors', monitorController.getWaterMark);

api.get('/getIdHost/:idchannel/:name', hostController.getIdHost);
api.get('/getDataHostComparativa/:idhost/fechas/:desde/:hasta/:channel/:uuaa/:kpi', hostController.getDateAndDatavalueHost);
api.get('/getDatavalueHost/:idhost/fechas/:desde/:hasta/:channel/:uuaa/:kpi', hostController.getDatavalueHost);


api.get('/getIdClon/:idchannel/:name', clonController.getIdClon);
api.get('/getClonDataComparativa/:idclon/fechas/:desde/:hasta/:kpi', clonController.getDateAndDatavalueClon);
api.get('/getDatavalueClon/:idclon/fechas/:desde/:hasta/:kpi', clonController.getDatavalueClon);

module.exports = api;
