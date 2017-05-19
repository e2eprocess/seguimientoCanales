import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { Jsonp } from '@angular/http';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { Channel } from '../models/channel';
import { Host } from '../models/host';

@Component({
    selector: 'highstock',
    templateUrl: 'app/views/highstock.html',
    providers: [ComparativaService,
    			HighstockService]
})

export class Highstock implements OnInit {
	public options: Object;
	public channelDescription: string;
	public channel: Channel;
	public host: Host;
	private series : Array<any> = [];
	private arrayHost : Array<any> = [];
	public serie: Object;
	public errorMessage;
	
	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router,
  		private jsonp : Jsonp
	){}
	ngOnInit(){
		this.highstock()
	}

	obtenerMonitorData(idMonitor,kpi,desde,hasta){
		return new Promise((resolve, reject)=> {
			this._highstockService.getDateAndDataValueMonitor(idMonitor,kpi,desde,hasta).subscribe(
			response => {
				if(kpi=='Time'){
					this.serie = {
						type: 'line',
						name: 'Tiempo de respuesta',
						tooltip: {
							valueDecimals: 2
						},
						data: response.data
					};
					this.series.push(this.serie);
				}else{
					this.serie = {
						type: 'column',
						name: 'Peticiones',
						yAxis: 1,
						tooltip: {
							valueDecimals: 0
						},
						data: response.data
					};
					this.series.push(this.serie);
				}
				resolve();

			},error => {
				this.errorMessage = <any>error;
          		if(this.errorMessage != null){
            		alert('Error en la obtención de los datos de '+kpi);
          		}
          		reject();
			});
		});
	}

	obtenerHostData(idChannel){
		return new Promise((resolve, reject)=> {
			this._highstockService.getIdHostChannel(idChannel).subscribe(
				response => {
					this.host = response.data;
					this.arrayHost.forEach((host,index)=> {
						
					});

				},error => {

				});
			});
	}

	

	highstock(){
		this._route.params.forEach((params: Params) => {
			let channel = params['channel'];
			let idMonitor = params['idMonitor']

			this._comparativaService.getIdChannel(channel).subscribe(
        	response => {
        		this.channel = response.data;
        		this.channelDescription = this.channel.description;

        		var horaMenos20 = new Date().getTime()-1200000;
        		var desde = '2016-09-01 16:00:00';
        		var fechaHoy = new Date();
        		var hasta = fechaHoy.getFullYear()
        					+'-'+(fechaHoy.getMonth()+1)
        					+'-'+fechaHoy.getDate()
        					+' '+new Date(horaMenos20).getHours()
        					+':'+new Date(horaMenos20).getMinutes()
        					+':'+new Date(horaMenos20).getSeconds();

        		this.series = [];
				var promesas = [];

        		this.obtenerMonitorData(idMonitor,'Time',desde,hasta).then(()=>{
        			this.obtenerMonitorData(idMonitor,'Throughput',desde,hasta).then(()=>{
        				this.obtenerHostData(this.channel.idchannel)



        				this.grafico();
        			});
        		});
        		

        		/*Promise.all(promesas).then(() => {
        			this.grafico();
        		});*/

        	},error=>{
        		this.errorMessage = <any>error;
          		if(this.errorMessage != null){
            		alert('Error en la obtención del IDCHANNEL');
          		}
        	});
		});
		
	}

	grafico(){
		this.options = {
            chart: {
            	type: "StockChart",
            	marginRight:60,
            	marginLeft: 70,
            	zoomType: 'xy'
            },
            legend: {
            	enabled: true
            },
            credits: {
            	enabled: false
            },
            rangeSelector: {
            	buttons: [{
            		type: 'day',
            		count: 1,
            		text: 'D'
            	},{
            		type: 'week',
            		count: 1,
            		text: 'W'
            	},{
            		type: 'month',
            		count: 1,
            		text: 'M'	
            	},{
            		type: 'Ytd',
            		count: 1,
            		text: 'Y'
            	}],
            	selected: 1,
            	inputDateFormat: '%e-%m-%Y',
        		inputEditDateFormat: '%e-%m-%Y'
            },
            yAxis: [{
            	labels: {
            		align:'rigth'
            	},
            	title: {
            		text: 'tiempo respuesta (ms.)'
            	},
            	height: '25%',
            	opposite: false,
            	lineWidth: 1

            },{
            	labels: {
            		align:'rigth'
            	},
            	title: {
            		text: 'Peticiones'
            	},
            	top: '30%',
            	height: '25%',
            	offset: 0,
            	opposite: false,
            	lineWidth: 1

            }],
            series : this.series
        };
        
	}
}
