import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../../services/comparativa.service';
import { Monitor } from '../../models/monitor';
import { MonitorData } from '../../models/monitorData';
import { Series } from '../../models/series';

declare var jQuery:any;

@Component({
    selector: 'grafico-tiempo',
    templateUrl: 'app/views/comparativa/tiempoRespuesta.html',
    providers: [ComparativaService]
})

export class GraficaTiempo {

  public series: Series;
  public data : Array<Series> = [];
  public monitorData: MonitorData;
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(monitor) {

    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    for(let moni of monitor) {
      promesas.push(this.obtencionSerie(moni));
    }

    //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      this.graficoTiempo();
    });    

  }

  obtencionSerie(moni){

    //declaración promesa
    return new Promise((resolve, reject) => {


      //
      this._comparativaService.getDataMonitorComparativa(moni.idmonitor,'Time','2017-04-25 00:00:00','2017-04-25 23:59:00')
                      .subscribe(
                         response => {
                           this.monitorData = response.data;
                           this.series = new Series(moni.name,response.data);
                           this.data.push(this.series);
                        
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

  graficoTiempo(){
      
    jQuery('#tiempoRespuesta').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Tiempo de respuesta (ms.)'
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
                text: 'Tiempo de respuesta (ms.)'
            },
            labels: {
              format: '{value} ms.'
            },
            lineWidth: 1
        },
        tooltip: {
          shared: true,
          followPointer:true,
          xDateFormat: '%H:%M'
        },
        legend: {
          layaout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          borderWidth: 1,
          itemStyle: {
            fontsize: "10px"
          }
        },
        plotOptions: {
           series: {
            pointStart: 0,
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
        series: this.data
      });
  }


}
