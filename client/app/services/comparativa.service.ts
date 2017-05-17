import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';
//import {Uuaa} from '../models/uuaa'

@Injectable()
export class ComparativaService {
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
	}

	getIdUuaa(idchannel, name){
		return this._http.get(this.url+'getIdUuaa/'+idchannel+'/'+name)
							.map(res => res.json());
	}

	getMonitors(iduuaa){
		return this._http.get(this.url+'getMonitors/'+iduuaa)
							.map(res => res.json());
	}

	getDatavalueMonitor(idmonitor, nameKpi, desde, hasta){
		return this._http.get(this.url+'getDatavalueMonitor/'+idmonitor+'/'+nameKpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getIdChannel(channel){
		return this._http.get(this.url+'getIdChannel/'+channel)
							.map(res => res.json());
	}

	getIdHost(idchannel, name){
		return this._http.get(this.url+'getIdHost/'+idchannel+'/'+name)
							.map(res => res.json());
	}

	getDatavalueHost(idhost, desde, hasta, channel, uuaa, kpi){
		return this._http.get(this.url+'getDatavalueHost/'+idhost+'/fechas/'+desde+
								'/'+hasta+'/'+channel+'/'+uuaa+'/'+kpi).map(res => res.json());
	}

	getIdClon(idchannel, name){
		return this._http.get(this.url+'getIdClon/'+idchannel+'/'+name)
							.map(res => res.json());	
	}

	getDatavalueClon(idclon, desde, hasta, kpi){
		return this._http.get(this.url+'getDatavalueClon/'+idclon+'/fechas/'+desde+
								'/'+hasta+'/'+kpi).map(res => res.json());
	}

	getWaterMark(idmonitors){
		return this._http.get(this.url+'getWaterMark/'+idmonitors)
							.map(res => res.json());
	}

}
