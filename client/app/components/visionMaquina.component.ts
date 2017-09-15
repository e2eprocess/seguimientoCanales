import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ComparativaService } from '../services/comparativa.service';

import { PropertiesSeries } from '../models/propertiesSeries';

declare var jQuery:any;

@Component({
    selector: 'visionMaquina',
    templateUrl: 'app/views/vision_maquina.html',
    providers: [
    			ComparativaService]
})

export class VisionMaquina implements OnInit {
	public errorMessage;

 
	
	constructor(
		private _comparativaService: ComparativaService,
		private _route: ActivatedRoute,
  		private _router: Router
	){}

	ngOnInit(){
		this.visionMaquina();
	}

	pintarGrafica(series,periodo){

		if(periodo.includes('diezDias')){
			var subTitle = ' Visión últimos 10 días';
		}else{
			var subTitle = ' Visión últimos 40 días';
		}

		jQuery('#'+periodo).highcharts({
			chart: {
                zoomType: 'xy',
                height: 350,
                type: 'area'
            },
			title: {
				text: 'CPU MÁQUINA (máximos)',
			},subtitle: {
				text: subTitle
			},
          	credits: {
            	enabled: false
          	},
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                  hour: '%H:%M'
                }
            },
          	yAxis: [{
            	labels: {
              		format: '{value} %'
            	},
            	title: {
              		text: 'CPU %'
	            },
            	max:100
          	}],
          	tooltip: {
              shared: true,
              followPointer:true,
              xDateFormat: '%H:%M',
              borderColor: 'grey'
            },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              borderWidth: 1,
              itemStyle:{
                  fontSize: "10px"
                }
            },
          	series: series
		});
	}

	obtencionSeries(host, periodo, i){
		const serie={
			name: '',
			color: 0,
			data: []
		};

		var properties = new PropertiesSeries(),
        	color = i%properties.colorHostHighstock.length;
        
        serie.color = properties.colorHostHighstock[color];

        return new Promise ((resolve,reject)=>{
        	this._comparativaService.getDateAndDataMachine(host.name,periodo,'CPU').subscribe(
        		response => {
        			serie.name = host.name;
        			serie.data = response.data;
        			resolve(serie)
        		},
        		error => {
        			this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                    	console.log(this.errorMessage);                                         
                    }
                    reject();
        		}
    		);
        });


	}

	gestionGrafico(periodo,host){
		
		const promesas = [];
		
		host.forEach((elemento, index)=>{
			promesas.push(this.obtencionSeries(elemento, periodo, index));
		});

		Promise.all(promesas).then((resultado)=>{
			if(periodo.includes('10 days')){
				this.pintarGrafica(resultado,'diezDias');	
			}else{
				this.pintarGrafica(resultado,'cuarentaDias');
			}
			
		})
	}

	visionMaquina(){
		this._route.params.forEach((params: Params) => {
			let channel = params['channel'];

			this._comparativaService.getIdChannel(channel).subscribe(
				response =>{
					const idchannel = response.data.idchannel;
					this._comparativaService.getIdHostChannel(idchannel).subscribe(
						response =>{
							const host = response.data;
							this.gestionGrafico('10 days', host);
							this.gestionGrafico('40 days', host);
						},
						error=>{
							this.errorMessage = <any>error;
		                    if(this.errorMessage != null){
		                        alert('Error en la obtención del ID de los Host');
		                    }   		
						});
				},
				error=>{
					this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                        alert('Error en la obtención del ID del canal');
                    }   
				}
			);
		});
	}
}