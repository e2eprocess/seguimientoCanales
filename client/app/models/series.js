"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Series = (function () {
    function Series(name, data, type, dashStyle, color) {
        if (name === void 0) { name = ""; }
        if (data === void 0) { data = [""]; }
        if (type === void 0) { type = "area"; }
        if (dashStyle === void 0) { dashStyle = ""; }
        if (color === void 0) { color = ""; }
        this.name = name;
        this.data = data;
        this.type = type;
        this.dashStyle = dashStyle;
        this.color = color;
    }
    return Series;
}());
exports.Series = Series;
//# sourceMappingURL=series.js.map