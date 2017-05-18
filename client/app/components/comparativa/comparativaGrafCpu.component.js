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
var GraficaCpu = (function () {
    function GraficaCpu(_comparativaService) {
        this._comparativaService = _comparativaService;
        this.data = [];
    }
    GraficaCpu.prototype.inicioGrafico = function (hosts, channel, uuaa, fechas) {
        var _this = this;
        //delcaracion Array contenedor promesas a esperar
        var promesas = [];
        //por cada monitor se obtienen los datos
        hosts.forEach(function (host, index) {
            promesas.push(_this.obtencionSerie(host, channel, uuaa, fechas.fromDesde, fechas.fromHasta, 'from', index));
        });
        //Una vez terminadas todas las promesas (obtención datos idHosttor) ejecución de la gráfica.
        Promise.all(promesas).then(function () {
            hosts.forEach(function (host, index) {
                promesas.push(_this.obtencionSerie(host, channel, uuaa, fechas.toDesde, fechas.toHasta, 'to', index));
            });
            Promise.all(promesas).then(function () {
                _this.graficoCpu(fechas);
            });
        });
    };
    GraficaCpu.prototype.obtencionSerie = function (host, channel, uuaa, desde, hasta, busqueda, i) {
        var _this = this;
        //declaración promesa
        return new Promise(function (resolve, reject) {
            //
            _this._comparativaService.getDatavalueHost(host.idhost, desde, hasta, channel.idchannel, uuaa, 'CPU')
                .subscribe(function (response) {
                var properties = new propertiesSeries_1.PropertiesSeries();
                var color = i % properties.colorHost.length;
                if (busqueda.includes('from')) {
                    var type = 'column', name = host.name + '_' + uuaa + ' (F)';
                }
                else {
                    var type = 'line', name = host.name + '_' + uuaa + ' (T)';
                }
                ;
                var series = {
                    name: name,
                    type: type,
                    color: properties.colorHost[color],
                    index: i,
                    legendIndex: i,
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
    GraficaCpu.prototype.graficoCpu = function (fechas) {
        //Hora +2 GMT (7200000 milisegundos).
        var fecha = ((new Date(fechas.toDesde)).getTime()) + 7200000;
        jQuery('#cpu').highcharts({
            chart: {
                zoomType: 'xy',
                height: 250
            },
            title: {
                text: 'Consumo CPU %'
            },
            subtitle: {
                text: 'Comparativa entre <b>' + fechas.from + '</b> y <b>' + fechas.to + '</b>'
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
                    text: 'CPU'
                },
                labels: {
                    format: '{value} %'
                },
                max: 100,
                lineWidth: 1
            },
            tooltip: {
                shared: true,
                followPointer: true,
                xDateFormat: '%H:%M'
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
                    pointInterval: 300 * 1000
                },
                line: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                    },
                    stacking: 'normal'
                },
                column: {
                    stacking: 'normal'
                }
            },
            series: this.data
        });
    };
    return GraficaCpu;
}());
GraficaCpu = __decorate([
    core_1.Component({
        selector: 'grafico-cpu',
        templateUrl: 'app/views/comparativa/cpu.html',
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService])
], GraficaCpu);
exports.GraficaCpu = GraficaCpu;
//# sourceMappingURL=comparativaGrafCpu.component.js.map