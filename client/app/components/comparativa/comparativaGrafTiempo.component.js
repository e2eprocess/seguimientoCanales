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
require("rxjs/add/operator/map");
var comparativa_service_1 = require("../../services/comparativa.service");
var propertiesSeries_1 = require("../../models/propertiesSeries");
var GraficaTiempo = (function () {
    function GraficaTiempo(_comparativaService) {
        this._comparativaService = _comparativaService;
        this.data = [];
    }
    GraficaTiempo.prototype.inicioGrafico = function (monitores, fechas) {
        var _this = this;
        //delcaracion Array contenedor promesas a esperar
        var promesas = [];
        //por cada monitor se obtienen los datos
        monitores.forEach(function (monitor, index) {
            promesas.push(_this.obtencionSerie(monitor, index, 'from', fechas.fromDesde, fechas.fromHasta));
        });
        //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
        Promise.all(promesas).then(function () {
            monitores.forEach(function (monitor, index) {
                promesas.push(_this.obtencionSerie(monitor, index, 'to', fechas.toDesde, fechas.toHasta));
            });
            Promise.all(promesas).then(function () {
                _this.graficoTiempo();
            });
        });
    };
    GraficaTiempo.prototype.obtencionSerie = function (monitor, i, busqueda, desde, hasta) {
        var _this = this;
        //declaración promesa
        return new Promise(function (resolve, reject) {
            //
            _this._comparativaService.getDatavalueMonitor(monitor.idmonitor, 'Time', desde, hasta)
                .subscribe(function (response) {
                var properties = new propertiesSeries_1.PropertiesSeries();
                if (busqueda.includes('from')) {
                    var type = 'spline', dashStyle = 'shortdot', name = monitor.name + ' (F)';
                }
                else {
                    var type = 'line', dashStyle = '', name = monitor.name + ' (T)';
                }
                ;
                var series = {
                    name: name,
                    type: type,
                    dashStyle: dashStyle,
                    color: properties.colorMonitor[i],
                    data: response.data
                };
                _this.data.push(series);
                //terminado la consulta devuelve la promesa
                resolve();
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
                //Rechazada la promesa
                reject();
            });
        });
    };
    GraficaTiempo.prototype.graficoTiempo = function () {
        jQuery('#tiempoRespuesta').highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Tiempo medio de respuesta (ms.)'
            },
            subtitle: {
                text: 'comparativa'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    hour: '%H:%M'
                }
            },
            yAxis: {
                title: {
                    text: 'milisegundos'
                },
                labels: {
                    format: '{value} ms.'
                },
                lineWidth: 1
            },
            tooltip: {
                shared: true,
                followPointer: true,
                xDateFormat: '%H:%M',
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
                    pointStart: 0,
                    pointInterval: 300 * 1000
                },
                line: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                        states: {
                            hover: { enabled: true }
                        }
                    }
                },
                spline: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                        states: {
                            hover: { enabled: true }
                        }
                    }
                }
            },
            series: this.data
        });
    };
    return GraficaTiempo;
}());
GraficaTiempo = __decorate([
    core_1.Component({
        selector: 'grafico-tiempo',
        templateUrl: 'app/views/comparativa/tiempoRespuesta.html',
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService])
], GraficaTiempo);
exports.GraficaTiempo = GraficaTiempo;
//# sourceMappingURL=comparativaGrafTiempo.component.js.map