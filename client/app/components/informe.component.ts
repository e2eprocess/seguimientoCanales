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
		this.informe()
	}

	grafico(series){
		return new Promise((resolve,reject)=>{
			var grafico = {
				chart: {
					zoomType: 'xy'
				},
				title: {
					text: this.name+' - APLICACÓN'
				},
				subtitle: {
					text:'Subtitulo'
				},
				credits: { enabled: false },
				navigator: {enabled: false },
				scrollbar: {enabled: false },
				rangeSelector: { enabled: false },
				xAxis: {
					type: 'datetime'
				},
				yAxis: [{ //tiempo de respuesta
					labels: {
						format: '{value} ms.'
					},
					title: {
						text: 'Tiempo de respuesta (ms.)'
					},
					min: 0,
					opposite: false
					},{ //Peticiones
					title: {
						text: 'Peticiones por hora'
					}
				}],
				tooltip: {
					shared: true,
					crosshair: true
				},
				legend: {
					enabled: true,
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

    		serie.name = monitor.name;

		    if(kpi.includes('Time')){
	        	serie.name = 'Tiempo respuesta '+ monitor.name;
	        	serie.type = 'line';
	        
		        serie.color = properties.colorHost[index%properties.colorHost.length];
		
				this._informeService.getDataMonitorInformeTime(monitor.idmonitor,fecha,interval,kpi).subscribe(
					response=>{
						serie.data = response.data;
						resolve(serie);

					},
					error=>{
						this.errorMessage = <any>error;
		                if(this.errorMessage != null){
		      	        	alert('Error en la obtención de los datos de las series');
		                }
					}
				);
			}else{
	        	serie.name = 'Peticiones '+ monitor.name;
	        	serie.type = 'column';
	        	serie.yAxis = 1;

	        	this._informeService.getDataMonitorInformePeticiones(monitor.idmonitor,fecha,interval,kpi).subscribe(
					response=>{
						serie.data = response.data;
						resolve(serie);

					},
					error=>{
						this.errorMessage = <any>error;
		                if(this.errorMessage != null){
		      	        	alert('Error en la obtención de los datos de las series');
		                }
					}
				);
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
						this.grafico(resultado).then((res)=>{
							this.apl_semanal = res;
						});

					}else{
						this.grafico(resultado).then((res)=>{
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
            		this._comparativaService.getIdUuaa(response.data.idchannel, name).subscribe(
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