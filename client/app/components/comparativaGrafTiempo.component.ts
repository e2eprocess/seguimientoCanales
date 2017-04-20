import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../services/comparativa.service';
import { Monitor } from '../models/monitor';
import { MonitorData } from '../models/monitorData';
import { Series } from '../models/series';

declare var jQuery:any;

@Component({
    selector: 'grafico-time',
    template: `<div style="width:60%" id="tiempoRespuesta"></div>`,
    providers: [ComparativaService]
})

export class GraficaTiempo {

  public series: Series;
  public data : Array<Series> = [];
  public monitorData: MonitorData;
  public errorMessage;

  private datos = [
      {
              name: 'USA',
              data: [[1486252800000,1773.94],[1486253100000,2242.49],[1486253400000,220.84]]
          }];
  

  
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
      this.graficoTime();
    });    

  }

  obtencionSerie(moni){

    //declaración promesa
    return new Promise((resolve, reject) => {

      console.log(moni.idmonitor);

      //
      this._comparativaService.getDataMonitor(moni.idmonitor,'Time','2017-02-05 00:00:00','2017-02-05 01:00:00')
                      .subscribe(
                         response => {
                           this.monitorData = response.data;
                           this.series = new Series(moni.name,response.data);
                           this.data.push(this.series);

                           console.log(this.data);
                           
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

  graficoTime(){
   
    
    jQuery('#tiempoRespuesta').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Tiempo de respuesta (ms.)'
        },
        subtitle: {
            text: 'Source: thebulletin.metapress.com'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Nuclear weapon states'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000 + 'k';
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b>' +
                   '<br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: this.datos
      });
  }


}
