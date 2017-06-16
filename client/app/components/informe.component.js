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
var informe_service_1 = require("../services/informe.service");
var propertiesSeries_1 = require("../models/propertiesSeries");
var Informe = (function () {
    function Informe(_comparativaService, _informeService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._informeService = _informeService;
        this._route = _route;
        this._router = _router;
    }
    Informe.prototype.ngOnInit = function () {
        this.series = [];
        this.informe();
    };
    Informe.prototype.grafico = function (series) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var grafico = {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: _this.name + ' - APLICACÓN'
                },
                subtitle: {
                    text: 'Subtitulo'
                },
                credits: { enabled: false },
                navigator: { enabled: false },
                scrollbar: { enabled: false },
                rangeSelector: { enabled: false },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [{
                        labels: {
                            format: '{value} ms.'
                        },
                        title: {
                            text: 'Tiempo de respuesta (ms.)'
                        },
                        min: 0,
                        opposite: false
                    }, {
                        title: {
                            text: 'Peticiones por hora'
                        }
                    }],
                tooltip: {
                    shared: true,
                    crosshair: true
                },
                legend: {
                    enabled: true,
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
                    },
                    series: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2
                        },
                        fillOpacity: 0.5
                    },
                    flags: {
                        tooltip: {
                            xDateFormat: '%B %e, %Y'
                        }
                    }
                },
                series: series
            };
            resolve(grafico);
        });
    };
    Informe.prototype.getDataMonitors = function (index, monitor, fecha, interval, kpi) {
        var _this = this;
        var series = [];
        var properties = new propertiesSeries_1.PropertiesSeries();
        return new Promise(function (resolve, reject) {
            var serie = {
                name: '',
                type: '',
                color: 0,
                yAxis: 0,
                index: index,
                legendIndex: index,
                dataGrouping: {
                    enabled: false
                },
                data: []
            };
            serie.name = monitor.name;
            if (kpi.includes('Time')) {
                serie.name = 'Tiempo respuesta ' + monitor.name;
                serie.type = 'line';
                serie.color = properties.colorHost[index % properties.colorHost.length];
                _this._informeService.getDataMonitorInformeTime(monitor.idmonitor, fecha, interval, kpi).subscribe(function (response) {
                    serie.data = response.data;
                    resolve(serie);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención de los datos de las series');
                    }
                });
            }
            else {
                serie.name = 'Peticiones ' + monitor.name;
                serie.type = 'column';
                serie.yAxis = 1;
                _this._informeService.getDataMonitorInformePeticiones(monitor.idmonitor, fecha, interval, kpi).subscribe(function (response) {
                    serie.data = response.data;
                    resolve(serie);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención de los datos de las series');
                    }
                });
            }
        });
    };
    Informe.prototype.gestionMonitores = function (iduuaa, fecha, interval) {
        var _this = this;
        this._comparativaService.getMonitors(iduuaa).subscribe(function (response) {
            var monitors = response.data;
            var promesasMonitors = [];
            monitors.forEach(function (monitor, index) {
                promesasMonitors.push(_this.getDataMonitors(index, monitor, fecha, interval, 'Throughput'));
                promesasMonitors.push(_this.getDataMonitors(index, monitor, fecha, interval, 'Time'));
            });
            Promise.all(promesasMonitors).then(function (resultado) {
                if (interval.includes('10')) {
                    _this.grafico(resultado).then(function (res) {
                        _this.apl_semanal = res;
                    });
                }
                else {
                    _this.grafico(resultado).then(function (res) {
                        _this.apl_mensual = res;
                    });
                }
            });
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error en la obtención del ID del monitor');
            }
        });
    };
    Informe.prototype.informe = function () {
        var _this = this;
        var date = new Date();
        var horaMenos20 = new Date().getTime() - 1200000;
        var mes = date.getMonth() + 1;
        var fecha = date.getFullYear() + '-' + mes + '-' + date.getDate() + ' ' + new Date(horaMenos20).getHours() + ':' +
            new Date(horaMenos20).getMinutes() + ':' + new Date(horaMenos20).getSeconds();
        this._route.params.forEach(function (params) {
            //Recupera parametros URL.
            var name = params['name'];
            var channel = params['channel'];
            _this.name = name;
            _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                _this._comparativaService.getIdUuaa(response.data.idchannel, name).subscribe(function (response) {
                    _this.uuaa = response.data;
                    var idUuaa = response.data.iduuaa;
                    _this.gestionMonitores(idUuaa, fecha, '10 days');
                    _this.gestionMonitores(idUuaa, fecha, '40 days');
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención del ID de la UUAA');
                    }
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del ID del canal');
                }
            });
        });
    };
    return Informe;
}());
Informe = __decorate([
    core_1.Component({
        selector: 'comparativa',
        templateUrl: 'app/views/informe.html',
        providers: [
            comparativa_service_1.ComparativaService,
            informe_service_1.InformeService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        informe_service_1.InformeService,
        router_1.ActivatedRoute,
        router_1.Router])
], Informe);
exports.Informe = Informe;
//# sourceMappingURL=informe.component.js.map