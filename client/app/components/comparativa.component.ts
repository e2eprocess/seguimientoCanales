import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import {MyDatePickerModule, IMyDateModel} from 'mydatepicker';

import { ComparativaService } from '../services/comparativa.service';

import { Fechas } from '../models/fechas';
import { PropertiesSeries } from '../models/propertiesSeries';

declare var jQuery:any;

@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/comparativa.html',
    providers: [ComparativaService]
})

export class Comparativa implements OnInit {
  public myDatePickerOptions: MyDatePickerModule = {
        dateFormat: 'dd.mm.yyyy',
        height: '34px',
        width: '125px',
        markCurrentDay: true,
        toLocaleDateString: 'es',
        showClearDateBtn: false,
        inline: false,
        disableUntil: { year: 2016, month: 9, day: 2 }
    };

    public errorMessage;
    public from: object;
    public to: object;
    public fechas: Fechas;
    public name: string;
    public uuaa: object;
    public value: number;
    public visibleCPU: boolean = false;
    public visibleMemoria: boolean = false;
    public visibleCPUOficinas: boolean = false;
    public series: Array<any>;
    public plotLines: object = {
        value: this.value,
        color: 'red',
        width: 3,
        zIndex: 5,
        label: {
            text: 'Máx. núm. Peticiones <b>' + this.value +'</b>',
            align: 'right',
            x: -10
        }
    }

  constructor(
      private _comparativaService: ComparativaService,
      private _route: ActivatedRoute,
      private _router: Router
  ){}

  ngOnInit(){
    var today = new Date();
    var dateTo = new Date();
    var dateFrom = new Date(today.setDate(today.getDate()-7));

    this.from = {date:{
        year: dateFrom.getFullYear(),
        month: dateFrom.getMonth()+1,
        day: dateFrom.getDate()
    }};

    this.to = {date:{
        year: dateTo.getFullYear(),
        month: dateTo.getMonth()+1,
        day: dateTo.getDate()
    }};

    this.visibleCPU = false;
    this.visibleMemoria = false;
    this.visibleCPUOficinas = false;
    this.series = [];

    this.comparativa(this.from, this.to);
  }

  onDateChangedFrom(event: IMyDateModel) {
    this.from = {date: {
        year: event.date.year,
        month: event.date.month,
        day: event.date.day
    }};
    
    this.comparativa(this.from, this.to);
   }
    
    onDateChangedTo(event: IMyDateModel) {
        this.to = {date: {
            year: event.date.year,
            month: event.date.month,
            day: event.date.day
        }};
        
        this.comparativa(this.from, this.to);
    }

