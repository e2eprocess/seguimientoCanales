import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';
//import {Uuaa} from '../models/uuaa'

@Injectable()
export class ComparativaService {
	public url: string;

	constructor(private _http: Http) {		
		this.url = 'http://localhost:3845/api/';
	}

	getIdUuaa(idchannel: string, name: string){
		return this._http.get(this.url+'getIdUuaa/'+idchannel+'/'+name)
							.map(res => res.json());
	}

	getMonitors(iduuaa: string){
		return this._http.get(this.url+'getMonitors/'+iduuaa)
							.map(res => res.json());
	}

	getDataMonitorComparativa(idmonitor: string, nameKpi:string, desde: string, hasta: string){
		return this._http.get(this.url+'getDataMonitorComparativa/'+idmonitor+'/'+nameKpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getIdChannel(channel: string){
		return this._http.get(this.url+'getIdChannel/'+channel)
							.map(res => res.json());
	}

	getIdHost(idchannel: string, name: string){
		return this._http.get(this.url+'getIdHost/'+idchannel+'/'+name)
							.map(res => res.json());
	}

	getDataHostComparativa(idhost: string, desde: string, hasta: string, channel: string, uuaa: string, kpi: string){
		return this._http.get(this.url+'getDataHostComparativa/'+idhost+'/fechas/'+desde+
								'/'+hasta+'/'+channel+'/'+uuaa+'/'+kpi).map(res => res.json());
	}

}
