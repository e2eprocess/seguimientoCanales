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
var http_1 = require("@angular/http");
var comparativa_service_1 = require("../services/comparativa.service");
var Highstock = (function () {
    function Highstock(_route, _router, jsonp) {
        this._route = _route;
        this._router = _router;
        this.jsonp = jsonp;
    }
    Highstock.prototype.ngOnInit = function () {
        this.highstock();
    };
    Highstock.prototype.highstock = function () {
        var _this = this;
        this._route.params.forEach(function (params) {
            var channel = params['channel'];
            _this.channel = channel;
            _this.grafico();
        });
    };
    Highstock.prototype.grafico = function () {
        var _this = this;
        this.jsonp.request('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=JSONP_CALLBACK').subscribe(function (res) {
            _this.options = {
                chart: { type: "StockChart" },
                title: { text: 'AAPL Stock Price' },
                series: [{
                        name: 'AAPL',
                        type: 'area',
                        data: res.json(),
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
            };
        });
    };
    return Highstock;
}());
Highstock = __decorate([
    core_1.Component({
        selector: 'highstock',
        templateUrl: 'app/views/highstock.html',
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        http_1.Jsonp])
], Highstock);
exports.Highstock = Highstock;
//# sourceMappingURL=highstock.component.js.map