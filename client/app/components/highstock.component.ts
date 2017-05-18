import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { Jsonp } from '@angular/http';

import { ComparativaService } from '../services/comparativa.service';

@Component({
    selector: 'highstock',
    templateUrl: 'app/views/highstock.html',
    providers: [ComparativaService]
})

export class Highstock implements OnInit {
	public options: Object;
	public channel: string;
	
	constructor(
		private _route: ActivatedRoute,
  		private _router: Router,
  		private jsonp : Jsonp
	){}
	ngOnInit(){
		this.highstock()
	}

	highstock(){
		this._route.params.forEach((params: Params) => {
			let channel = params['channel'];
			this.channel = channel;

			this.grafico();

		}
	}

	grafico(){
		this.jsonp.request('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=JSONP_CALLBACK').subscribe(res => {
            this.options = {
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
}
