import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../../services/comparativa.service';
import { Monitor } from '../../models/monitor';
import { Series } from '../../models/series';

declare var jQuery:any;

@Component({
    selector: 'grafico-cpu',
    templateUrl: 'app/views/comparativa/cpu.html',
    providers: [ComparativaService]
})

export class GraficaCpu {

  public series: Series;
  public data : Array<Series> = [];
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(hosts,channel,uuaa) {

    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    hosts.forEach((host)=>{
      promesas.push(this.obtencionSerie(host,channel,uuaa))
    });

    //Una vez terminadas todas las promesas (obtención datos idHosttor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      this.graficoCpu();
    });    

  }

  obtencionSerie(host,channel,uuaa){


    //declaración promesa
    return new Promise((resolve, reject) => {


      //
      this._comparativaService.getDatavalueHost(host.idhost,'2017-02-05 00:00:00','2017-02-05 23:59:00',
                                                      channel.idchannel,uuaa,'CPU')
                      .subscribe(
                         response => {
                           this.series = new Series();
                           this.series.name = host.name+'_'+uuaa;
                           this.series.data = response.data;
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

  graficoCpu(){
      
    jQuery('#cpu').highcharts({
        chart: {
            zoomType: 'xy',
            height: 250
        },
        title: {
            text: 'Consumo CPU %'
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
                text: 'CPU'
            },
            labels: {
              format: '{value} %'
            },
            max:100,
            lineWidth: 1
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
