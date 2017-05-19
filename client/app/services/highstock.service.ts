import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class HighstockService {
	public url: string;
	public monitor: string;
	public namekpi: string;
	public desde: string;
	public hasta: string;

	constructor(private _http: Http) {		
		//this.url = 'http://15.17.167.155:3845/api/';
		this.url = 'http://localhost:3845/api/';
	}

	getDateAndDataValueMonitor(idmonitor, nameKpi, desde, hasta){
		return this._http.get(this.url+'getDateAndDataValueMonitor/'+idmonitor+'/'+nameKpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getIdHostChannel(idchannel){
		return this._http.get(this.url+'getIdHostChannel/'+idchannel)
							.map(res => res.json());
	}
}