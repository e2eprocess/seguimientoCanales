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
var fechas_1 = require("../models/fechas");
var Seguimiento = (function () {
    function Seguimiento(_comparativaService, _highstockService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._highstockService = _highstockService;
        this._route = _route;
        this._router = _router;
        this.ejeX = [];
        this.myDatePickerOptions = {
            dateFormat: 'dd.mm.yyyy',
            height: '34px',
            width: '125px',
            markCurrentDay: true,
            toLocaleDateString: 'es',
            showClearDateBtn: false,
            inline: false,
            disableUntil: { year: 2016, month: 9, day: 2 }
        };
        this.locale = 'es';
    }
    Seguimiento.prototype.ngOnInit = function () {
        var today = new Date();
        var date = new Date(today.setDate(today.getDate() - 1));
        this.fecha = { date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            } };
        this.seguimiento(this.fecha);
    };
    Seguimiento.prototype.onDateChanged = function (event) {
        this.fecha = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        this.seguimiento(this.fecha);
    };
    Seguimiento.prototype.pintarGrafico = function (series, canal) {
        jQuery('#' + canal.name).highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: canal.description,
                x: -20
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                    labels: {
                        format: '{value} ms.'
                    },
                    title: {
                        text: 'Tiempo de respuesta (ms.)'
                    }
                }, {
                    title: {
                        text: 'Peticiones'
                    },
                    opposite: true,
                }],
            tooltip: {
                shared: true,
                followPointer: true,
                borderColor: 'grey'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 1,
                itemStyle: {
                    fontSize: "10px"
                }
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                    }
                },
                scatter: {
                    marker: {
                        symbol: 'square',
                        radius: 1
                    }
                }
            },
            series: series
        });
    };
    Seguimiento.prototype.obtencionWaterMakr = function (idmonitor, fechas) {
        var _this = this;
        var datos = [];
        var serieMaxPeti = {
            name: '',
            color: 'rgba(255,0,0,1.0)',
            type: 'line',
            yAxis: 1,
            legendIndex: 2,
            data: []
        };
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getWaterMark(idmonitor).subscribe(function (response) {
                serieMaxPeti.name = 'Max. peticiones' + response.data.fecha;
                var valor = response.data.max_peticiones;
                _this._comparativaService.getDate(idmonitor, fechas.fromDesde, fechas.fromHasta)
                    .subscribe(function (response) {
                    response.data.forEach(function (elem) {
                        datos.push([elem[0], parseInt(valor)]);
                    });
                    serieMaxPeti.data = datos;
                    resolve(serieMaxPeti);
                }, function (error) {
                });
            }, function (error) {
                reject();
            });
        });
    };
    Seguimiento.prototype.obtencionDatos = function (idmonitor, kpi, fechas) {
        var _this = this;
        var serieTime = {
            name: 'Tiempo Respuesta',
            id: 'Tiempo',
            color: '#2DCCCD',
            type: 'line',
            index: 1,
            legendIndex: 0,
            data: [],
            tooltip: {
                xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };
        var seriePeticiones = {
            name: 'Peticiones',
            id: 'Peticiones',
            color: '#0A5FB4',
            type: 'column',
            yAxis: 1,
            index: 0,
            legendIndex: 1,
            data: [],
            tooltip: {
                xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };
        return new Promise(function (resolve, reject) {
            _this._highstockService.getDateAndDataValueMonitor(idmonitor, kpi, fechas.fromDesde, fechas.fromHasta)
                .subscribe(function (response) {
                if (kpi == 'Time') {
                    serieTime.data = response.data;
                    resolve(serieTime);
                }
                else {
                    seriePeticiones.data = response.data;
                    resolve(seriePeticiones);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de los datos de ' + kpi + ' en el dashboard de Seguimiento');
                }
                reject();
            });
        });
    };
    Seguimiento.prototype.obtencionNombreCanal = function (idmonitor) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDescriptionChannel(idmonitor).subscribe(function (response) {
                if (response.data.name == 'office') {
                    _this._comparativaService.getNameDescriptionMonitor(idmonitor).subscribe(function (response) {
                        resolve(response.data);
                    }, function (error) {
                        if (_this.errorMessage != null) {
                            alert('Error en la obtención de la descripción del monitor para Oficinas');
                        }
                        reject();
                    });
                }
                else {
                    resolve(response.data);
                }
            }, function (error) {
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de la descripción del canal');
                }
                reject();
            });
        });
    };
    Seguimiento.prototype.gestionGrafico = function (idmonitor, fechas) {
        var _this = this;
        var promesas = [];
        this.obtencionNombreCanal(idmonitor).then(function (canal) {
            promesas.push(_this.obtencionDatos(idmonitor, 'Throughput', fechas));
            promesas.push(_this.obtencionDatos(idmonitor, 'Time', fechas));
            promesas.push(_this.obtencionWaterMakr(idmonitor, fechas));
            Promise.all(promesas).then(function (resultado) {
                _this.pintarGrafico(resultado, canal);
            });
        });
    };
    Seguimiento.prototype.seguimiento = function (fecha) {
        this.fechas = new fechas_1.Fechas('', '', '', '', '', '');
        this.fechaTitulo = fecha.date.day + '-' + fecha.date.month + '-' + fecha.date.year;
        this.fechas.fromDesde = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 07:00:00';
        this.fechas.fromHasta = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 23:59:00';
        //Gestión Net Particulares
        this.gestionGrafico(14, this.fechas);
        //Gestión Banca empresas
        this.gestionGrafico(1, this.fechas);
        //Gestión Movil
        this.gestionGrafico(15, this.fechas);
        //Gestión Escenarios comerciales
        this.gestionGrafico(17, this.fechas);
        //Gestión Objeto cliente
        this.gestionGrafico(16, this.fechas);
    };
    return Seguimiento;
}());
Seguimiento = __decorate([
    core_1.Component({
        selector: 'seguimiento',
        templateUrl: 'app/views/seguimiento.html',
        providers: [
            comparativa_service_1.ComparativaService,
            highstock_service_1.HighstockService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        highstock_service_1.HighstockService,
        router_1.ActivatedRoute,
        router_1.Router])
], Seguimiento);
exports.Seguimiento = Seguimiento;
//# sourceMappingURL=seguimiento.component.js.map