import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../../services/comparativa.service';
import { Monitor } from '../../models/monitor';
import { Series } from '../../models/series';
import { PropertiesSeries } from '../../models/propertiesSeries';


declare var jQuery:any;

@Component({
    selector: 'grafico-peticiones',
    templateUrl: 'app/views/comparativa/peticiones.html',
    providers: [ComparativaService]
})

export class GraficaPeticiones {

  public series: Series;
  public data : Array<any> = [];
  public value: number;
  public properties: PropertiesSeries;
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(monitores, fechas) {

    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    monitores.forEach((monitor, index)=>{
      promesas.push(this.obtencionSerie(monitor, index, 'from', fechas.fromDesde, fechas.fromHasta));
    });

    //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      monitores.forEach((monitor, index)=>{
        promesas.push(this.obtencionSerie(monitor, index, 'to', fechas.toDesde, fechas.toHasta));
      });
      Promise.all(promesas).then(() => {
        this.obtenerWaterMark(monitores).then(()=>{
          this.graficoPeticiones();  
        });
      })
      
      
    }); 

  }

  obtencionSerie(monitor, i, busqueda, desde, hasta){

    //declaración promesa
    return new Promise((resolve, reject) => {


      //
      this._comparativaService.getDatavalueMonitor(monitor.idmonitor,'Throughput',desde,hasta)
                      .subscribe(
                         response => {
                           
                           var properties = new PropertiesSeries();

                           if(busqueda.includes('from')) {
                             var type = 'spline',
                                 dashStyle = 'shortdot',
                                 name = monitor.name + ' (F)'
                           }else{
                             var type = 'line' ,
                                 dashStyle = '',
                                 name = monitor.name + ' (T)'
                           };
                         
                           var series = {
                             name: name,
                             type: type,
                             dashStyle: dashStyle,
                             color: properties.colorMonitor[i],
                             data: response.data
                           };
                           this.data.push(series);
                        
                           //terminado la consulta devuelve la promesa
                           resolve();
                         },
                         error => {
                           this.errorMessage = <any>error;
                            if(this.errorMessage != null){
                              console.log(this.errorMessage);                                         
                            }

                            //Rechazada la promesa
                            reject();

                       }
      );
    });
  }

  obtenerWaterMark(monitores){
    
   //declaración promesa
    return new Promise((resolve, reject) => {

       var arr = [];

       monitores.forEach((monitor)=>{
         arr.push(monitor.idmonitor);
       });

       var idmonitores = arr.join(",");

       this._comparativaService.getWaterMark(idmonitores)
                          .subscribe(
                             response => {
                               this.value = parseInt(response.data.max_peticiones);
                               var waterMark = [];

                               waterMark.push(this.value);

                               var seriesWatermark = {
                                 name: 'Max_peticiones ' + response.data.fecha,
                                 type: 'scatter',
                                 color: 'red',
                                 data: [waterMark]
                               };

                               this.data.push(seriesWatermark);
                            
                               //terminado la consulta devuelve la promesa
                               resolve();
                             },
                             error => {
                               this.errorMessage = <any>error;
                                if(this.errorMessage != null){
                                  console.log(this.errorMessage);                                         
                                }

                                //Rechazada la promesa
                                reject();

                           }
          );
    });
  }

  graficoPeticiones(){
      
    jQuery('#peticiones').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Peticiones'
        },
        subtitle: {
            text: 'comparativa'
        },
        credits:{
          enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              hour: '%H:%M'
            }
        },
        yAxis: {
            title: {
                text: 'Peticiones'
            },
            labels: {
              format: '{value}'
            },
            lineWidth: 1,
            plotLines: [{
              value: this.value,
              color: 'red',
              width: 3,
              zIndex: 5,
              label: {
                text: 'Max. num. Peticiones <b>' + this.value +'</b>',
                align: 'right',
                x: -10
              }
            }]
        },
        tooltip: {
          shared: true,
          followPointer:true,
          xDateFormat: '%H:%M'
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
            pointStart: 1487150400000,
            pointInterval: 300 * 1000
          },
          line: {
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 1,
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
          }    
        },
        
        series: this.data,
        
      });
  }


}
