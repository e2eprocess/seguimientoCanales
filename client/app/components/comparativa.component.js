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
var comparativaGrafTiempo_component_1 = require("./comparativa/comparativaGrafTiempo.component");
var comparativaGrafPeticiones_component_1 = require("./comparativa/comparativaGrafPeticiones.component");
var comparativaGrafCpu_component_1 = require("./comparativa/comparativaGrafCpu.component");
var comparativaGrafMemoria_component_1 = require("./comparativa/comparativaGrafMemoria.component");
var comparativa_service_1 = require("../services/comparativa.service");
var Comparativa = (function () {
    function Comparativa(_comparativaService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._route = _route;
        this._router = _router;
    }
    Comparativa.prototype.ngOnInit = function () {
        this.comparativa();
    };
    Comparativa.prototype.comparativa = function () {
        var _this = this;
        this._route.params.forEach(function (params) {
            var name = params['name'];
            _this.name = name;
            var channel = params['channel'];
            _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                _this.channel = response.data;
                //Obtención del iduuaa perteneciente al nombre de la UUAA proporcionada.
                _this._comparativaService.getIdUuaa(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.uuaa = response.data;
                    //Obtención del/los monitor/es perteneciente/s a la UUAA deseada
                    _this._comparativaService.getMonitors(_this.uuaa.iduuaa).subscribe(function (response) {
                        _this.monitores = response.data;
                        //Grafcio tiempo respuesta
                        var graficoTiempo = new comparativaGrafTiempo_component_1.GraficaTiempo(_this._comparativaService);
                        graficoTiempo.inicioGrafico(_this.monitores);
                        var graficoPeticiones = new comparativaGrafPeticiones_component_1.GraficaPeticiones(_this._comparativaService);
                        graficoPeticiones.inicioGrafico(_this.monitores);
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error en la petición obtención monitores asociados');
                        }
                    });
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la petición obtención iduuaa de la UUAA solicitada');
                    }
                });
                _this._comparativaService.getIdHost(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.hosts = response.data;
                    var graficoCpu = new comparativaGrafCpu_component_1.GraficaCpu(_this._comparativaService);
                    graficoCpu.inicioGrafico(_this.hosts, _this.channel, name);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la petición obtención los idHosts asociados al Canal');
                    }
                });
                _this._comparativaService.getIdClon(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.clon = response.data;
                    var graficoMemoria = new comparativaGrafMemoria_component_1.GraficaMemoria(_this._comparativaService);
                    graficoMemoria.inicioGrafico(_this.clon);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la petición obtención los idHosts asociados al Canal');
                    }
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la petición obtención idChannel');
                }
            });
        });
    };
    return Comparativa;
}());
Comparativa = __decorate([
    core_1.Component({
        selector: 'comparativa',
        templateUrl: 'app/views/comparativa.html',
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        router_1.ActivatedRoute,
        router_1.Router])
], Comparativa);
exports.Comparativa = Comparativa;
//# sourceMappingURL=comparativa.component.js.map