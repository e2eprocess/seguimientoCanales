import { Component } from '@angular/core';

@Component({
    selector: 'highcharts',
    templateUrl: 'app/views/highcharts.html'
})
export class Highcharts {
    constructor() {
        this.options = {
            title : { text : 'simple chart' },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2],
            }]
        };
        this.options2 = {
            title : { text : 'simple chart' },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2],
            }]
        };
    }
    options: Object;
    options2: Object;
}