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
var fechas_1 = require("../models/fechas");
var Comparativa = (function () {
    function Comparativa(_comparativaService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._route = _route;
        this._router = _router;
        this.myDatePickerOptions = {
            dateFormat: 'dd.mm.yyyy',
            height: '34px',
            width: '125px',
            markCurrentDay: true,
            toLocaleDateString: 'es',
            showClearDateBtn: false,
            inline: false,
            disableUntil: { year: 2016, month: 9, day: 2 }
        };
        this.locale = 'es';
    }
    Comparativa.prototype.ngOnInit = function () {
        var today = new Date();
        var dateTo = new Date();
        var dateFrom = new Date(today.setDate(today.getDate() - 7));
        this.from = { date: {
                year: dateFrom.getFullYear(),
                month: dateFrom.getMonth() + 1,
                day: dateFrom.getDate()
            } };
        this.to = { date: {
                year: dateTo.getFullYear(),
                month: dateTo.getMonth() + 1,
                day: dateTo.getDate()
            } };
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.onDateChangedFrom = function (event) {
        this.from = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        var copy = this.getCopyOfOptions();
        var fecha = event.date.day + '-' + event.date.month + '-' + event.date.year;
        this.myDatePickerOptions = copy;
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.onDateChangedTo = function (event) {
        this.to = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        var copy = this.getCopyOfOptions();
        this.myDatePickerOptions = copy;
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.getCopyOfOptions = function () {
        return JSON.parse(JSON.stringify(this.myDatePickerOptions));
    };
    Comparativa.prototype.comparativa = function (from, to) {
        var _this = this;
        this.fechas = new fechas_1.Fechas('', '', '', '', '', '');
        var horaMenos20 = new Date().getTime() - 1200000;
        if (new Date().toDateString() === new Date(to.date.year + '-' + to.date.month + '-' + to.date.day).toDateString()) {
            this.fechas.toHasta = to.date.year + '-' + to.date.month + '-' + to.date.day + ' ' + new Date(horaMenos20).getHours() + ':' +
                new Date(horaMenos20).getMinutes() + ':' + new Date(horaMenos20).getSeconds();
        }
        else {
            this.fechas.toHasta = to.date.year + '-' + to.date.month + '-' + to.date.day + ' 23:59:00';
        }
        this.fechas.toDesde = to.date.year + '-' + to.date.month + '-' + to.date.day + ' 00:00:00';
        this.fechas.fromDesde = from.date.year + '-' + from.date.month + '-' + from.date.day + ' 00:00:00';
        this.fechas.fromHasta = from.date.year + '-' + from.date.month + '-' + from.date.day + ' 23:59:00';
        this.fechas.to = to.date.day + '-' + to.date.month + '-' + to.date.year;
        this.fechas.from = from.date.day + '-' + from.date.month + '-' + from.date.year;
        this._route.params.forEach(function (params) {
            var name = params['name'];
            _this.name = name;
            var channel = params['channel'];
            _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                _this.channel = response.data;
                //Obtención del iduuaa perteneciente al nombre de la UUAA proporcionada.
                _this._comparativaService.getIdUuaa(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.uuaa = response.data;
                    _this._comparativaService.getMonitors(_this.uuaa.iduuaa).subscribe(function (response) {
                        _this.monitors = response.data;
                        //Grafcio tiempo respuesta
                        var graficoTiempo = new comparativaGrafTiempo_component_1.GraficaTiempo(_this._comparativaService);
                        graficoTiempo.inicioGrafico(_this.monitors, _this.fechas);
                        var graficoPeticiones = new comparativaGrafPeticiones_component_1.GraficaPeticiones(_this._comparativaService);
                        graficoPeticiones.inicioGrafico(_this.monitors, _this.fechas);
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error en la obtención de los MONITORES asociados');
                        }
                    });
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la  obtención del IDUUAA de la UUAA solicitada');
                    }
                });
                _this._comparativaService.getIdHost(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.hosts = response.data;
                    var graficoCpu = new comparativaGrafCpu_component_1.GraficaCpu(_this._comparativaService);
                    graficoCpu.inicioGrafico(_this.hosts, _this.channel, name, _this.fechas);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención de los IDHOST asociados al Canal');
                    }
                });
                _this._comparativaService.getIdClon(_this.channel.idchannel, name).subscribe(function (response) {
                    _this.clon = response.data;
                    var graficoMemoria = new comparativaGrafMemoria_component_1.GraficaMemoria(_this._comparativaService);
                    graficoMemoria.inicioGrafico(_this.clon, _this.fechas);
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la petición obtención los idHosts asociados al Canal');
                    }
                });
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del IDCHANNEL');
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
//# sourceMappingURL=comparativa2.component.js.map