"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var comparativa_service_1 = require("../services/comparativa.service");
var highstock_service_1 = require("../services/highstock.service");
var propertiesSeries_1 = require("../models/propertiesSeries");
var Highstock = (function () {
    function Highstock(_comparativaService, _highstockService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._highstockService = _highstockService;
        this._route = _route;
        this._router = _router;
        this.series = [];
        this.arrayHost = [];
    }
    Highstock.prototype.ngOnInit = function () {
        this.highstock();
    };
    Highstock.prototype.obtenerMonitorData = function (idMonitor, kpi, desde, hasta) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._highstockService.getDateAndDataValueMonitor(idMonitor, kpi, desde, hasta).subscribe(function (response) {
                if (kpi == 'Time') {
                    _this.serie = {
                        type: 'line',
                        name: 'Tiempo de respuesta',
                        tooltip: {
                            valueDecimals: 2
                        },
                        color: 'blue',
                        data: response.data
                    };
                    _this.series.push(_this.serie);
                }
                else {
                    _this.serie = {
                        type: 'column',
                        name: 'Peticiones',
                        yAxis: 1,
                        tooltip: {
                            valueDecimals: 0
                        },
                        color: 'black',
                        data: response.data
                    };
                    _this.series.push(_this.serie);
                }
                resolve();
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de los datos de ' + kpi);
                }
                reject();
            });
        });
    };
    Highstock.prototype.obtenerHostData = function (host, desde, hasta, index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var properties = new propertiesSeries_1.PropertiesSeries();
            var color = index % properties.colorHostHighstock.length;
            _this._highstockService.getDateAndDatavalueHost(host.idhost, 'CPU', desde, hasta).subscribe(function (response) {
                _this.serie = {
                    type: 'area',
                    name: host.name,
                    yAxis: 2,
                    tooltip: {
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: "high"
                    },
                    index: index + 1,
                    legendIndex: index + 1,
                    color: properties.colorHostHighstock[color],
                    data: response.data
                };
                _this.series.push(_this.serie);
                resolve();
            }, function (error) {
                reject();
            });
        });
    };
    Highstock.prototype.highstock = function () {
        var _this = this;
        this._route.params.forEach(function (params) {
            _this.series = [];
            var channel = params['channel'];
            var idMonitor = params['idMonitor'];
            _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                _this.channel = response.data;
                _this.channelDescription = _this.channel.description;
                var horaMenos20 = new Date().getTime() - 1200000;
                var desde = '2016-09-01 16:00:00';
                var fechaHoy = new Date();
                var hasta = fechaHoy.getFullYear()
                    + '-' + (fechaHoy.getMonth() + 1)
                    + '-' + fechaHoy.getDate()
                    + ' ' + new Date(horaMenos20).getHours()
                    + ':' + new Date(horaMenos20).getMinutes()
                    + ':' + new Date(horaMenos20).getSeconds();
                var promesas = [];
                _this.obtenerMonitorData(idMonitor, 'Time', desde, hasta).then(function () {
                    _this.obtenerMonitorData(idMonitor, 'Throughput', desde, hasta).then(function () {
                        _this._highstockService.getIdHostChannel(_this.channel.idchannel).subscribe(function (response) {
                            _this.arrayHost = response.data;
                            _this.arrayHost.forEach(function (host, index) {
                                promesas.push(_this.obtenerHostData(host, desde, hasta, index));
                            });
                            Promise.all(promesas).then(function () {
                                _this.grafico();
                            });
                        }, function (error) {
                        });
                    });
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del IDCHANNEL');
                }
            });
        });
    };
    Highstock.prototype.grafico = function () {
        this.options = {
            chart: {
                type: "StockChart",
                zoomType: 'xy'
            },
            legend: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            rangeSelector: {
                buttons: [{
                        type: 'day',
                        count: 1,
                        text: 'D'
                    }, {
                        type: 'week',
                        count: 1,
                        text: 'W'
                    }, {
                        type: 'month',
                        count: 1,
                        text: 'M'
                    }, {
                        type: 'Ytd',
                        count: 1,
                        text: 'Y'
                    }],
                selected: 1,
                inputDateFormat: '%e-%m-%Y',
                inputEditDateFormat: '%e-%m-%Y'
            },
            yAxis: [{
                    title: {
                        text: 'Tiempo respuesta (ms.)'
                    },
                    height: '25%',
                    opposite: false,
                    lineWidth: 1
                }, {
                    title: {
                        text: 'Peticiones'
                    },
                    top: '30%',
                    height: '25%',
                    offset: 0,
                    opposite: false,
                    lineWidth: 1
                }, {
                    title: {
                        text: 'CPU %'
                    },
                    height: '25%',
                    top: '65%',
                    opposite: false,
                    lineWidth: 1,
                    offset: 0,
                    max: 100
                }],
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            tooltip: {
                split: true
            },
            series: this.series
        };
    };
    return Highstock;
}());
Highstock = __decorate([
    core_1.Component({
        selector: 'highstock',
        templateUrl: 'app/views/highstock.html',
        providers: [comparativa_service_1.ComparativaService,
            highstock_service_1.HighstockService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        highstock_service_1.HighstockService,
        router_1.ActivatedRoute,
        router_1.Router])
], Highstock);
exports.Highstock = Highstock;
//# sourceMappingURL=highstock.component.js.map