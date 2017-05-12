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
    selector: 'grafico-tiempo',
    templateUrl: 'app/views/comparativa/tiempoRespuesta.html',
    providers: [ComparativaService]
})

export class GraficaTiempo {

  public series: Series;
  public data : Array<any> = [];
  public properties: PropertiesSeries;
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(monitores) {

    
    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    monitores.forEach((monitor, index)=>{
      promesas.push(this.obtencionSerie(monitor, index, 'from', '2017-02-05 00:00:00', '2017-02-05 23:59:00'));

    });

    //Una vez terminadas todas las promesas (obtención datos monitor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      monitores.forEach((monitor, index)=>{
        promesas.push(this.obtencionSerie(monitor, index, 'to', '2017-02-12 00:00:00', '2017-02-12 23:59:00'));
      });
      Promise.all(promesas).then(() => {
        this.graficoTiempo();
      });            
    });    

  }

  obtencionSerie(monitor, i, busqueda, desde, hasta){

    //declaración promesa
    return new Promise((resolve, reject) => {



      //
      this._comparativaService.getDatavalueMonitor(monitor.idmonitor,'Time',desde,hasta)
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

  graficoTiempo(){
      
    jQuery('#tiempoRespuesta').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Tiempo medio de respuesta (ms.)'
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
                text: 'milisegundos'
            },
            labels: {
              format: '{value} ms.'
            },
            lineWidth: 1
        },
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
              states : {
                hover: {enabled: true}
              }
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
        series: this.data
      });
  }


}
