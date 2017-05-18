import {Component} from '@angular/core';
import { Jsonp } from '@angular/http';

@Component({
    selector: 'stock-chart-example',
    template: `<chart type="StockChart" [options]="options3"></chart>`
})
export class StockChartExample {
    constructor(jsonp : Jsonp) {
        jsonp.request('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=JSONP_CALLBACK').subscribe(res => {
            this.options3 = {
                chart: {type: "StockChart"},
                title : { text : 'AAPL Stock Price' },
                series : [{
                    name : 'AAPL',
                    type : 'area',
                    data : res.json(),
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            };
        });
    }
    options3: Object;
}