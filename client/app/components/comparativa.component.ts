import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FormsModule} from '@angular/forms'
import {BrowserModule} from '@angular/platform-browser'

import {MyDatePickerModule, IMyDateModel} from 'mydatepicker';

import  { GraficaTiempo } from './comparativa/comparativaGrafTiempo.component';
import  { GraficaPeticiones } from './comparativa/comparativaGrafPeticiones.component';
import  { GraficaCpu } from './comparativa/comparativaGrafCpu.component';
import  { GraficaMemoria } from './comparativa/comparativaGrafMemoria.component';

import { ComparativaService } from '../services/comparativa.service';
import { Uuaa } from '../models/uuaa';
import { Monitor } from '../models/monitor';
import { Channel } from '../models/channel';
import { Host } from '../models/host';
import { Clon } from '../models/clon';


@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/comparativa.html',
    providers: [ComparativaService]
})

export class Comparativa implements OnInit {
  public name: string;
  public uuaa: Uuaa;
  public monitors: Monitor;
  public channel: Channel;
  public hosts: Host;
  public clon: Host;
  public errorMessage;
  public fromDate: any;

  public myDatePickerOptions: MyDatePickerModule = {
        dateFormat: 'dd.mm.yyyy',
        height: '34px',
        width: '210px',
        markCurrentDay: true,
        toLocaleDateString: 'es',
        showClearDateBtn: false,

        inline: false,
        disableUntil: { year: 2016, month: 9, day: 2 }
    };

  private locale:string = 'es';
  private from: Object;
  private to: Object;

  constructor(
  	private _comparativaService: ComparativaService,
  	private _route: ActivatedRoute,
  	private _router: Router
  	){}

  ngOnInit(){
    
    var dateTo = new Date();
    var dateFrom = dateTo;
    dateFrom.setDate(dateTo.getDate() - 7);
    
    
    this.from = {date:{
      year: dateFrom.getFullYear(),
      month: dateFrom.getMonth()+1,
      day: dateFrom.getDate()
    }};

    this.to = {date:{
      year: dateTo.getFullYear(),
      month: dateTo.getMonth()+1,
      day: dateTo.getDate()
    }};

    this.comparativa(this.from, this.to);
    
    

  }

  onDateChanged(event: IMyDateModel) {
        var dia = event.date.day;

        
      

        let copy = this.getCopyOfOptions();
        
        this.myDatePickerOptions = copy;

        this.comparativa(dia, copy);

    }

  getCopyOfOptions(): MyDatePickerModule {
        return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }

  comparativa(from, to){


    
    this._route.params.forEach((params: Params) => {
      let name = params['name'];
      this.name = name;
      let channel = params['channel'];


      this._comparativaService.getIdChannel(channel).subscribe(
        response => {
          this.channel = response.data;

          //Obtención del iduuaa perteneciente al nombre de la UUAA proporcionada.
          this._comparativaService.getIdUuaa(this.channel.idchannel, name).subscribe(
            response => {
              this.uuaa = response.data;

              this._comparativaService.getMonitors(this.uuaa.iduuaa).subscribe(
                response => {
                  this.monitors = response.data;

                  //Grafcio tiempo respuesta
                  var graficoTiempo = new GraficaTiempo(this._comparativaService);    
                  graficoTiempo.inicioGrafico(this.monitors);
                  var graficoPeticiones = new GraficaPeticiones(this._comparativaService);    
                  graficoPeticiones.inicioGrafico(this.monitors);
                },
                error =>{
                  this.errorMessage = <any>error;
                  if(this.errorMessage != null){
                    alert('Error en la obtención de los MONITORES asociados');
                  }
                }
              );
            },
            error => {
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                alert('Error en la  obtención del IDUUAA de la UUAA solicitada');
              }
          });

          this._comparativaService.getIdHost(this.channel.idchannel, name).subscribe(
          response => {
            this.hosts = response.data;

              var graficoCpu = new GraficaCpu(this._comparativaService);
              graficoCpu.inicioGrafico(this.hosts,this.channel,name);
            },
            error => {
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                alert('Error en la obtención de los IDHOST asociados al Canal');
              }
            }
          );

          this._comparativaService.getIdClon(this.channel.idchannel, name).subscribe(
            response => {
              this.clon = response.data;

              var graficoMemoria = new GraficaMemoria(this._comparativaService);
              graficoMemoria.inicioGrafico(this.clon);
            },
            error =>{
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                alert('Error en la petición obtención los idHosts asociados al Canal');
              }
            }
          );
        },
        error => {
          this.errorMessage = <any>error;
          if(this.errorMessage != null){
            alert('Error en la obtención del IDCHANNEL');
          }
        }  
      );
    });
  }
}
