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
var series_1 = require("../../models/series");
var GraficaTiempo = (function () {
    function GraficaTiempo(_comparativaService) {
        this._comparativaService = _comparativaService;
        this.data = [];
    }
    GraficaTiempo.prototype.inicioGrafico = function (monitor) {
        var _this = this;
        //delcaracion Array contenedor promesas a esperar
        var promesas = [];
        //por cada monitor se obtienen los datos
        for (var _i = 0, monitor_1 = monitor; _i < monitor_1.length; _i++) {
            var moni = monitor_1[_i];
            promesas.push(this.obtencionSerie(moni));
        }
        //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
        Promise.all(promesas).then(function () {
            _this.graficoTiempo();
        });
    };
    GraficaTiempo.prototype.obtencionSerie = function (moni) {
        var _this = this;
        //declaración promesa
        return new Promise(function (resolve, reject) {
            //
            _this._comparativaService.getDataMonitorComparativa(moni.idmonitor, 'Time', '2017-04-25 00:00:00', '2017-04-25 23:59:00')
                .subscribe(function (response) {
                _this.monitorData = response.data;
                _this.series = new series_1.Series(moni.name, response.data);
                _this.data.push(_this.series);
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
                text: 'Tiempo de respuesta (ms.)'
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
                    text: 'Tiempo de respuesta (ms.)'
                },
                labels: {
                    format: '{value} ms.'
                },
                lineWidth: 1
            },
            tooltip: {
                shared: true,
                followPointer: true,
                xDateFormat: '%H:%M'
            },
            legend: {
                layaout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 1,
                itemStyle: {
                    fontsize: "10px"
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