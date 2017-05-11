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
//import {Uuaa} from '../models/uuaa'
var ComparativaService = (function () {
    function ComparativaService(_http) {
        this._http = _http;
        this.url = 'http://localhost:3845/api/';
    }
    ComparativaService.prototype.getIdUuaa = function (idchannel, name) {
        return this._http.get(this.url + 'getIdUuaa/' + idchannel + '/' + name)
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
    ComparativaService.prototype.getIdChannel = function (channel) {
        return this._http.get(this.url + 'getIdChannel/' + channel)
            .map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getIdHost = function (idchannel, name) {
        return this._http.get(this.url + 'getIdHost/' + idchannel + '/' + name)
            .map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getDataHostComparativa = function (idhost, desde, hasta, channel, uuaa, kpi) {
        return this._http.get(this.url + 'getDataHostComparativa/' + idhost + '/fechas/' + desde +
            '/' + hasta + '/' + channel + '/' + uuaa + '/' + kpi).map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getIdClon = function (idchannel, name) {
        return this._http.get(this.url + 'getIdClon/' + idchannel + '/' + name)
            .map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getclonDataComparativa = function (idclon, desde, hasta, kpi) {
        return this._http.get(this.url + 'getclonDataComparativa/' + idclon + '/fechas/' + desde +
            '/' + hasta + '/' + kpi).map(function (res) { return res.json(); });
    };
    ComparativaService.prototype.getWaterMark = function (idmonitors) {
        return this._http.get(this.url + 'getWaterMark/' + idmonitors)
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