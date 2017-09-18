import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {MyDatePickerModule, IMyDateModel} from 'mydatepicker';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { Fechas } from '../models/fechas';
import { ValoresTabla } from '../models/valoresTabla';

declare var jQuery:any;

@Component({
    selector: 'transacciones',
    templateUrl: 'app/views/transacciones.html',
    providers: [
    			ComparativaService,
    			HighstockService
    			]
})

export class Transacciones implements OnInit {
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
    private fechaTitulo: string;
    private fechas: Fechas;
    private valoresTabla: ValoresTabla;
    private series: Array<any> = [];
    	
	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router
	){}

	ngOnInit(){
		var today = new Date();
    	var date = new Date(today.setDate(today.getDate()-1));
    
    	this.fecha = {
    		date:{
      			year: date.getFullYear(),
      			month: date.getMonth()+1,
      			day: date.getDate()
    		}
    	}
    	this.transacciones(this.fecha)
	}

    onDateChanged(event: IMyDateModel) {
        this.fecha = {date: {
            year: event.date.year,
            month: event.date.month,
            day: event.date.day

        }};

        this.transacciones(this.fecha);
    }

    pintarGrafico(series, canal){

        var fecha = ((new Date(this.fechas.from)).getTime())+7200000;

        var grafHeight = 0;

        if(canal.name == 'acumulado'){

            
            series.forEach((serie)=>{

                switch (serie.id) {
                    case "APX":
                        serie.name = 'APX';
                        serie.index = 0;
                        serie.legendIndex = 1;                   
                        break;
                    
                    case "HOST":
                        serie.name = 'HOST';
                        serie.index = 1;
                        serie.legendIndex = 0;
                        serie.color = '#072146';
                        break;

                    case "acumuladoTrx":
                        serie.index = 2;
                        serie.legendIndex = 2;

                        break;
                    
                }
            });
            
            grafHeight = 250;
        };

        jQuery('#'+canal.name).highcharts({
            chart: {
                zoomType: 'xy',
                height: grafHeight
            },
            title: {
                text: canal.description
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                    title: {text: 'Peticiones'}
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
                series: {
                    pointStart: fecha,
                    pointInterval: 300 * 1000,
                    marker: {
                        enabled: false
                    }
                },
                column:{
                    stacking: 'normal'   
                },
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

    obtencionDatos(idmonitor,kpi,fechas){

        return new Promise((resolve,reject)=>{
            this._comparativaService.getDatavalueMonitor(idmonitor,kpi,fechas.fromDesde,fechas.fromHasta)
                .subscribe(
                    response => {
                        resolve(response.data);
                    },
                    error=>{
                        this.errorMessage = <any>error;
                          if(this.errorMessage != null){
                            alert('Error en la obtención de los datos de '+kpi+' en el dashboard de Seguimiento');
                          }
                        reject()
                    });
        });
    }

    obtencionPeticiones(canal,fecha){
        return new Promise((resolve,reject)=>{
            this._comparativaService.getDateAndThroughputGrouped('D',canal,fecha)
                .subscribe(
                    response=>{
                        resolve(response);
                    },error=>{
                       this.errorMessage = <any>error;
                          if(this.errorMessage != null){
                            alert('Error en la obtención número de peticiones');
                          }
                        reject() 
                    });
        });
    }

    maxPeti(canal,fecha){
        var idmonitor = 0;
        const seriePeticionesMax = {
            name: '',
            id: '',
            color: 'red',
            type: 'line',
            index: 1,
            legendIndex: 1,
            data: {},
            tooltip: {
                     xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };

        switch (canal) {
            case "APX":
                idmonitor = 361;
                seriePeticionesMax.id = 'MaxAPX';
                break;
            
            case "HOST":
                idmonitor = 362;
                canal = 'TXHOST';
                seriePeticionesMax.id = 'MaxHOST';
                break;

            case "ACUMULADO":
                idmonitor = 363;
                canal = 'TRX';
                seriePeticionesMax.id = 'acumuladoTrx';
                break;
        }

        return new Promise((resolve,reject)=>{
            this._comparativaService.getGroupedWaterMark(canal,fecha.from)
                .subscribe(
                    response=>{
                        seriePeticionesMax.name = 'Día max. TRX '+response.dateTitle+'('+response.datavalue+')';
                        fecha.fromDesde = response.date;
                        fecha.fromHasta = response.date.replace('00:00:00','23:59:00')

                        this.obtencionDatos(idmonitor,'Throughput',fecha).then((resultado)=>{
                            seriePeticionesMax.data = resultado;
                            resolve(seriePeticionesMax);
                        });

                    },error=>{
                        this.errorMessage = <any>error;
                          if(this.errorMessage != null){
                            alert('Error en la obtención del día max. peticiones.');
                          }
                        reject()

                    }
                );

        });

    }

    estandar(canal,fechas){

        var idmonitor = 0;
        const seriePeticiones = {
            name: '',
            id: '',
            color: '#0A5FB4',
            type: 'column',
            index: 0,
            legendIndex: 0,
            data: {} ,
            tooltip: {
                     xDateFormat: '%e %B %Y %H:%M'
            },
            turboThreshold: 0
        };

        switch (canal) {
            case "APX":
                idmonitor = 361;
                seriePeticiones.id = 'APX';
                break;
            
            case "HOST":
                idmonitor = 362;
                canal = 'TXHOST';
                seriePeticiones.id = 'HOST';
                break;
        }        

        return new Promise((resolve,reject)=>{
            this.obtencionDatos(idmonitor,'Throughput',fechas).then((resultado)=>{

                seriePeticiones.data = resultado;
                this.series.push(seriePeticiones);

                var f = new Date(),
                    hoy = f.getFullYear()+"-"+(f.getMonth() +1)+"-"+f.getDate();
                        
                        
                if(hoy==fechas.from){
                    this._comparativaService.getThroughputToday(idmonitor,'Throughput')
                        .subscribe(
                            response=>{
                                seriePeticiones.name = 'Transacciones '+response.date +' ('+response.datavalue+')';

                                if (canal=='APX'){
                                    this.valoresTabla.peticionesApx = response.datavalue;
                                }else{
                                    this.valoresTabla.peticionesHost = response.datavalue;
                                };

                                resolve(seriePeticiones);
                            });
                }else{
                    this.obtencionPeticiones(canal,fechas.from).then((resultado)=>{

                       const result = JSON.stringify(resultado);
                       const resultObj = JSON.parse(result);

                       if (canal=='APX'){
                            this.valoresTabla.peticionesApx = resultObj.datavalue;
                        }else{
                            this.valoresTabla.peticionesHost = resultObj.datavalue;
                        };


                       seriePeticiones.name = 'Transacciones '+resultObj.date+' ('+resultObj.datavalue+')';
                        resolve(seriePeticiones);                          
                    });
                }
            });
        });
    }


    gestionGrafico(canal,fechas){

        var promesasSeries = [];

        const datosCanal = {
            name: '',
            description: ''
        };

        switch (canal) {
            case "HOST":
                datosCanal.name = 'host';
                datosCanal.description = 'Trx Host';
                break;

            case "APX":
                datosCanal.name = 'apx';
                datosCanal.description = 'Trx APX';
                break;
            
        }

        return new Promise((resolve,reject)=>{
            promesasSeries.push(this.estandar(canal,fechas));
            promesasSeries.push(this.maxPeti(canal,fechas));

            Promise.all(promesasSeries).then((resultado)=>{
                this.pintarGrafico(resultado,datosCanal)
                resolve();
            });
        });      

    }

 
	transacciones(fecha){
		this.fechas = new Fechas('','','','','','');
        this.valoresTabla = new ValoresTabla('',0,0,0,0,0,'',0,0,0,0,0);

        const promesasGraficos = [];
        const datosCanal = {
            name: '',
            description: ''
        };

        this.series = [];

        this.fechaTitulo = fecha.date.day+'-'+fecha.date.month+'-'+fecha.date.year;
        this.valoresTabla.fechaPeticion = this.fechaTitulo;
        this.fechas.from =fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day;
        this.fechas.fromDesde = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 00:00:00';
    	this.fechas.fromHasta = fecha.date.year+'-'+fecha.date.month+'-'+fecha.date.day+' 23:59:00';

        promesasGraficos.push(this.gestionGrafico('APX',this.fechas));
        promesasGraficos.push(this.gestionGrafico('HOST',this.fechas));
        
        Promise.all(promesasGraficos).then(()=>{
            datosCanal.name = 'acumulado';
            datosCanal.description = 'Acumulado de TRX';
            this.maxPeti('ACUMULADO',this.fechas).then((resultado)=>{             
                this.series.push(resultado);
                this.pintarGrafico(this.series,datosCanal);

                this.valoresTabla.fechaMaxPeticiones = this.fechas.fromDesde.substring(8,10)+'-'+
                                                       this.fechas.fromDesde.substring(5,8)+
                                                       this.fechas.fromDesde.substring(0,4);
                                                       
                this.obtencionPeticiones('APX',this.fechas.fromDesde.substring(0,10)).then((resultado)=>{

                   const result = JSON.stringify(resultado);
                   const resultObj = JSON.parse(result);
                   this.valoresTabla.maxPeticionesApx = resultObj.datavalue;

                       this.obtencionPeticiones('TXHOST',this.fechas.fromDesde.substring(0,10)).then((resultado)=>{

                       const result = JSON.stringify(resultado);
                       const resultObj = JSON.parse(result);
                       this.valoresTabla.maxPeticionesHost = resultObj.datavalue;

                       this.valoresTabla.sumPeticiones = this.valoresTabla.peticionesApx + this.valoresTabla.peticionesHost;
                       this.valoresTabla.sumMaxPeticiones = this.valoresTabla.maxPeticionesApx + this.valoresTabla.maxPeticionesHost;
                       
                       this.valoresTabla.porcentajeHost = (this.valoresTabla.peticionesHost*100)/this.valoresTabla.sumPeticiones;
                       this.valoresTabla.porcentajeApx = (this.valoresTabla.peticionesApx*100)/this.valoresTabla.sumPeticiones;
                       this.valoresTabla.maxPorcentajeHost = (this.valoresTabla.maxPeticionesHost*100)/this.valoresTabla.sumMaxPeticiones;
                       this.valoresTabla.maxPorcentajeApx = (this.valoresTabla.maxPeticionesApx*100)/this.valoresTabla.sumMaxPeticiones;


                       console.log(this.valoresTabla);
                    });
                });
            });       
        });
	}
}