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
var Informe = (function () {
    function Informe(_comparativaService, _highstockService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._highstockService = _highstockService;
        this._route = _route;
        this._router = _router;
    }
    Informe.prototype.ngOnInit = function () {
        this.informe();
    };
    Informe.prototype.informe = function () {
        var date = new Date();
        var mes = date.getMonth() + 1;
        var fecha = date.getFullYear() + '-' + mes + '-' + date.getDate();
        console.log(fecha);
    };
    return Informe;
}());
Informe = __decorate([
    core_1.Component({
        selector: 'comparativa',
        templateUrl: 'app/views/informe.html',
        providers: [
            comparativa_service_1.ComparativaService,
            highstock_service_1.HighstockService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        highstock_service_1.HighstockService,
        router_1.ActivatedRoute,
        router_1.Router])
], Informe);
exports.Informe = Informe;
//# sourceMappingURL=informe.component.js.map