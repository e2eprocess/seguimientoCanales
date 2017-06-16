import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class InformeService {
	public url: string;
	public channel: string;
	public idchannel: string;
	public name: string;
	public uuaa: string;
	public iduuaa: string;
	public idhost: string;
	public idclon: string;
	public idmonitor: string;
	public kpi: string;
	public nameKpi: string;
	public desde: string;
	public hasta: string;
	

	constructor(private _http: Http) {		
		this.url = 'http://15.17.167.155:3845/api/';
		//this.url = 'http://localhost:3845/api/';
		//this.url = 'http://v1128scp451.ad.bbva.com:3845/api/';
	}

	getDataMonitorInformePeticiones(idmonitor, fecha, interval, kpi){
		return this._http.get(this.url+'getDataMonitorInformePeticiones/'+idmonitor+'/'+fecha+'/'+interval+'/'+kpi)
							.map(res => res.json());
	}

	getDataMonitorInformeTime(idmonitor, fecha, interval, kpi){
		return this._http.get(this.url+'getDataMonitorInformeTime/'+idmonitor+'/'+fecha+'/'+interval+'/'+kpi)
							.map(res => res.json());


}