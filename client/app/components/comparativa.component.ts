import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatepickerComponent } from 'angular2-material-datepicker'

import  { GraficaTiempo } from './comparativaGrafTiempo.component'

import { ComparativaService } from '../services/comparativa.service';
import { Uuaa } from '../models/uuaa';
import { Monitor } from '../models/monitor';

 

@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/comparativa.html',
    providers: [ComparativaService]
})

export class Comparativa implements OnInit {
  public name: string;
  public uuaa: Uuaa;
  public monitor: Monitor;
  public errorMessage;

  constructor(
  	private _comparativaService: ComparativaService,
  	private _route: ActivatedRoute,
  	private _router: Router
  	){}

  ngOnInit(){
  	this.comparativa();
  }

  comparativa(){
  	this._route.params.forEach((params: Params) => {
  		
      let name = params['name'];
      this.name = name;

      //Obtención del iduuaa perteneciente al nombre de la UUAA proporcionada.
  		this._comparativaService.getUuaa(name).subscribe(
  			response => {
          this.uuaa = response.data;

          //Obtención del/los monitor/es perteneciente/s a la UUAA deseada
          this._comparativaService.getMonitors(this.uuaa.iduuaa).subscribe(
            response => {
              this.monitor = response.data;

              //Grafcio tiempo respuesta
              var graficoTime = new GraficaTiempo(this._comparativaService);    
              graficoTime.inicioGrafico(this.monitor);
            },
            error => {
              this.errorMessage = <any>error;

              if(this.errorMessage != null){
                console.log(this.errorMessage);
              alert('Error en la petición obtención monitores asociados');
              }
            }
          );
  			},
  			error => {
  				this.errorMessage = <any>error;

        		if(this.errorMessage != null){
          			console.log(this.errorMessage);
          		alert('Error en la petición obtención iduuaa de la UUAA solicitada');
  			    }
  			}
  		);
  	});
  }
}
