"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var comparativa_component_1 = require("./components/comparativa.component");
var informe_component_1 = require("./components/informe.component");
var highstock_component_1 = require("./components/highstock.component");
var seguimiento_component_1 = require("./components/seguimiento.component");
var transacciones_component_1 = require("./components/transacciones.component");
var visionMaquina_component_1 = require("./components/visionMaquina.component");
var appRoutes = [
    { path: '', component: seguimiento_component_1.Seguimiento },
    { path: 'seguimiento_canales', component: seguimiento_component_1.Seguimiento },
    { path: 'seguimiento_transacciones', component: transacciones_component_1.Transacciones },
    { path: 'comparativa/:channel', component: comparativa_component_1.Comparativa },
    { path: 'comparativa/:channel/:name', component: comparativa_component_1.Comparativa },
    { path: 'informe/:channel/:name', component: informe_component_1.Informe },
    { path: 'highstock/:channel/:idMonitor', component: highstock_component_1.Highstock },
    { path: 'V_MQ/:channel', component: visionMaquina_component_1.VisionMaquina },
    { path: '**', component: seguimiento_component_1.Seguimiento }
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map