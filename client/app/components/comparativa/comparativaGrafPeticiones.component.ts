import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../../services/comparativa.service';
import { Monitor } from '../../models/monitor';
import { Series } from '../../models/series';

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
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(monitores) {

    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    monitores.forEach((monitor)=>{
      promesas.push(this.obtencionSerie(monitor));
    });

    //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      this.obtenerWaterMark(monitores).then(()=>{
        console.log(this.data);
        this.graficoPeticiones();  
      });
      
    });    

  }

  obtencionSerie(monitor){

    //declaración promesa
    return new Promise((resolve, reject) => {


      //
      this._comparativaService.getDataMonitorComparativa(monitor.idmonitor,'Throughput','2017-02-05 00:00:00','2017-02-05 23:59:00')
                      .subscribe(
                         response => {

                           var datos = [];

                           response.data.forEach((dato)=>{
                             datos.push(dato[1])
                           });

                           console.log(datos);
                           
                           var series = {
                             name: monitor.name,
                             type: 'area',
                             data: datos
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

                               var fecha = this.data[0].data[0][0];

                               waterMark.push(this.value);

                               var seriesWatermark = {
                                 name: 'Max_peticiones' + response.data.fecha,
                                 type: 'scatter',
                                 color: 'red',
                                 marker: {
                                   enabled: false
                                 },
                                 data: [fecha, waterMark]
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
              zIndex: 5
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
          }    
        },
        
        series: this.data,
        
      });
  }


}
