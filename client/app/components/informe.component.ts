import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ComparativaService } from '../services/comparativa.service';
import { HighstockService }from '../services/highstock.service';

import { PropertiesSeries } from '../models/propertiesSeries';

@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/informe.html',
    providers: [
    	ComparativaService,
    	HighstockService
    ]
})

export class Informe implements OnInit {

	constructor(
		private _comparativaService: ComparativaService,
		private _highstockService: HighstockService,
		private _route: ActivatedRoute,
  		private _router: Router,
	){

	}

	ngOnInit(){
		this.informe()
	}

	informe(){
		var date = new Date();
		var mes = date.getMonth()+1
		var fecha = date.getFullYear()+'-'+mes+'-'+date.getDate();
		console.log(fecha);



	}
}