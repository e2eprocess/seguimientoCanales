"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PropertiesSeries = (function () {
    function PropertiesSeries(colorMonitor, colorHost) {
        if (colorMonitor === void 0) { colorMonitor = ["blue", "green", "#5499C7"]; }
        if (colorHost === void 0) { colorHost = ["rgba(4,38,253,1)", "rgba(49,4,247,1)", "rgba(4,129,255,1)", "rgba(95,173,255,1)"]; }
        this.colorMonitor = colorMonitor;
        this.colorHost = colorHost;
    }
    return PropertiesSeries;
}());
exports.PropertiesSeries = PropertiesSeries;
//# sourceMappingURL=propertiesSeries.js.map