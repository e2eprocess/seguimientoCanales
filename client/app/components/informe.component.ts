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
	public options: Object;
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

	grafico(){
		return new Promise((resolve,reject)=>{
			var grafico = {
				chart: {
					zoomType: 'xy'
				},
				title: {
					text: this.name+' - APLICACÓN'
				},
				series: this.series
			}

			resolve(grafico);
		});


	}

	getDataMonitors(monitors,fecha,interval,kpi){

		var series = [];
		var properties = new PropertiesSeries();
		

		return new Promise((resolve,reject)=>{
			
			monitors.forEach((monitor, index)=>{
				const serie = {
		            name: '',
		            type: '',
		            color: 0,
		            yAxis: 0,
		            index: index,
		            legendIndex: index,
		            data: [] 
        		};

        		serie.name = monitor.name;

			    if(kpi.includes('Time')){
		        	serie.name = 'Tiempo respuesta '+ monitor.name;
		        	serie.type = 'Line';
		        }else{
		        	serie.name = 'Peticiones '+ monitor.name;
		        	serie.type = 'Column';
		        	serie.yAxis = 1;
		        }

		        serie.color = properties.colorHost[index%properties.colorHost.length];
		
				this._informeService.getDataMonitorInforme(monitor.idmonitor,fecha,interval,kpi).subscribe(
					response=>{
						serie.data = response.data;
						series.push(serie);
						this.series.push(serie);

					},
					error=>{
						this.errorMessage = <any>error;
		                if(this.errorMessage != null){
		      	        	alert('Error en la obtención de los datos de las series');
		                }
					}
				);
			});
			resolve(series);
		});
	}

	gestionMonitores(iduuaa,fecha,interval){
		this._comparativaService.getMonitors(iduuaa).subscribe(
			response => {
				var promesasMonitors =[]
				
				promesasMonitors.push(this.getDataMonitors(response.data,fecha,interval,'Throughput'));

				Promise.all(promesasMonitors).then(()=>{
					promesasMonitors.push(this.getDataMonitors(response.data,fecha,interval,'Time'));

					Promise.all(promesasMonitors).then((resultado)=>{
						if(interval.includes('10')){
							console.log(this.series);
							var p1 = this.grafico();
							p1.then((res)=>{
								console.log(res);
								this.options = res;
							})

						}else{
							console.log('Busqueda 40');
						}
					})					
				});
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
		var mes = date.getMonth()+1
		var fecha = date.getFullYear()+'-'+mes+'-'+date.getDate();
		
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