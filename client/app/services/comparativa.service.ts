import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';
import {Uuaa} from '../models/uuaa'

@Injectable()
export class ComparativaService {
	public url: string;

	constructor(private _http: Http) {		
		this.url = 'http://localhost:3845/api/';
	}

	getUuaa(name: string){
		return this._http.get(this.url+'getUuaa/'+name)
							.map(res => res.json());
	}

	getMonitors(iduuaa: string){
		return this._http.get(this.url+'getMonitors/'+iduuaa)
							.map(res => res.json());
	}

	getDataMonitor(idmonitor: string, nameKpi:string, desde: string, hasta: string){
		return this._http.get(this.url+'getDataMonitor/'+idmonitor+'/'+nameKpi+'/'+'fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}
}
