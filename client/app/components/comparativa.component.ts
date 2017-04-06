import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ComparativaService } from '../services/comparativa.service';
import { Uuaa } from '../models/uuaa';
import { Monitor } from '../models/monitor';


@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/comparativa.html',
    providers: [ComparativaService]
})

export class Comparativa implements OnInit {
  public uuaa: Uuaa;
  public monitor: Monitor;
  public name: string;
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

  		this._comparativaService.getUuaa(name).subscribe(
  			response => {
  				this.uuaa = response.data;

          console.log(this.uuaa.iduuaa);

          this._comparativaService.getMonitors(this.uuaa.iduuaa).subscribe(
            response => {
              this.monitor = response.data;
              console.log(this.monitor);
            },
            error => {
              this.errorMessage = <any>error;

              if(this.errorMessage != null){
                console.log(this.errorMessage);
              alert('Error en la petición');
              }
            }
          );
  			},
  			error => {
  				this.errorMessage = <any>error;

        		if(this.errorMessage != null){
          			console.log(this.errorMessage);
          		alert('Error en la petición');
  			    }
  			}
  		);
  	});
  }
}
