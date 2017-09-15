import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class HighstockService {
	public url: string;
	public idmonitor: number;
	public namekpi: string;
	public desde: string;
	public hasta: string;
	public idchannel: number;
	public idhost: number;

	constructor(private _http: Http) {		
		//this.url = 'http://15.17.167.155:3845/api/';
		this.url = 'http://localhost:3845/api/';
		//this.url = 'http://v1128scp451.ad.bbva.com:3845/api/';
	}

	getDateAndDataValueMonitor(idmonitor, nameKpi, desde, hasta){
		return this._http.get(this.url+'getDateAndDataValueMonitor/'+idmonitor+'/'+nameKpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getIdHostChannel(idchannel){
		return this._http.get(this.url+'getIdHostChannel/'+idchannel)
							.map(res => res.json());
	}
	getDateAndDatavalueHost(idhost, namekpi, desde, hasta){
		return this._http.get(this.url+'getDateAndDatavalueHost/'+idhost+'/'+namekpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}
}