    pintarGrafica(kpi){
        var fecha = ((new Date(this.fechas.toDesde)).getTime())+7200000;

        var chartHeight= 0,
            plotLinesValue = 0,
            plotLinesColor = '',
            plotLinesWidth = 0,
            plotLinesZIndex = 0,
            plotLinesLabelText = '',
            plotLinesLabelAlign = '',
            plotLinesX = 0;


        switch (kpi) {
            case "Time":
                var textTitle = 'Tiempo medio de respuesta (ms.)',
                    yAxisTitleText = 'Tiempo de respuesta (ms.)',
                    yAxislabelsFormat = '{value} ms.',
                    yAxisMax = null
            break;

            case "Throughput":
                var textTitle = 'Peticiones / 5min.',
                    yAxisTitleText = 'Peticiones',
                    yAxislabelsFormat = '{value}';
                    plotLinesValue = this.value,
                    plotLinesColor = 'red';
                    plotLinesWidth = 3,
                    plotLinesZIndex = 5;
                    plotLinesLabelText = 'Max. núm. Peticiones <b>'+this.value+'</b>',
                    plotLinesLabelAlign = 'right',
                    plotLinesX = -10,
                    yAxisMax = null
            break;

            case "CPU":
                var textTitle = 'Consumo CPU%',
                    chartHeight= 250,
                    yAxisTitleText = 'CPU%',
                    yAxislabelsFormat = '{value} %';
                    yAxisMax = 100
            break;

            case "Memory":
                var textTitle = 'Consumo Memoria%',
                    yAxisTitleText = 'Memoria %',
                    yAxislabelsFormat = '{value}';
                    yAxisMax = 100
            break;

            case "cpuPar":
                var textTitle = 'Consumo CPU% <br/><font style="font-size:10px;">(maquinas pares)</font>',
                    chartHeight= 250,
                    yAxisTitleText = 'CPU %',
                    yAxislabelsFormat = '{value} %';
                    yAxisMax = 100
            break;

            case "cpuImpar":
                var textTitle = 'Consumo CPU% <br/><font style="font-size:10px;">(maquinas impares)</font>',
                    chartHeight= 250,
                    yAxisTitleText = 'CPU %',
                    yAxislabelsFormat = '{value} %';
                    yAxisMax = 100
            break; 
        
        }
        
        jQuery('#'+kpi).highcharts({
            chart: {
                zoomType: 'xy',
                height: chartHeight
            },
            title: {
                text: textTitle
            },
            subtitle: {
                text: 'Comparativa entre <b>'+this.fechas.from+'</b> y <b>'+this.fechas.to+'</b>'
            },
            credits:{
              enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                  hour: '%H:%M'
                }
            },
            yAxis: {
                title: {
                    text: yAxisTitleText
                },
                labels: {
                  format: yAxislabelsFormat
                },
                lineWidth: 1,
                plotLines: [{
                    value: plotLinesValue,
                    color: plotLinesColor,
                    width: plotLinesWidth,
                    zIndex: plotLinesZIndex,
                    label: {
                        text: plotLinesLabelText,
                        align: plotLinesLabelAlign,
                        x: plotLinesX
                    }
                }],
                max: yAxisMax
            },
            tooltip: {
              shared: true,
              followPointer:true,
              xDateFormat: '%H:%M',
              borderColor: 'grey'
            },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              borderWidth: 1,
              itemStyle:{
                  fontSize: "10px"
                }
            },
            plotOptions: {
            series: {
                pointStart: fecha,
                pointInterval: 300 * 1000,
                marker: {
                    enabled: false
                }
            },
            line: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 1,
                    states : {
                        hover: {enabled: true}
                    }
                }
            },
            spline: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 1,
                    states : {
                        hover: {enabled: true}
                    }
                }
                }    
            },
            scatter: {
                marker: {
                  symbol: 'square',
                  radius: 1
                }
            },
            series: this.series
          });
    }

    obtenerWaterMark(monitores){
       var arr = [];

       monitores.forEach((monitor)=>{
         arr.push(monitor.idmonitor);
       });

       var idmonitores = arr.join(",");

        return new Promise((resolve, reject)=>{
            this._comparativaService.getWaterMark(idmonitores).subscribe(
                response=>{
                    this.value = parseInt(response.data.max_peticiones);
                    var waterMark = [];
                    waterMark.push(this.value);

                    var seriesWatermark = {
                        name: 'Máx. peticiones ' + response.data.fecha,
                        type: 'scatter',
                        color: 'red',
                        legendIndex:99,
                        data: [waterMark]
                    };

                    resolve(seriesWatermark)
                },
                error=>{
                    this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                        alert('Error en la obtención de las watermarks');                                         
                    }
                })
        })
    }

    obtencionSeriesCPU(maquina,i,busqueda,desde,hasta){
        const serie = {
            name: '',
            type: '',
            color: 0,
            index: i,
            legendIndex: i,
            data: [] 
        }

        var properties = new PropertiesSeries();
        var color = i%properties.colorHost.length;
        
        serie.color = properties.colorHost[color];

        if(busqueda.includes('from')) {
            serie.type = 'column',
            serie.name = maquina + ' (F)'
        }else{
             serie.type = 'line' ,
             serie.name = maquina + ' (T)'
        };

        return new Promise ((resolve,reject)=>{
            this._comparativaService.getDatavalueHost(maquina,'CPU',desde,hasta)
                .subscribe(
                    response => {
                        serie.data = response.data;
                        resolve(serie)
                    },
                    error => {
                        this.errorMessage = <any>error;
                        if(this.errorMessage != null){
                          console.log(this.errorMessage);                                         
                        }
                        reject();
                    }
                );
        });       
    }


    obtencionSeriesRecursos(id,idchannel,uuaa,kpi,i,busqueda,desde,hasta){

        const serie = {
            name: '',
            type: '',
            color: 0,
            index: i,
            legendIndex: i,
            data: []   
        }

        var properties = new PropertiesSeries();
        var color = i%properties.colorHost.length;
        
        serie.color = properties.colorHost[color];

        if(busqueda.includes('from')) {
            serie.type = 'column';
            if(id < 17){
            	serie.name = id.name+'_'+uuaa + ' (F)'
            }else{
            	serie.name = id.name + ' (F)'
            }
        }else{
         	serie.type = 'line' 
            if(id < 17){
            	serie.name = id.name+'_'+uuaa + ' (T)'
         	}else{
         		serie.name = id.name + ' (T)'
         	}
        };

        return new Promise((resolve, reject)=>{
            switch (kpi) {
                case "CPU":
                	if (id < 17){
                	    this._comparativaService.getDatavalueClonByHost(id.idhost,desde,hasta,idchannel,uuaa,kpi)
	                        .subscribe(
	                            response => {
	                                this.visibleCPU = true;
	                                serie.data = response.data
	                                resolve(serie);
	                            },
	                            error => {
	                                this.errorMessage = <any>error;
	                                    if(this.errorMessage != null){
	                                      console.log(this.errorMessage);                                         
	                                }
	                                reject();
	                            }
	                        );
                	}else{
                		this._comparativaService.getDatavalueHost(id.name,kpi,desde,hasta).subscribe(
                				response => {
	                                this.visibleCPU = true;
	                                serie.data = response.data
	                                resolve(serie);
	                            },
	                            error => {
	                                this.errorMessage = <any>error;
	                                    if(this.errorMessage != null){
	                                      console.log(this.errorMessage);                                         
	                                }
	                                reject();
	                            }
                			);
                	}
                    break;
                
                case "Memory":
                    this._comparativaService.getDatavalueClon(id.idclon,desde,hasta,kpi)
                        .subscribe(
                            response => {
                                this.visibleMemoria = true;
                                serie.data = response.data
                                resolve(serie);
                            },
                            error => {
                                this.errorMessage = <any>error;
                                    if(this.errorMessage != null){
                                      console.log(this.errorMessage);                                         
                                }
                                reject();
                            }
                    );
                    break;
            }
        });
    }

    obtencionSeriesMonitores(monitor, i, kpi, busqueda, desde, hasta){

        const serie = {
            name: '',
            type: '',
            dashStyle: '',
            color: '',
            index: i,
            legendIndex: i,
            data: []
        }

        var properties = new PropertiesSeries();
        var color = i%properties.colorMonitor.length;
        
        serie.color = properties.colorMonitor[color];

        return new Promise((resolve, reject)=>{

            var properties = new PropertiesSeries();
            
            if(busqueda.includes('from')) {
                serie.name = monitor.name + ' (F)';
                serie.type = 'spline';
                serie.dashStyle = 'shortdot'; 
            }else{
                serie.name = monitor.name + ' (T)';
                serie.type = 'line';
                serie.dashStyle = '';
           };

           if (monitor.name.includes('ASO')){
               this._comparativaService.getDataGrouped(monitor.name,'F',kpi,desde,hasta).subscribe(
                   response => {
                       serie.data = response.data
                       resolve(serie)
                   },
                   error =>{
                       this.errorMessage = <any>error;
                       if(this.errorMessage != null){
                           alert('Error en la obtención del '+kpi+' del monitor '+monitor.name);
                       }                    
                       reject()
                   }
               );

           }else{
               this._comparativaService.getDatavalueMonitor(monitor.idmonitor,kpi,desde,hasta).subscribe(
                   response => {
                       serie.data = response.data;
                       resolve(serie)
                    },
                    error => {
                       this.errorMessage = <any>error;
                       if(this.errorMessage != null){
                           alert('Error en la obtención del '+kpi+' del monitor '+monitor.name);
                       }                    
                       reject()
                    }
                );
           }
        })

    }

    gestionCPUOficinas(maquinas,parOImpar){

        var promesas = [];
        this.visibleCPUOficinas = true;

        maquinas.forEach((maquina, index)=>{
            promesas.push(this.obtencionSeriesCPU(maquina,index,'from',this.fechas.fromDesde,this.fechas.fromHasta));
        });

        Promise.all(promesas).then(()=>{
            maquinas.forEach((maquina, index)=>{
                promesas.push(this.obtencionSeriesCPU(maquina,index,'from',this.fechas.fromDesde,this.fechas.fromHasta));
            });

            Promise.all(promesas).then((resultado)=>{
                this.series = resultado;
                this.pintarGrafica(parOImpar)
            });             
        });

    }

    gestionGraficoRecursos(ids,idchannel, kpi){
        var promesas = [];
        ids.forEach((id, index)=>{
            promesas.push(this.obtencionSeriesRecursos(id,idchannel,this.name,kpi,index,'from',this.fechas.fromDesde,this.fechas.fromHasta));
        });

        Promise.all(promesas).then(()=>{
            ids.forEach((id, index)=>{
                promesas.push(this.obtencionSeriesRecursos(id,idchannel,this.name,kpi,index,'to',this.fechas.toDesde,this.fechas.toHasta))
            })

            Promise.all(promesas).then((resultado)=>{
                this.series = resultado;
                this.pintarGrafica(kpi);
            })

        })

    }
    

    gestionGraficoMonitores(monitores, kpi){

        var promesas = [];
        
        monitores.forEach((monitor, index)=>{
            promesas.push(this.obtencionSeriesMonitores(monitor,index,kpi,'from',this.fechas.fromDesde,this.fechas.fromHasta));
        });

        Promise.all(promesas).then(()=>{
            monitores.forEach((monitor, index)=>{
                promesas.push(this.obtencionSeriesMonitores(monitor,index,kpi,'to',this.fechas.toDesde,this.fechas.toHasta));
            }); 

            Promise.all(promesas).then(()=>{
                if (kpi === 'Throughput'){
                    promesas.push(this.obtenerWaterMark(monitores))    
                }
                Promise.all(promesas).then((resultado)=> {
                    this.series = resultado;
                    this.pintarGrafica(kpi);
                }) 
            });
        });
    }

    gestionGraficaMonitoresAso(channel,name,kpi){

        var promesas = [];

        var monitor = {
            name: name
        };

        promesas.push(this.obtencionSeriesMonitores(monitor,1,kpi,'from',this.fechas.fromDesde,this.fechas.fromHasta));
        promesas.push(this.obtencionSeriesMonitores(monitor,1,kpi,'to',this.fechas.toDesde,this.fechas.toHasta));

        Promise.all(promesas).then((resultado)=>{
            this.series = resultado;
            this.pintarGrafica(kpi);
        })
        
    }

    gestionRecursos(idchannel,channel,name){   

        this.visibleCPU = false;
        this.visibleMemoria = false;
        this.visibleCPUOficinas = false;
   
    
        if(channel=='APX'||channel=='ASO'){
            this._comparativaService.getIdHostChannelAsoApx(idchannel,channel).subscribe(
                response =>{
                    this.gestionGraficoRecursos(response.data,idchannel,'CPU');
                },error => {
                    this.errorMessage = <any>error;
                    if(this.errorMessage != null){
                        alert('Error en la obtención de los IDHOST asociados al Canal');
                      }
                }
            );
        }else{
            if (idchannel!=4){
                this._comparativaService.getIdHost(idchannel,name).subscribe(
                    response => {
                        this.gestionGraficoRecursos(response.data,idchannel,'CPU');
                    },
                    error => {
                        this.errorMessage = <any>error;
                        if(this.errorMessage != null){
                            alert('Error en la obtención de los IDHOST asociados al Canal');
                          }
                    }
                );
            }else{
                this.visibleCPU = false;
                this.visibleMemoria = false;
                var cpuPar = ['spnac006','spnac008','spnac010','spnac012'];
                var cpuImpar = ['spnac005','spnac007','spnac009'];
                this.gestionCPUOficinas(cpuPar,'cpuPar');
                this.gestionCPUOficinas(cpuImpar,'cpuImpar');
            }

            //Pintado Memoria
            if (idchannel < 4){
                this._comparativaService.getIdClon(idchannel,name).subscribe(
                    response => {
                        this.gestionGraficoRecursos(response.data, idchannel, 'Memory');
                    },
                    error => {
                        this.errorMessage = <any>error;
                            if(this.errorMessage != null){
                        alert('Error en la obtención de los IDHOST asociados al Canal');
                      }
                });     
             }
        }
    }

    gestionMonitores(idchannel,name){
    //obtención del idUUAA asociado a la UUAA del canal informado.
        this._comparativaService.getIdUuaa(idchannel, name).subscribe(
            response => {
                this.uuaa = response.data
                var iduuaa = response.data.iduuaa;
                this._comparativaService.getMonitors(iduuaa).subscribe(
                    response => {
                        this.gestionGraficoMonitores(response.data,'Time');
                        this.gestionGraficoMonitores(response.data,'Throughput');
                    },
                    error => {
                        this.errorMessage = <any>error;
                        if(this.errorMessage != null){
                            alert('Error en la obtención del ID del monitor');
                        }
                    })
                
            },
            error =>{
                this.errorMessage = <any>error;
                if(this.errorMessage != null){
                    alert('Error en la obtención del ID de la UUAA');
                }
            })
    }


    comparativa(from, to){

        //Gestión fechas From y To. 
        //Si To es el día actual se realiza la busqueda hasta la hora actual - menos 20 minutos;
        this.fechas = new Fechas('','','','','','');
        var horaMenos20 = new Date().getTime()-1200000;
        if(new Date().toDateString() === new Date(to.date.year+'-'+to.date.month+'-'+to.date.day).toDateString() ){
          this.fechas.toHasta = to.date.year+'-'+to.date.month+'-'+to.date.day+' '+new Date(horaMenos20).getHours()+':'+
                      new Date(horaMenos20).getMinutes()+':'+new Date(horaMenos20).getSeconds();
        }else{
          this.fechas.toHasta = to.date.year+'-'+to.date.month+'-'+to.date.day+' 23:59:00';
        }
        this.fechas.toDesde = to.date.year+'-'+to.date.month+'-'+to.date.day+' 00:00:00';
        this.fechas.fromDesde = from.date.year+'-'+from.date.month+'-'+from.date.day+' 00:00:00';
        this.fechas.fromHasta = from.date.year+'-'+from.date.month+'-'+from.date.day+' 23:59:00';  
        this.fechas.to = to.date.day+'-'+to.date.month+'-'+to.date.year;
        this.fechas.from = from.date.day+'-'+from.date.month+'-'+from.date.year;

        //Obtención datos URL.
        this._route.params.forEach((params: Params) => {

            let name = params['name'];
            let channel = params['channel'];    
            this.name = name;

            //Comportamiento según entorno
            switch (channel) {
                case "APX":
                    var monitor = [{
                        idmonitor: 361,
                        name: 'Transacciones APX'
                    }];

                    this.name = "APX";
                    this.uuaa = {
                        description: 'Acumulado Transacciones'
                    }

                    this._comparativaService.getIdChannel(channel.toLowerCase()).subscribe(
                        response =>{
                            var idchannel = response.data.idchannel;
                            this.gestionGraficoMonitores(monitor,'Time');
                            this.gestionGraficoMonitores(monitor,'Throughput');
                            this.gestionRecursos(idchannel,channel,"APX");

                        },error => {

                        }
                    )
                    break;
                
                case "ASO":
                    this.name = 'ASO';
                    this.uuaa = {
                        description: params['description']
                    };

                    var channelASO = (name.substr(4)).toLowerCase();

                    this.gestionGraficaMonitoresAso(channel,name,'Time');
                    this.gestionGraficaMonitoresAso(channel,name,'Throughput');

                    this._comparativaService.getIdChannel(channelASO).subscribe(
                        response => {
                            var idchannel = response.data.idchannel;
                            this.gestionRecursos(idchannel,channel,name);
                        },error => {

                        });


                    break;

                default:
                    //Obtención idchannel asociado al canal
                    this._comparativaService.getIdChannel(channel).subscribe(
                    response => {
                        var idchannel = response.data.idchannel;
                        this.gestionMonitores(idchannel,name);
                        this.gestionRecursos(idchannel,channel,name);

                    },
                    error => {
                        this.errorMessage = <any>error;
                        if(this.errorMessage != null){
                            alert('Error en la obtención del ID del canal');
                        }   
                    });    
                    break;
            }
        });

    }
}