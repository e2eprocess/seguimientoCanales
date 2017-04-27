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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var ComparativaService = (function () {
    function ComparativaService(_http) {
        this._http = _http;
        this.url = 'http://localhost:3845/api/';
    }
    ComparativaService.prototype.getUuaa = function (name) {
        return this._http.get(this.url + 'getUuaa/' + name)
            .map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getMonitors = function (iduuaa) {
        return this._http.get(this.url + 'getMonitors/' + iduuaa)
            .map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getDataMonitorComparativa = function (idmonitor, nameKpi, desde, hasta) {
        return this._http.get(this.url + 'getDataMonitorComparativa/' + idmonitor + '/' + nameKpi + '/' + 'fechas/' + desde + '/' + hasta)
            .map(function (res) { return res.json(); });
    };
    return ComparativaService;
}());
ComparativaService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ComparativaService);
exports.ComparativaService = ComparativaService;
//# sourceMappingURL=comparativa.service.js.map