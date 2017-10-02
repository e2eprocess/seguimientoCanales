import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {Observable} from 'rxjs/Observable';

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
	public desc: string;
	public type: string;
	

	constructor(private _http: Http) {		
		//this.url = 'http://15.17.167.155:3845/api/';
		this.url = 'http://localhost:3845/api/';
		//this.url = 'http://v1128scp451.ad.bbva.com:3845/api/';
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

	getDatavalueClonByHost(idhost, desde, hasta, channel, uuaa, kpi){
		return this._http.get(this.url+'getDatavalueClonByHost/'+idhost+'/fechas/'+desde+
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

	getDescriptionChannel(idmonitor){
		return this._http.get(this.url+'getDescriptionChannel/'+idmonitor)
							.map(res => res.json());
	}

	getNameDescriptionMonitor(idmonitor){
		return this._http.get(this.url+'getNameDescriptionMonitor/'+idmonitor)
							.map(res => res.json());
	}

	getDate(idmonitor, desde, hasta){
		return this._http.get(this.url+'getDate/'+idmonitor+'/fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getDatavalueHost(maquina,kpi,desde,hasta){
		return this._http.get(this.url+'getDatavalueHost/'+maquina+'/'+kpi+'/fechas/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getIdHostChannel(idchannel){
		return this._http.get(this.url+'getIdHostChannel/'+idchannel).map(res => res.json());
	}

	getDateAndDataMachine(idhost,interval,kpi){
		return this._http.get(this.url+'getDateAndDataMachine/'+idhost+'/intervalo/'+interval+'/'+kpi)
							.map(res => res.json());
	}

	getMaxThroughput(desde){
		return this._http.get(this.url+'getMaxEjecuciones/'+desde)
							.map(res => res.json());
	}

	getIdHostChannelAsoApx(idchannel,desc){
		return this._http.get(this.url+'getIdHostChannelAsoApx/'+idchannel+'/'+desc)
							.map(res => res.json());
	}

	getGroupedWaterMark(canal,fecha){
		return this._http.get(this.url+'getGroupedWaterMark/'+canal+'/'+fecha)
							.map(res => res.json());
	}

	getThroughputToday(idmonitor,kpi){
		return this._http.get(this.url+'getThroughputToday/'+idmonitor+'/'+kpi)
							.map(res => res.json());
	}

	getDateAndThroughputGrouped(type,canal,fecha){
		return this._http.get(this.url+'getDateAndThroughputGrouped/agrupacion/'+type+'/'+canal+'/'+fecha)
							.map(res => res.json());
	}

	getDataGrouped(monitor,type,kpi,desde,hasta){
		return this._http.get(this.url+'getDataGrouped/'+monitor+/agrupacion/+type+'/'+kpi+'/'+desde+'/'+hasta)
							.map(res => res.json());
	}

	getComments(idmonitor,kpi,desde,hasta){
		return this._http.get(this.url+'getComments/'+idmonitor+'/'+kpi+'/'+desde+'/'+hasta)
							.map(res => res.json());
	}

}
