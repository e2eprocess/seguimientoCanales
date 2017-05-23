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
var fechas_1 = require("../models/fechas");
var Seguimiento = (function () {
    function Seguimiento(_comparativaService, _highstockService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._highstockService = _highstockService;
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
    Seguimiento.prototype.ngOnInit = function () {
        var date = new Date();
        this.fecha = { date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            } };
        this.seguimiento(this.fecha);
    };
    Seguimiento.prototype.onDateChangedTo = function (event) {
        this.fecha = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        this.seguimiento(this.fecha);
    };
    Seguimiento.prototype.gestionGrafico = function (idmonitor, fechas) {
        var _this = this;
        var promesas = [];
        promesas.push(this.obtencionDatos(idmonitor, 'Throughput', fechas));
        promesas.push(this.obtencionDatos(idmonitor, 'Time', fechas));
        Promise.all(promesas).then(function (resultado) {
            _this.pintarGrafico(resultado);
        });
    };
    Seguimiento.prototype.obtencionDatos = function (idmonitor, kpi, fechas) {
        var _this = this;
        var serieTime = {
            name: 'Tiempo Respuesta',
            id: 'Tiempo',
            color: 'rgba(41,198,248,1.0)',
            type: 'line',
            index: 1,
            legendIndex: 0,
            data: [],
            tooltip: {
                xDateFormat: '%e %B %Y %H:%MM'
            },
            turboThreshold: 0
        };
        var seriePeticiones = {
            name: 'Peticiones',
            id: 'Peticiones',
            color: 'rgba(65,105,225,1.0)',
            type: 'column',
            yAxis: 1,
            index: 1,
            legendIndex: 1,
            data: [],
            tooltip: {
                xDateFormat: '%e %B %Y %H:%MM'
            },
            turboThreshold: 0
        };
        return new Promise(function (resolve, reject) {
            _this._highstockService.getDateAndDataValueMonitor(idmonitor, kpi, fechas.fromDesde, fechas.fromHasta)
                .subscribe(function (response) {
                if (kpi == 'Time') {
                    serieTime.data = response.data;
                    resolve(serieTime);
                }
                else {
                    seriePeticiones.data = response.data;
                    resolve(seriePeticiones);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de los datos de ' + kpi + ' en el dashboard de Seguimiento');
                }
                reject();
            });
        });
    };
    Seguimiento.prototype.pintarGrafico = function (series) {
        return new Promise(function (resolve, reject) {
            console.log('mUESTRA EL ARRAY');
            console.log(series);
            resolve();
        });
    };
    Seguimiento.prototype.seguimiento = function (fecha) {
        this.fechas = new fechas_1.Fechas('', '', '', '', '', '');
        //Gestión Net Particulares
        this.fechas.fromDesde = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 07:00:00';
        this.fechas.fromHasta = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 23:59:00';
        this.gestionGrafico(14, this.fechas);
        //Gestión Net Particulares	
        this.fechas.fromDesde = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 07:00:00';
        this.fechas.fromHasta = fecha.date.year + '-' + fecha.date.month + '-' + fecha.date.day + ' 21:59:00';
        this.gestionGrafico(1, this.fechas);
    };
    return Seguimiento;
}());
Seguimiento = __decorate([
    core_1.Component({
        selector: 'seguimiento',
        templateUrl: 'app/views/seguimiento.html',
        providers: [
            comparativa_service_1.ComparativaService,
            highstock_service_1.HighstockService
        ]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        highstock_service_1.HighstockService,
        router_1.ActivatedRoute,
        router_1.Router])
], Seguimiento);
exports.Seguimiento = Seguimiento;
//# sourceMappingURL=seguimiento.component.js.map