"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PropertiesSeries = (function () {
    function PropertiesSeries(colorMonitor, colorHost, colorHostHighstock) {
        if (colorMonitor === void 0) { colorMonitor = ["#004481", "#0A5FB4", "#2DCCCD", "#2A86CA", "#D8BE75", "#5BBEFF"]; }
        if (colorHost === void 0) { colorHost = ["#004481", "#0A5FB4", "#2DCCCD", "#2A86CA", "#D8BE75", "#5BBEFF"]; }
        if (colorHostHighstock === void 0) { colorHostHighstock = ["rgba(0,68,129,0.3)",
            "rgba(10,95,180,0.3)",
            "rgba(45,204,205,0.3)",
            "rgba(42,134,202,0.3)",
            "rgba(216,190,117,0.3)",
            "rgba(91,190,255,0.3)"
        ]; }
        this.colorMonitor = colorMonitor;
        this.colorHost = colorHost;
        this.colorHostHighstock = colorHostHighstock;
    }
    return PropertiesSeries;
}());
exports.PropertiesSeries = PropertiesSeries;
//# sourceMappingURL=propertiesSeries.js.map