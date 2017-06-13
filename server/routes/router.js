'use strict'

var express = require('express');
var api = express.Router();

var controller = require('../controllers/controller');
var monitorController = require('../controllers/monitorController');
var hostController = require('../controllers/hostController');
var clonController = require('../controllers/clonController');

api.get('/getIdUuaa/:idchannel/:name', controller.getIdUuaa);
api.get('/getIdChannel/:channel', controller.getIdChannel);
api.get('/getDescriptionChannel/:idmonitor', controller.getDescriptionChannel);

api.get('/getMonitors/:iduuaa', monitorController.getMonitors);
api.get('/getNameDescriptionMonitor/:idmonitor', monitorController.getNameDescriptionMonitor);
api.get('/getDateAndDataValueMonitor/:idmonitor/:namekpi/fechas/:desde/:hasta', monitorController.getDateAndDataValueMonitor);
api.get('/getDataValueMonitor/:idmonitor/:namekpi/fechas/:desde/:hasta', monitorController.getDataValueMonitor);
api.get('/getDate/:idmonitor/fechas/:desde/:hasta', monitorController.getDate);
api.get('/getWaterMark/:monitors', monitorController.getWaterMark);
api.get('/getDataMonitorInforme/:idmonitor/:fecha/:interval/:kpi', monitorController.getDataMonitorInforme);


api.get('/getIdHost/:idchannel/:name', hostController.getIdHost);
api.get('/getIdHostChannel/:idchannel', hostController.getIdHostChannel);
api.get('/getDateAndDatavalueHost/:idhost/:kpi/fechas/:desde/:hasta', hostController.getDateAndDatavalueHost);
api.get('/getDatavalueHost/:idhost/:kpi/fechas/:desde/:hasta', hostController.getDatavalueHost);
api.get('/getDateAndDatavalueClonByHost/:idhost/fechas/:desde/:hasta/:channel/:uuaa/:kpi', clonController.getDateAndDatavalueClonByHost);
api.get('/getDatavalueClonByHost/:idhost/fechas/:desde/:hasta/:channel/:uuaa/:kpi', clonController.getDatavalueClonByHost);


api.get('/getIdClon/:idchannel/:name', clonController.getIdClon);
api.get('/getClonDataComparativa/:idclon/fechas/:desde/:hasta/:kpi', clonController.getDateAndDatavalueClon);
api.get('/getDatavalueClon/:idclon/fechas/:desde/:hasta/:kpi', clonController.getDatavalueClon);

module.exports = api;
