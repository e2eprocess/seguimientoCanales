"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PropertiesSeries = (function () {
    function PropertiesSeries(colorMonitor, colorHost, colorHostHighstock, colorInformeTiempo, colorInformePeticiones, colorInformeCpu, colorInformeMemoria) {
        if (colorMonitor === void 0) { colorMonitor = ["#004481", "#0A5FB4", "#2DCCCD", "#2A86CA", "#D8BE75", "#5BBEFF"]; }
        if (colorHost === void 0) { colorHost = ["#004481", "#0A5FB4", "#2DCCCD", "#2A86CA", "#D8BE75", "#5BBEFF"]; }
        if (colorHostHighstock === void 0) { colorHostHighstock = ["rgba(0,68,129,0.3)",
            "rgba(10,95,180,0.3)",
            "rgba(45,204,205,0.3)",
            "rgba(42,134,202,0.3)",
            "rgba(216,190,117,0.3)",
            "rgba(91,190,255,0.3)"
        ]; }
        if (colorInformeTiempo === void 0) { colorInformeTiempo = ['rgba(248,0,0,1.0)', 'rgba(134,2,18,1.0)', 'rgba(244,3,32,1.0)']; }
        if (colorInformePeticiones === void 0) { colorInformePeticiones = ['rgba(3,61,244,1.0)', 'rgba(3,45,180,1.0)', 'rgba(3,11,180,1.0)']; }
        if (colorInformeCpu === void 0) { colorInformeCpu = ['rgba(3,61,244,1.0)', 'rgba(3,45,180,1.0)', 'rgba(3,11,180,1.0)']; }
        if (colorInformeMemoria === void 0) { colorInformeMemoria = ['rgba(6,250,239,1.0)', 'rgba(5,222,212,1.0)', 'rgba(3,199,190,1.0)']; }
        this.colorMonitor = colorMonitor;
        this.colorHost = colorHost;
        this.colorHostHighstock = colorHostHighstock;
        this.colorInformeTiempo = colorInformeTiempo;
        this.colorInformePeticiones = colorInformePeticiones;
        this.colorInformeCpu = colorInformeCpu;
        this.colorInformeMemoria = colorInformeMemoria;
    }
    return PropertiesSeries;
}());
exports.PropertiesSeries = PropertiesSeries;
//# sourceMappingURL=propertiesSeries.js.map