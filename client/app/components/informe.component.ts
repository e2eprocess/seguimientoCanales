import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ComparativaService } from '../services/comparativa.service';
import { InformeService }from '../services/informe.service';

import { PropertiesSeries } from '../models/propertiesSeries';

@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/informe.html',
    providers: [
    	ComparativaService,
    	InformeService
    ]
})

export class Informe implements OnInit {

	public errorMessage;
	public apl_semanal: Object;
	public apl_mensual: Object;
	public rec_semanal: Object;
	public rec_mensual: Object;
	public name: string;
	public uuaa: object;
	public series: Array<any>

	constructor(
		private _comparativaService: ComparativaService,
		private _informeService: InformeService,
		private _route: ActivatedRoute,
  		private _router: Router,
	){}

	ngOnInit(){
		this.series = [];
		this.informe();
	}

	grafico(series, interval, info){

		var chartHeight = 0,
			subtitleText = 'Visión úl4imos 10 días',
		 	legendEnable = true,
		 	yAxisLabelsFormat = '{value} ms.',
			yAxisTittleText = 'Tiempo de respuesta (ms.)',
			yAxisLabelsFormatOpposite = '{value}',
			yAxisTittleTextOpposite = 'Peticiones por hora',
			yAxisMax = null,
			columnStacking = '';


		if (interval.includes('40')){
			var subtitleText = 'Visión últimos 40 días';
		}
		if (info.includes('RECURSOS')){
			chartHeight = 275;
			legendEnable = false;
			yAxisLabelsFormat = '{value} %';
			yAxisTittleText = 'CPU %';
			yAxisLabelsFormatOpposite = '{value} %';
			yAxisTittleTextOpposite = 'Memoria %';
			yAxisMax = 100;
			columnStacking = 'normal';
		}


		return new Promise((resolve,reject)=>{
			var grafico = {
				chart: {
					height: chartHeight,
					zoomType: 'xy'
				},
				title: {
					text: this.name+' - '+info
				},
				subtitle: {
					text: subtitleText
				},
				credits: { enabled: false },
				navigator: {enabled: false },
				scrollbar: {enabled: false },
				rangeSelector: { enabled: false },
				xAxis: {
					type: 'datetime'
				},
				yAxis: [{ 
						labels: {format: yAxisLabelsFormat},
						title: {text: yAxisTittleText},
						min: 0,
						max: yAxisMax,
						opposite: false
					},{
						labels: {format: yAxisLabelsFormatOpposite},
						title: {text: yAxisTittleTextOpposite},
						max: yAxisMax,
				}],
				tooltip: {
					shared: true,
					crosshair: true
				},
				legend: {
					enabled: legendEnable,
					layout: 'horizontal',
					align: 'center',
					verticalAlign: 'bottom',
					borderWidth: 1,
					itemStyle:{
						fontSize: "10px"
					}
				},
				plotOptions: {
					line: {
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 1,
							states : {
								hover: {enabled: true}
							}
						}
					},
					spline: {
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 1,
							states : {
								hover: {enabled: true}
							}
						}
					},
					column : {
						stacking: columnStacking
					},
					series: {
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 2
						},
						fillOpacity: 0.5
						},
						flags: {
							tooltip: {
								xDateFormat: '%B %e, %Y'
							}
						}
				},
				series: series
			}
			resolve(grafico);
		});


	}

	getDataClon(index,clon,fecha,interval,kpi){
		var series = [];
		var properties = new PropertiesSeries();

		return new Promise((resolve,reject)=> {
			const serie = {
	            name: '',
	            type: '',
	            color: 0,
	            yAxis: 0,
	            index: index,
	            legendIndex: index,
	            dataGrouping: {
	            	enabled: false
	            },
	            data: [] 
    		};

    		serie.name = clon.description;

    		if(kpi.includes('CPU')){
    			serie.name = 'CPU '+ clon.description;
    			serie.type = 'column';
    			serie.color = properties.colorInformeCpu[index%properties.colorInformeCpu.length];
			}else{
				serie.name = 'Memoria '+ clon.description;
    			serie.type = 'line';
    			serie.color = properties.colorInformeMemoria[index%properties.colorInformeMemoria.length];
			}

			this._informeService.getDataValueClonInforme(clon.idclon,fecha,interval,kpi).subscribe(
				response =>{
					serie.data = response.data
 					resolve(serie)
				},
				error =>{
					this.errorMessage = <any>error;
	                if(this.errorMessage != null){
	      	        	alert('Error en la obtención de los datos de las series');
	      	        	reject();
	                }
				});
 		

		});


	}


	getDataMonitors(index,monitor,fecha,interval,kpi){
		var series = []
		var properties = new PropertiesSeries();

		return new Promise((resolve,reject)=>{
			
			const serie = {
	            name: '',
	            type: '',
	            color: 0,
	            yAxis: 0,
	            index: index,
	            legendIndex: index,
	            dataGrouping: {
	            	enabled: false
	            },
	            data: [] 
    		};

		    if(kpi.includes('Time')){
	        	serie.name = 'Tiempo respuesta '+ monitor.name;
	        	serie.type = 'line';
	        	serie.color = properties.colorInformeTiempo[index%properties.colorInformeTiempo.length];
        	}else{
        		serie.name = 'Peticiones '+ monitor.name;
	        	serie.type = 'column';
	        	serie.yAxis = 1;
	        	serie.color = properties.colorInformePeticiones[index%properties.colorInformePeticiones.length];
        	}
	        
	
			this._informeService.getDataMonitorInformeTime(monitor.idmonitor,fecha,interval,kpi).subscribe(
				response=>{
					serie.data = response.data;
					resolve(serie);

				},
				error=>{
					this.errorMessage = <any>error;
	                if(this.errorMessage != null){
	      	        	alert('Error en la obtención de los datos de las series');
	      	        	reject();
	                }
				}
			);
		});
	}

	gestionClones(clons,fecha,interval){
		var promesasClon = [];

		clons.forEach((clon,index)=>{
			promesasClon.push(this.getDataClon(index,clon,fecha,interval,'CPU'));
			promesasClon.push(this.getDataClon(index,clon,fecha,interval,'Memory'));
		});

		Promise.all(promesasClon).then((resultado)=>{
			if(interval.includes('10')){
				this.grafico(resultado, interval, 'RECURSOS').then((res)=>{
					this.rec_semanal = res;
				});

			}else{
				this.grafico(resultado, interval, 'RECURSOS').then((res)=>{
					this.rec_mensual = res;
				});
			}
		});

	}

	gestionMonitores(iduuaa,fecha,interval){
		this._comparativaService.getMonitors(iduuaa).subscribe(
			response => {
				var monitors = response.data
				var promesasMonitors =[]

				monitors.forEach((monitor,index)=>{
					promesasMonitors.push(this.getDataMonitors(index,monitor,fecha,interval,'Throughput'));
					promesasMonitors.push(this.getDataMonitors(index,monitor,fecha,interval,'Time'));
				})
		
				Promise.all(promesasMonitors).then((resultado)=>{
					if(interval.includes('10')){
						this.grafico(resultado, interval, 'APLICACIÓN').then((res)=>{
							this.apl_semanal = res;
						});

					}else{
						this.grafico(resultado, interval, 'APLICACIÓN').then((res)=>{
							this.apl_mensual = res;
						});
					}
				})					
				
			},
			error => {
				this.errorMessage = <any>error;
                if(this.errorMessage != null){
      	        	alert('Error en la obtención del ID del monitor');
                }
			}
		);
	}

	informe(){
		var date = new Date();
		var horaMenos20 = new Date().getTime()-1200000;
		var mes = date.getMonth()+1
		var fecha = date.getFullYear()+'-'+mes+'-'+date.getDate()+' '+new Date(horaMenos20).getHours()+':'+
                      new Date(horaMenos20).getMinutes()+':'+new Date(horaMenos20).getSeconds();
		
		this._route.params.forEach((params: Params) => {

            //Recupera parametros URL.
            let name = params['name'];
            let channel = params['channel'];
            this.name = name;

            this._comparativaService.getIdChannel(channel).subscribe(
            	response => {
            		var idChannel = response.data.idchannel;
            		this._comparativaService.getIdUuaa(idChannel, name).subscribe(
            			response => {
            				this.uuaa = response.data;
            				var idUuaa = response.data.iduuaa;
            				this.gestionMonitores(idUuaa,fecha,'10 days');
            				this.gestionMonitores(idUuaa,fecha,'40 days');
            			},
            			error =>{
            				this.errorMessage = <any>error;
			                if(this.errorMessage != null){
			                    alert('Error en la obtención del ID de la UUAA');
			                }
            			}
        			);
        			this._comparativaService.getIdClon(idChannel,name).subscribe(
        				response=>{
        					var clons = response.data;
        					this.gestionClones(clons,fecha,'10 days');
        					this.gestionClones(clons,fecha,'40 days');
        				},
        				error=>{

        				});
            	},
            	error => {
            		this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                        alert('Error en la obtención del ID del canal');
                    }
            	}
        	);
   		});
	}
}