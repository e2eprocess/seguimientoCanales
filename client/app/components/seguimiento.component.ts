import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {MyDatePickerModule, IMyDateModel} from 'mydatepicker';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { Fechas } from '../models/fechas';

declare var jQuery:any;

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
    private ejeX: Array<any> = [];

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
    private fechaTitulo: string;
    private fechas: Fechas;
	
	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router,
	){}

	ngOnInit(){
    var today = new Date();
    var date = new Date(today.setDate(today.getDate()-1));
    
    this.fecha = {date:{
      year: date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }};

    this.seguimiento(this.fecha)
	}

	onDateChanged(event: IMyDateModel) {
    	this.fecha = {date: {
        	year: event.date.year,
        	month: event.date.month,
        	day: event.date.day

    	}};

        this.seguimiento(this.fecha);
    }

    pintarGrafico(series, canal){
        jQuery('#'+canal.name).highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: canal.description,
                x: -20
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                    labels: {
                        format: '{value} ms.'
                    },
                    title: {
                      text: 'Tiempo de respuesta (ms.)'
                    }
                },{
                    title: {
                      text: 'Peticiones'
                    },
                    opposite: true,
            }],
            tooltip: {
              shared: true,
              followPointer:true,
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
            plotOptions: {
                line: {
                    marker: {
                      enabled: false,
                      symbol: 'circle',
                      radius: 1,
                    }
                  },
                  scatter: {
                    marker: {
                      symbol: 'square',
                      radius: 1
                    }
                  }   
            },
            series: series
        })
        
    }

    obtencionWaterMakr(idmonitor, fechas){

        var datos = [];
        const serieMaxPeti = {
            name: '',
            color: 'rgba(255,0,0,1.0)',
            type: 'line',
            yAxis: 1,
            legendIndex: 2,
            data:[]
        };
     
        return new Promise((resolve, reject)=>{
            this._comparativaService.getWaterMark(idmonitor).subscribe(
                response => {
                    serieMaxPeti.name = 'Max. peticiones' + response.data.fecha
                    var valor = response.data.max_peticiones;
                    this._comparativaService.getDate(idmonitor, fechas.fromDesde,fechas.fromHasta)
                        .subscribe(
                            response => {
                                response.data.forEach((elem) => {
                                    datos.push([elem[0],parseInt(valor)]);
                                });
                                serieMaxPeti.data = datos;
                                resolve(serieMaxPeti);
                            },
                            error => {

                            });
                    
                },
                error => {
                    reject()
                })
            
        })
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
	                     xDateFormat: '%e %B %Y %H:%M'
	            },
	            turboThreshold: 0
	        };
        const seriePeticiones = {
				name: 'Peticiones',
				id: 'Peticiones',
				color: 'rgba(65,105,225,1.0)',
	            type: 'column',
	            yAxis: 1,
	            index: 0,
	            legendIndex: 1,
	            data: [],
	            tooltip: {
	                     xDateFormat: '%e %B %Y %H:%M'
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

    obtencionNombreCanal(idmonitor){
        return new Promise((resolve, reject) => {
            this._comparativaService.getDescriptionChannel(idmonitor).subscribe(
                response => {
                    if (response.data.name == 'office'){
                        this._comparativaService.getNameDescriptionMonitor(idmonitor).subscribe(
                            response => {

                                resolve(response.data);
                            },
                            error => {
                                if(this.errorMessage != null){
                                    alert('Error en la obtención de la descripción del monitor para Oficinas');
                                  }
                                reject();
                            })
                    }else{
                        resolve(response.data);
                    }
                },
                error => {
                    if(this.errorMessage != null){
                        alert('Error en la obtención de la descripción del canal');
                      }
                    reject();
                })
        });
    }

    gestionGrafico(idmonitor,fechas){    
        const promesas = [];

        this.obtencionNombreCanal(idmonitor).then((canal)=>{
            promesas.push(this.obtencionDatos(idmonitor,'Throughput',fechas));
            promesas.push(this.obtencionDatos(idmonitor,'Time',fechas));
            promesas.push(this.obtencionWaterMakr(idmonitor, fechas));
            
            Promise.all(promesas).then((resultado)=>{
                this.pintarGrafico(resultado, canal);
            });
        });

        

    }


	seguimiento(fecha){
		this.fechas = new Fechas('','','','','','');

        this.fechaTitulo = fecha.date.day+'-'+fecha.date.month+'-'+fecha.date.year;
		
		//Gestión Net Particulares
		this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
    	this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 23:59:00';
    	this.gestionGrafico(14,this.fechas);

    	//Gestión Banca empresas
    	this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
    	this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 21:59:00';
    	this.gestionGrafico(1,this.fechas);

        //Gestión Movil
        this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
        this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 21:59:00';
        this.gestionGrafico(15,this.fechas);

        //Gestión Escenarios comerciales
        this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
        this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 21:59:00';
        this.gestionGrafico(17,this.fechas);

        //Gestión Objeto cliente
        this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 07:00:00';
        this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 21:59:00';
        this.gestionGrafico(16,this.fechas);
	
	}
}