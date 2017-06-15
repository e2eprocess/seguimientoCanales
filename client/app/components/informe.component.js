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
    Informe.prototype.grafico = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var grafico = {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: _this.name + ' - APLICACÓN'
                },
                series: _this.series
            };
            resolve(grafico);
        });
    };
    Informe.prototype.getDataMonitors = function (monitors, fecha, interval, kpi) {
        var _this = this;
        var series = [];
        var properties = new propertiesSeries_1.PropertiesSeries();
        return new Promise(function (resolve, reject) {
            monitors.forEach(function (monitor, index) {
                var serie = {
                    name: '',
                    type: '',
                    color: 0,
                    yAxis: 0,
                    index: index,
                    legendIndex: index,
                    data: []
                };
                serie.name = monitor.name;
                if (kpi.includes('Time')) {
                    serie.name = 'Tiempo respuesta ' + monitor.name;
                    serie.type = 'Line';
                }
                else {
                    serie.name = 'Peticiones ' + monitor.name;
                    serie.type = 'Column';
                    serie.yAxis = 1;
                }
                serie.color = properties.colorHost[index % properties.colorHost.length];
                _this._informeService.getDataMonitorInforme(monitor.idmonitor, fecha, interval, kpi).subscribe(function (response) {
                    serie.data = response.data;
                    series.push(serie);
                    _this.series.push(serie);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención de los datos de las series');
                    }
                });
            });
            resolve(series);
        });
    };
    Informe.prototype.gestionMonitores = function (iduuaa, fecha, interval) {
        var _this = this;
        this._comparativaService.getMonitors(iduuaa).subscribe(function (response) {
            var promesasMonitors = [];
            promesasMonitors.push(_this.getDataMonitors(response.data, fecha, interval, 'Throughput'));
            Promise.all(promesasMonitors).then(function () {
                promesasMonitors.push(_this.getDataMonitors(response.data, fecha, interval, 'Time'));
                Promise.all(promesasMonitors).then(function (resultado) {
                    if (interval.includes('10')) {
                        console.log(_this.series);
                        var p1 = _this.grafico();
                        p1.then(function (res) {
                            console.log(res);
                            _this.options = res;
                        });
                    }
                    else {
                        console.log('Busqueda 40');
                    }
                });
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
        var mes = date.getMonth() + 1;
        var fecha = date.getFullYear() + '-' + mes + '-' + date.getDate();
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