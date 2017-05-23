import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {MyDatePickerModule, IMyDateModel} from 'mydatepicker';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { Fechas } from '../models/fechas';

@Component({
    selector: 'seguimiento',
    templateUrl: 'app/views/seguimiento.html',
    providers: [
    			ComparativaService,
    			HighstockService
    			]
})

export class Seguimiento implements OnInit {
	public errorMessage;

	public myDatePickerOptions: MyDatePickerModule = {
        dateFormat: 'dd.mm.yyyy',
        height: '34px',
        width: '125px',
        markCurrentDay: true,
        toLocaleDateString: 'es',
        showClearDateBtn: false,

        inline: false,
        disableUntil: { year: 2016, month: 9, day: 2 }
    };

    private locale:string = 'es';
    private fecha: Object;
    private fechas: Fechas;
	
	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router,
	){}
	ngOnInit(){
    var date = new Date();

    this.fecha = {date:{
      year: date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }};


		this.seguimiento(this.fecha)
	}

	onDateChangedTo(event: IMyDateModel) {
    	this.fecha = {date: {
        	year: event.date.year,
        	month: event.date.month,
        	day: event.date.day

    	}};
        
        this.seguimiento(this.fecha);
    }

    gestionGrafico(idmonitor,fechas){	
    	const promesas = [];

    	promesas.push(this.obtencionDatos(idmonitor,'Throughput',fechas));
    	promesas.push(this.obtencionDatos(idmonitor,'Time',fechas));
		
    	Promise.all(promesas).then((resultado)=>{
    		this.pintarGrafico(resultado);
    	});

    }

    obtencionDatos(idmonitor,kpi,fechas){
    	const serieTime = {
				name: 'Tiempo Respuesta',
				id: 'Tiempo',
				color: 'rgba(41,198,248,1.0)',
	            type: 'line',
	            index: 1,
	            legendIndex: 0,
	            data: [],
	            tooltip: {
	                     xDateFormat: '%e %B %Y %H:%MM'
	            },
	            turboThreshold: 0
	        };
        const seriePeticiones = {
				name: 'Peticiones',
				id: 'Peticiones',
				color: 'rgba(65,105,225,1.0)',
	            type: 'column',
	            yAxis: 1,
	            index: 1,
	            legendIndex: 1,
	            data: [],
	            tooltip: {
	                     xDateFormat: '%e %B %Y %H:%MM'
	            },
	            turboThreshold: 0
	        };
    	return new Promise((resolve, reject) => {
    		this._highstockService.getDateAndDataValueMonitor(idmonitor,kpi,fechas.fromDesde,fechas.fromHasta)
    			.subscribe(
    				response => {
    					if(kpi=='Time'){
    						serieTime.data = response.data;
    						resolve(serieTime);	
					        
    					}else{
    						seriePeticiones.data = response.data;
    						resolve(seriePeticiones);	
					        
    					}
    			},
    			error => {
    				this.errorMessage = <any>error;
          			if(this.errorMessage != null){
            			alert('Error en la obtención de los datos de '+kpi+' en el dashboard de Seguimiento');
          			}
    				reject()
    			});
    		});
    }

    pintarGrafico(series){
    	return new Promise((resolve, reject) => {
    		console.log('mUESTRA EL ARRAY'); 				
    		console.log(series);
    		resolve();
    	});
    	
    }

	seguimiento(fecha){
		this.fechas = new Fechas('','','','','','');
		
		//Gestión Net Particulares
		this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
    	this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 23:59:00';
    	this.gestionGrafico(14,this.fechas);

    	//Gestión Net Particulares	
    	this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
    	this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 21:59:00';
    	this.gestionGrafico(1,this.fechas);
	

    	
	}
}