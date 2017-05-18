import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

import { ComparativaService } from '../../services/comparativa.service';
import { Monitor } from '../../models/monitor';
import { PropertiesSeries } from '../../models/propertiesSeries';

declare var jQuery:any;

@Component({
    selector: 'grafico-memoria',
    templateUrl: 'app/views/comparativa/memoria.html',
    providers: [ComparativaService]
})

export class GraficaMemoria {

  public properties: PropertiesSeries;
  public data : Array<any> = [];
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	){
  
  }

  inicioGrafico(clones, fechas) {

    //delcaracion Array contenedor promesas a esperar
    var promesas = [];

    //por cada monitor se obtienen los datos
    clones.forEach((clon, index)=>{
      promesas.push(this.obtencionSerie(clon,fechas.fromDesde,fechas.fromHasta,'from',index));
    })
    
    //Una vez terminadas todas las promesas (obtención datos idHosttor) ejecución de la gráfica.
    Promise.all(promesas).then(() => {
      clones.forEach((clon, index)=>{
        promesas.push(this.obtencionSerie(clon,fechas.toDesde,fechas.toHasta,'to',index));
      });
      Promise.all(promesas).then(() => {
        this.graficoCpu(fechas);
      });
    });    

  }

  obtencionSerie(clon,desde,hasta,busqueda,i){


    //declaración promesa
    return new Promise((resolve, reject) => {


      //
      this._comparativaService.getDatavalueClon(clon.idclon,desde,hasta,'Memory')
                      .subscribe(
                         response => {

                           var properties = new PropertiesSeries();
                           var color = i%properties.colorHost.length;

                           if(busqueda.includes('from')) {
                             var type = 'column',
                                 name = clon.description.toLowerCase() + ' (F)',
                                 index = 0
                           }else{
                             var type = 'line' ,
                                 name = clon.description.toLowerCase() + ' (T)',
                                 index = 1
                           };

                           var series = {
                             name: name,
                             type: type,
                             color: properties.colorHost[color],
                             index: index,
                             legendIndex: i,
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

  graficoCpu(fechas){

    //Hora +2 GMT (7200000 milisegundos).
    var fecha = ((new Date(fechas.toDesde)).getTime())+7200000;
      
    jQuery('#memoria').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Consumo Memoria %'
        },
        subtitle: {
            text: 'Comparativa entre <b>'+fechas.from+'</b> y <b>'+fechas.to+'</b>'
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
                text: 'Memoria'
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
            pointStart: fecha,
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
