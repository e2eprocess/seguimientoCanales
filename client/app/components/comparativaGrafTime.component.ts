import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ComparativaService } from '../services/comparativa.service';
import { Uuaa } from '../models/uuaa';
import { Monitor } from '../models/monitor';

@Component({
    selector: 'grafico-time',
    template: '<h1>Hola</h1>'
})

export class GraficaTime implements OnInit {
  public uuaa: Uuaa;

  constructor(
  	private _comparativaService: ComparativaService,
  	private _route: ActivatedRoute,
  	private _router: Router
  	){
  		console.log('Componente gráfica')
  		console.log(this.uuaa.description);
  }

  afterAll(){

  }

}
