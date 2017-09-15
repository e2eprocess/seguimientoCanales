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
var propertiesSeries_1 = require("../models/propertiesSeries");
var VisionMaquina = (function () {
    function VisionMaquina(_comparativaService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._route = _route;
        this._router = _router;
    }
    VisionMaquina.prototype.ngOnInit = function () {
        this.visionMaquina();
    };
    VisionMaquina.prototype.pintarGrafica = function (series, periodo) {
        if (periodo.includes('diezDias')) {
            var subTitle = ' Visión últimos 10 días';
        }
        else {
            var subTitle = ' Visión últimos 40 días';
        }
        jQuery('#' + periodo).highcharts({
            chart: {
                zoomType: 'xy',
                height: 350,
                type: 'area'
            },
            title: {
                text: 'CPU MÁQUINA (máximos)',
            }, subtitle: {
                text: subTitle
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
            yAxis: [{
                    labels: {
                        format: '{value} %'
                    },
                    title: {
                        text: 'CPU %'
                    },
                    max: 100
                }],
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
            series: series
        });
    };
    VisionMaquina.prototype.obtencionSeries = function (host, periodo, i) {
        var _this = this;
        var serie = {
            name: '',
            color: 0,
            data: []
        };
        var properties = new propertiesSeries_1.PropertiesSeries(), color = i % properties.colorHostHighstock.length;
        serie.color = properties.colorHostHighstock[color];
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDateAndDataMachine(host.name, periodo, 'CPU').subscribe(function (response) {
                serie.name = host.name;
                serie.data = response.data;
                resolve(serie);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
                reject();
            });
        });
    };
    VisionMaquina.prototype.gestionGrafico = function (periodo, host) {
        var _this = this;
        var promesas = [];
        host.forEach(function (elemento, index) {
            promesas.push(_this.obtencionSeries(elemento, periodo, index));
        });
        Promise.all(promesas).then(function (resultado) {
            if (periodo.includes('10 days')) {
                _this.pintarGrafica(resultado, 'diezDias');
            }
            else {
                _this.pintarGrafica(resultado, 'cuarentaDias');
            }
        });
    };
    VisionMaquina.prototype.visionMaquina = function () {
        var _this = this;
        this._route.params.forEach(function (params) {
            var channel = params['channel'];
            _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                var idchannel = response.data.idchannel;
                _this._comparativaService.getIdHostChannel(idchannel).subscribe(function (response) {
                    var host = response.data;
                    _this.gestionGrafico('10 days', host);
                    _this.gestionGrafico('40 days', host);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención del ID de los Host');
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
    return VisionMaquina;
}());
VisionMaquina = __decorate([
    core_1.Component({
        selector: 'visionMaquina',
        templateUrl: 'app/views/vision_maquina.html',
        providers: [
            comparativa_service_1.ComparativaService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        router_1.ActivatedRoute,
        router_1.Router])
], VisionMaquina);
exports.VisionMaquina = VisionMaquina;
//# sourceMappingURL=visionMaquina.component.js.map