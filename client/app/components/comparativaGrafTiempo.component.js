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
var comparativa_service_1 = require("../services/comparativa.service");
var series_1 = require("../models/series");
var GraficaTiempo = (function () {
    function GraficaTiempo(_comparativaService) {
        this._comparativaService = _comparativaService;
        this.data = [];
    }
    GraficaTiempo.prototype.ngOnInit = function () {
    };
    GraficaTiempo.prototype.inicioGrafico = function (monitor) {
        var _this = this;
        var promesas = [];
        console.log(monitor);
        for (var _i = 0, monitor_1 = monitor; _i < monitor_1.length; _i++) {
            var moni = monitor_1[_i];
            promesas.push(this.obtencionSerie(moni));
        }
        Promise.all(promesas).then(function () {
            _this.graficoTime();
        });
    };
    GraficaTiempo.prototype.obtencionSerie = function (moni) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDataMonitor(moni.idmonitor, 'Time', '2017-04-05 00:00:00', '2017-04-05 00:10:00')
                .subscribe(function (response) {
                _this.monitorData = response.data;
                _this.series = new series_1.Series(moni.name, response.data);
                console.log('Muestro la serie');
                console.log(_this.series);
                _this.data.push(_this.series);
                console.log('Muestro el estado del array data');
                console.log(_this.data);
                resolve();
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
                reject();
            });
        });
    };
    GraficaTiempo.prototype.graficoTime = function () {
        jQuery('#container').highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: 'US and USSR nuclear stockpiles'
            },
            subtitle: {
                text: 'Source: thebulletin.metapress.com'
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Nuclear weapon states'
                },
                labels: {
                    formatter: function () {
                        return this.value / 1000 + 'k';
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b>' +
                    '<br/>warheads in {point.x}'
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
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
        selector: 'grafico-time',
        template: "<div style=\"width:60%\" id=\"container\"></div>",
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService])
], GraficaTiempo);
exports.GraficaTiempo = GraficaTiempo;
//# sourceMappingURL=comparativaGrafTiempo.component.js.map