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
var valoresTabla_1 = require("../models/valoresTabla");
var Transacciones = (function () {
    function Transacciones(_comparativaService, _highstockService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._highstockService = _highstockService;
        this._route = _route;
        this._router = _router;
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
        this.series = [];
    }
    Transacciones.prototype.ngOnInit = function () {
        var today = new Date();
        var date = new Date(today.setDate(today.getDate() - 1));
        this.fecha = {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        };
        this.transacciones(this.fecha);
    };
    Transacciones.prototype.onDateChanged = function (event) {
        this.fecha = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        this.transacciones(this.fecha);
    };
    Transacciones.prototype.pintarGrafico = function (series, canal) {
        var fecha = ((new Date(this.fechas.from)).getTime()) + 7200000;
        var grafHeight = 0;
        if (canal.name == 'acumulado') {
            series.forEach(function (serie) {
                switch (serie.id) {
                    case "APX":
                        serie.name = 'APX';
                        serie.index = 0;
                        serie.legendIndex = 1;
                        break;
                    case "HOST":
                        serie.name = 'HOST';
                        serie.index = 1;
                        serie.legendIndex = 0;
                        serie.color = '#072146';
                        break;
                    case "acumuladoTrx":
                        serie.index = 2;
                        serie.legendIndex = 2;
                        break;
                }
            });
            grafHeight = 250;
        }
        ;
        jQuery('#' + canal.name).highcharts({
            chart: {
                zoomType: 'xy',
                height: grafHeight
            },
            title: {
                text: canal.description
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                    title: { text: 'Peticiones' }
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
                series: {
                    pointStart: fecha,
                    pointInterval: 300 * 1000,
                    marker: {
                        enabled: false
                    }
                },
                column: {
                    stacking: 'normal'
                },
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
    Transacciones.prototype.obtencionDatos = function (idmonitor, kpi, fechas) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDatavalueMonitor(idmonitor, kpi, fechas.fromDesde, fechas.fromHasta)
                .subscribe(function (response) {
                resolve(response.data);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de los datos de ' + kpi + ' en el dashboard de Seguimiento');
                }
                reject();
            });
        });
    };
    Transacciones.prototype.obtencionPeticiones = function (canal, fecha) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDateAndThroughputGrouped('D', canal, fecha)
                .subscribe(function (response) {
                resolve(response);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención número de peticiones');
                }
                reject();
            });
        });
    };
    Transacciones.prototype.maxPeti = function (canal, fecha) {
        var _this = this;
        var idmonitor = 0;
        var seriePeticionesMax = {
            name: '',
            id: '',
            color: 'red',
            type: 'line',
            index: 1,
            legendIndex: 1,
            data: {},
            tooltip: {
                xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };
        switch (canal) {
            case "APX":
                idmonitor = 361;
                seriePeticionesMax.id = 'MaxAPX';
                break;
            case "HOST":
                idmonitor = 362;
                canal = 'TXHOST';
                seriePeticionesMax.id = 'MaxHOST';
                break;
            case "ACUMULADO":
                idmonitor = 363;
                canal = 'TRX';
                seriePeticionesMax.id = 'acumuladoTrx';
                break;
        }
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getGroupedWaterMark(canal, fecha.from)
                .subscribe(function (response) {
                seriePeticionesMax.name = 'Día max. TRX ' + response.dateTitle + '(' + response.datavalue + ')';
                fecha.fromDesde = response.date;
                fecha.fromHasta = response.date.replace('00:00:00', '23:59:00');
                _this.obtencionDatos(idmonitor, 'Throughput', fecha).then(function (resultado) {
                    seriePeticionesMax.data = resultado;
                    resolve(seriePeticionesMax);
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del día max. peticiones.');
                }
                reject();
            });
        });
    };
    Transacciones.prototype.estandar = function (canal, fechas) {
        var _this = this;
        var idmonitor = 0;
        var seriePeticiones = {
            name: '',
            id: '',
            color: '#0A5FB4',
            type: 'column',
            index: 0,
            legendIndex: 0,
            data: {},
            tooltip: {
                xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };
        switch (canal) {
            case "APX":
                idmonitor = 361;
                seriePeticiones.id = 'APX';
                break;
            case "HOST":
                idmonitor = 362;
                canal = 'TXHOST';
                seriePeticiones.id = 'HOST';
                break;
        }
        return new Promise(function (resolve, reject) {
            _this.obtencionDatos(idmonitor, 'Throughput', fechas).then(function (resultado) {
                seriePeticiones.data = resultado;
                _this.series.push(seriePeticiones);
                var f = new Date(), hoy = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
                if (hoy == fechas.from) {
                    _this._comparativaService.getThroughputToday(idmonitor, 'Throughput')
                        .subscribe(function (response) {
                        seriePeticiones.name = 'Transacciones ' + response.date + ' (' + response.datavalue + ')';
                        if (canal == 'APX') {
                            _this.valoresTabla.peticionesApx = response.datavalue;
                        }
                        else {
                            _this.valoresTabla.peticionesHost = response.datavalue;
                        }
                        ;
                        resolve(seriePeticiones);
                    });
                }
                else {
                    _this.obtencionPeticiones(canal, fechas.from).then(function (resultado) {
                        var result = JSON.stringify(resultado);
                        var resultObj = JSON.parse(result);
                        if (canal == 'APX') {
                            _this.valoresTabla.peticionesApx = resultObj.datavalue;
                        }
                        else {
                            _this.valoresTabla.peticionesHost = resultObj.datavalue;
                        }
                        ;
                        seriePeticiones.name = 'Transacciones ' + resultObj.date + ' (' + resultObj.datavalue + ')';
                        resolve(seriePeticiones);
                    });
                }
            });
        });
    };
    Transacciones.prototype.gestionGrafico = function (canal, fechas) {
        var _this = this;
        var promesasSeries = [];
        var datosCanal = {
            name: '',
            description: ''
        };
        switch (canal) {
            case "HOST":
                datosCanal.name = 'host';
                datosCanal.description = 'Trx Host';
                break;
            case "APX":
                datosCanal.name = 'apx';
                datosCanal.description = 'Trx APX';
                break;
        }
        return new Promise(function (resolve, reject) {
            promesasSeries.push(_this.estandar(canal, fechas));
            promesasSeries.push(_this.maxPeti(canal, fechas));
            Promise.all(promesasSeries).then(function (resultado) {
                _this.pintarGrafico(resultado, datosCanal);
                resolve();
            });
        });
    };
    Transacciones.prototype.transacciones = function (fecha) {
        var _this = this;
        this.fechas = new fechas_1.Fechas('', '', '', '', '', '');
        this.valoresTabla = new valoresTabla_1.ValoresTabla('', 0, 0, 0, '', 0, 0, 0);
        var promesasGraficos = [];
        var datosCanal = {
            name: '',
            description: ''
        };
        this.series = [];
        this.fechaTitulo = fecha.date.day + '-' + fecha.date.month + '-' + fecha.date.year;
        this.valoresTabla.fechaPeticion = this.fechaTitulo;
        this.fechas.from = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day;
        this.fechas.fromDesde = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 00:00:00';
        this.fechas.fromHasta = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 23:59:00';
        promesasGraficos.push(this.gestionGrafico('APX', this.fechas));
        promesasGraficos.push(this.gestionGrafico('HOST', this.fechas));
        Promise.all(promesasGraficos).then(function () {
            datosCanal.name = 'acumulado';
            datosCanal.description = 'Acumulado de TRX';
            _this.maxPeti('ACUMULADO', _this.fechas).then(function (resultado) {
                _this.series.push(resultado);
                _this.pintarGrafico(_this.series, datosCanal);
                _this.valoresTabla.fechaMaxPeticiones = _this.fechas.fromDesde.substring(8, 10) + '-' +
                    _this.fechas.fromDesde.substring(5, 8) +
                    _this.fechas.fromDesde.substring(0, 4);
                _this.obtencionPeticiones('APX', _this.fechas.fromDesde.substring(0, 10)).then(function (resultado) {
                    var result = JSON.stringify(resultado);
                    var resultObj = JSON.parse(result);
                    _this.valoresTabla.maxPeticionesApx = resultObj.datavalue;
                    _this.obtencionPeticiones('TXHOST', _this.fechas.fromDesde.substring(0, 10)).then(function (resultado) {
                        var result = JSON.stringify(resultado);
                        var resultObj = JSON.parse(result);
                        _this.valoresTabla.maxPeticionesHost = resultObj.datavalue;
                        _this.valoresTabla.sumPeticiones = _this.valoresTabla.peticionesApx + _this.valoresTabla.peticionesHost;
                        _this.valoresTabla.sumMaxPeticiones = _this.valoresTabla.maxPeticionesApx + _this.valoresTabla.maxPeticionesHost;
                        _this.valoresTabla.porcentajeHost = (_this.valoresTabla.peticionesHost * 100) / _this.valoresTabla.sumPeticiones;
                        _this.valoresTabla.porcentajeApx = (_this.valoresTabla.peticionesApx * 100) / _this.valoresTabla.sumPeticiones;
                        _this.valoresTabla.maxPorcentajeHost = (_this.valoresTabla.maxPeticionesHost * 100) / _this.valoresTabla.sumMaxPeticiones;
                        _this.valoresTabla.maxPorcentajeApx = (_this.valoresTabla.maxPeticionesApx * 100) / _this.valoresTabla.sumMaxPeticiones;
                        console.log(_this.valoresTabla);
                    });
                });
            });
        });
    };
    return Transacciones;
}());
Transacciones = __decorate([
    core_1.Component({
        selector: 'transacciones',
        templateUrl: 'app/views/transacciones.html',
        providers: [
            comparativa_service_1.ComparativaService,
            highstock_service_1.HighstockService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        highstock_service_1.HighstockService,
        router_1.ActivatedRoute,
        router_1.Router])
], Transacciones);
exports.Transacciones = Transacciones;
//# sourceMappingURL=transacciones.component.js.map