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
var comparativaGrafTiempo_component_1 = require("./comparativaGrafTiempo.component");
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
            //Obtención del iduuaa perteneciente al nombre de la UUAA proporcionada.
            _this._comparativaService.getUuaa(name).subscribe(function (response) {
                _this.uuaa = response.data;
                //Obtención del/los monitor/es perteneciente/s a la UUAA deseada
                _this._comparativaService.getMonitors(_this.uuaa.iduuaa).subscribe(function (response) {
                    _this.monitor = response.data;
                    //Grafcio tiempo respuesta
                    var graficoTime = new comparativaGrafTiempo_component_1.GraficaTiempo(_this._comparativaService);
                    graficoTime.inicioGrafico(_this.monitor);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        console.log(_this.errorMessage);
                        alert('Error en la petición obtención monitores asociados');
                    }
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                    alert('Error en la petición obtención iduuaa de la UUAA solicitada');
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