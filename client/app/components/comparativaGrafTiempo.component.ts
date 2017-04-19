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
    template: `<div style="width:60%" id="container"></div>`,
    providers: [ComparativaService]
})

export class GraficaTiempo implements OnInit {

  public series: Series;
  public data : Array<Series> = [];
  public monitorData: MonitorData;
  public errorMessage;

  
  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  ngOnInit(){

  }

  inicioGrafico(monitor) {
     var promesas = [];

     console.log(monitor);

    for(let moni of monitor) {
      promesas.push(this.obtencionSerie(moni));
    }

    Promise.all(promesas).then(() => {
      this.graficoTime();
    });    

  }

 obtencionSerie(moni){

   return new Promise((resolve, reject) => {
     
        this._comparativaService.getDataMonitor(moni.idmonitor,'Time','2017-04-05 00:00:00','2017-04-05 00:10:00')
                                .subscribe(
                                   response => {
                                     this.monitorData = response.data;
                                     this.series = new Series(moni.name,response.data);
                                     console.log('Muestro la serie');
                                     console.log(this.series);

                                     this.data.push(this.series);
                                     console.log('Muestro el estado del array data');
                                     console.log(this.data);
                                     resolve();
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

  graficoTime(){
   
    
    jQuery('#container').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: 'US and USSR nuclear stockpiles'
        },
        subtitle: {
            text: 'Source: thebulletin.metapress.com'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
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
        series: this.data
      });
  }


}
