"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var angular2_highcharts_1 = require("angular2-highcharts");
var app_routing_1 = require("./app.routing");
var mydatepicker_1 = require("mydatepicker");
var app_component_1 = require("./app.component");
var comparativa_component_1 = require("./components/comparativa.component");
var comparativaGrafTiempo_component_1 = require("./components/comparativa/comparativaGrafTiempo.component");
var comparativaGrafPeticiones_component_1 = require("./components/comparativa/comparativaGrafPeticiones.component");
var comparativaGrafCpu_component_1 = require("./components/comparativa/comparativaGrafCpu.component");
var comparativaGrafMemoria_component_1 = require("./components/comparativa/comparativaGrafMemoria.component");
var highstock_component_1 = require("./components/highstock.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            http_1.JsonpModule,
            app_routing_1.routing,
            angular2_highcharts_1.ChartModule.forRoot(require('highcharts/highstock')),
            mydatepicker_1.MyDatePickerModule
        ],
        declarations: [
            app_component_1.AppComponent,
            comparativa_component_1.Comparativa,
            comparativaGrafTiempo_component_1.GraficaTiempo,
            comparativaGrafPeticiones_component_1.GraficaPeticiones,
            comparativaGrafCpu_component_1.GraficaCpu,
            comparativaGrafMemoria_component_1.GraficaMemoria,
            highstock_component_1.Highstock
        ],
        exports: [
            mydatepicker_1.MyDatePickerModule
        ],
        providers: [app_routing_1.appRoutingProviders],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map