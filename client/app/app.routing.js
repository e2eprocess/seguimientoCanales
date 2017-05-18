"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var comparativa_component_1 = require("./components/comparativa.component");
var highstock_component_1 = require("./components/highstock.component");
var appRoutes = [
    { path: '', component: comparativa_component_1.Comparativa },
    { path: 'comparativa/:channel/:name', component: comparativa_component_1.Comparativa },
    { path: 'highstock/:channel', component: highstock_component_1.Highstock },
    { path: '**', component: comparativa_component_1.Comparativa }
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map