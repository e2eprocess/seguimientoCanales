import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { Channel } from '../models/channel';
import { Host } from '../models/host';
import { PropertiesSeries } from '../models/propertiesSeries';

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
	private series : Array<any> = [];
	private arrayHost : Array<Host> = [];
	public serie: Object;
    public properties: PropertiesSeries;
	public errorMessage;
	
	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router,
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
                        color: 'blue',
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
                        color: 'black',
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

	obtenerHostData(host,desde,hasta,index){
		return new Promise((resolve, reject)=> {
            var properties = new PropertiesSeries();
            var color = index%properties.colorHostHighstock.length;
			this._highstockService.getDateAndDatavalueHost(host.idhost,'CPU',desde, hasta).subscribe(
                response => {
                    this.serie = {
                        type: 'area',
                        name: host.name,
                        yAxis: 2,
                        tooltip: {
                            valueDecimals: 2
                        },
                        dataGrouping: {
                            approximation: "high"
                        },
                        index: index+1,
                        legendIndex: index+1,
                        color: properties.colorHostHighstock[color],
                        data: response.data
                    };
                    this.series.push(this.serie);
                    resolve();
                },error =>{
                    reject();
                });
			});
	}

	

	highstock(){
		this._route.params.forEach((params: Params) => {
            this.series = [];
			let channel = params['channel'];
			let idMonitor = params['idMonitor'];

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

				var promesas = [];

        		this.obtenerMonitorData(idMonitor,'Time',desde,hasta).then(()=>{
        			this.obtenerMonitorData(idMonitor,'Throughput',desde,hasta).then(()=>{
                        this._highstockService.getIdHostChannel(this.channel.idchannel).subscribe(
                            response => {
                                this.arrayHost = response.data;
                                this.arrayHost.forEach((host, index)=>{
                                    promesas.push(this.obtenerHostData(host,desde,hasta,index));
                                });
                                Promise.all(promesas).then(() => {
                                    this.grafico();
                                 });            
                            },error => {

                            });
                            
        			});
        		});

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
            	title: {
            		text: 'Tiempo respuesta (ms.)'
            	},
            	height: '25%',
            	opposite: false,
            	lineWidth: 1

            },{
            	title: {
            		text: 'Peticiones'
            	},
            	top: '30%',
            	height: '25%',
            	offset: 0,
            	opposite: false,
            	lineWidth: 1
            },{
                title: {
                    text: 'CPU %'
                },
                height: '25%',
                top: '65%',
                opposite: false,
                lineWidth: 1,
                offset: 0,
                max: 100
            }],
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            tooltip: {
                split: true
            },

            series : this.series
        };
        
	}
}
