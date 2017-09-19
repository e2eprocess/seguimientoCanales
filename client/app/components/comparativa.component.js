"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var comparativa_service_1 = require("../services/comparativa.service");
var fechas_1 = require("../models/fechas");
var propertiesSeries_1 = require("../models/propertiesSeries");
var Comparativa = (function () {
    function Comparativa(_comparativaService, _route, _router) {
        this._comparativaService = _comparativaService;
        this._route = _route;
        this._router = _router;
        this.myDatePickerOptions = {
            dateFormat: 'dd.mm.yyyy',
            height: '34px',
            width: '125px',
            markCurrentDay: true,
            toLocaleDateString: 'es',
            showClearDateBtn: false,
            inline: false,
            disableUntil: { year: 2016, month: 9, day: 2 }
        };
        this.visibleCPU = false;
        this.visibleMemoria = false;
        this.visibleCPUOficinas = false;
        this.plotLines = {
            value: this.value,
            color: 'red',
            width: 3,
            zIndex: 5,
            label: {
                text: 'Máx. núm. Peticiones <b>' + this.value + '</b>',
                align: 'right',
                x: -10
            }
        };
    }
    Comparativa.prototype.ngOnInit = function () {
        var today = new Date();
        var dateTo = new Date();
        var dateFrom = new Date(today.setDate(today.getDate() - 7));
        this.from = { date: {
                year: dateFrom.getFullYear(),
                month: dateFrom.getMonth() + 1,
                day: dateFrom.getDate()
            } };
        this.to = { date: {
                year: dateTo.getFullYear(),
                month: dateTo.getMonth() + 1,
                day: dateTo.getDate()
            } };
        this.visibleCPU = false;
        this.visibleMemoria = false;
        this.visibleCPUOficinas = false;
        this.series = [];
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.onDateChangedFrom = function (event) {
        this.from = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.onDateChangedTo = function (event) {
        this.to = { date: {
                year: event.date.year,
                month: event.date.month,
                day: event.date.day
            } };
        this.comparativa(this.from, this.to);
    };
    Comparativa.prototype.pintarGrafica = function (kpi) {
        var fecha = ((new Date(this.fechas.toDesde)).getTime()) + 7200000;
        var chartHeight = 0, plotLinesValue = 0, plotLinesColor = '', plotLinesWidth = 0, plotLinesZIndex = 0, plotLinesLabelText = '', plotLinesLabelAlign = '', plotLinesX = 0;
        switch (kpi) {
            case "Time":
                var textTitle = 'Tiempo medio de respuesta (ms.)', yAxisTitleText = 'Tiempo de respuesta (ms.)', yAxislabelsFormat = '{value} ms.', yAxisMax = null;
                break;
            case "Throughput":
                var textTitle = 'Peticiones / 5min.', yAxisTitleText = 'Peticiones', yAxislabelsFormat = '{value}';
                plotLinesValue = this.value,
                    plotLinesColor = 'red';
                plotLinesWidth = 3,
                    plotLinesZIndex = 5;
                plotLinesLabelText = 'Max. núm. Peticiones <b>' + this.value + '</b>',
                    plotLinesLabelAlign = 'right',
                    plotLinesX = -10,
                    yAxisMax = null;
                break;
            case "CPU":
                var textTitle = 'Consumo CPU%', chartHeight = 250, yAxisTitleText = 'CPU%', yAxislabelsFormat = '{value} %';
                yAxisMax = 100;
                break;
            case "Memory":
                var textTitle = 'Consumo Memoria%', yAxisTitleText = 'Memoria %', yAxislabelsFormat = '{value}';
                yAxisMax = 100;
                break;
            case "cpuPar":
                var textTitle = 'Consumo CPU% <br/><font style="font-size:10px;">(maquinas pares)</font>', chartHeight = 250, yAxisTitleText = 'CPU %', yAxislabelsFormat = '{value} %';
                yAxisMax = 100;
                break;
            case "cpuImpar":
                var textTitle = 'Consumo CPU% <br/><font style="font-size:10px;">(maquinas impares)</font>', chartHeight = 250, yAxisTitleText = 'CPU %', yAxislabelsFormat = '{value} %';
                yAxisMax = 100;
                break;
        }
        jQuery('#' + kpi).highcharts({
            chart: {
                zoomType: 'xy',
                height: chartHeight
            },
            title: {
                text: textTitle
            },
            subtitle: {
                text: 'Comparativa entre <b>' + this.fechas.from + '</b> y <b>' + this.fechas.to + '</b>'
            },
            credits: {
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
                followPointer: true,
                xDateFormat: '%H:%M',
                borderColor: 'grey'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 1,
                itemStyle: {
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
                        states: {
                            hover: { enabled: true }
                        }
                    }
                },
                spline: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 1,
                        states: {
                            hover: { enabled: true }
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
    };
    Comparativa.prototype.obtenerWaterMark = function (monitores) {
        var _this = this;
        var arr = [];
        monitores.forEach(function (monitor) {
            arr.push(monitor.idmonitor);
        });
        var idmonitores = arr.join(",");
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getWaterMark(idmonitores).subscribe(function (response) {
                _this.value = parseInt(response.data.max_peticiones);
                var waterMark = [];
                waterMark.push(_this.value);
                var seriesWatermark = {
                    name: 'Máx. peticiones ' + response.data.fecha,
                    type: 'scatter',
                    color: 'red',
                    legendIndex: 99,
                    data: [waterMark]
                };
                resolve(seriesWatermark);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de las watermarks');
                }
            });
        });
    };
    Comparativa.prototype.obtencionSeriesCPU = function (maquina, i, busqueda, desde, hasta) {
        var _this = this;
        var serie = {
            name: '',
            type: '',
            color: 0,
            index: i,
            legendIndex: i,
            data: []
        };
        var properties = new propertiesSeries_1.PropertiesSeries();
        var color = i % properties.colorHost.length;
        serie.color = properties.colorHost[color];
        if (busqueda.includes('from')) {
            serie.type = 'column',
                serie.name = maquina + ' (F)';
        }
        else {
            serie.type = 'line',
                serie.name = maquina + ' (T)';
        }
        ;
        return new Promise(function (resolve, reject) {
            _this._comparativaService.getDatavalueHost(maquina, 'CPU', desde, hasta)
                .subscribe(function (response) {
                serie.data = response.data;
                resolve(serie);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
                reject();
            });
        });
    };
    Comparativa.prototype.obtencionSeriesRecursos = function (id, idchannel, uuaa, kpi, i, busqueda, desde, hasta) {
        var _this = this;
        var serie = {
            name: '',
            type: '',
            color: 0,
            index: i,
            legendIndex: i,
            data: []
        };
        var properties = new propertiesSeries_1.PropertiesSeries();
        var color = i % properties.colorHost.length;
        serie.color = properties.colorHost[color];
        if (busqueda.includes('from')) {
            serie.type = 'column';
            if (id < 17) {
                serie.name = id.name + '_' + uuaa + ' (F)';
            }
            else {
                serie.name = id.name;
            }
        }
        else {
            serie.type = 'line';
            if (id < 17) {
                serie.name = id.name + '_' + uuaa + ' (T)';
            }
            else {
                serie.name = id.name;
            }
        }
        ;
        return new Promise(function (resolve, reject) {
            switch (kpi) {
                case "CPU":
                    if (id < 17) {
                        _this._comparativaService.getDatavalueClonByHost(id.idhost, desde, hasta, idchannel, uuaa, kpi)
                            .subscribe(function (response) {
                            _this.visibleCPU = true;
                            serie.data = response.data;
                            resolve(serie);
                        }, function (error) {
                            _this.errorMessage = error;
                            if (_this.errorMessage != null) {
                                console.log(_this.errorMessage);
                            }
                            reject();
                        });
                    }
                    else {
                        _this._comparativaService.getDatavalueHost(id.name, kpi, desde, hasta).subscribe(function (response) {
                            _this.visibleCPU = true;
                            serie.data = response.data;
                            resolve(serie);
                        }, function (error) {
                            _this.errorMessage = error;
                            if (_this.errorMessage != null) {
                                console.log(_this.errorMessage);
                            }
                            reject();
                        });
                    }
                    break;
                case "Memory":
                    _this._comparativaService.getDatavalueClon(id.idclon, desde, hasta, kpi)
                        .subscribe(function (response) {
                        _this.visibleMemoria = true;
                        serie.data = response.data;
                        resolve(serie);
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            console.log(_this.errorMessage);
                        }
                        reject();
                    });
                    break;
            }
        });
    };
    Comparativa.prototype.obtencionSeriesMonitores = function (monitor, i, kpi, busqueda, desde, hasta) {
        var _this = this;
        var serie = {
            name: '',
            type: '',
            dashStyle: '',
            color: '',
            index: i,
            legendIndex: i,
            data: []
        };
        var properties = new propertiesSeries_1.PropertiesSeries();
        var color = i % properties.colorMonitor.length;
        serie.color = properties.colorMonitor[color];
        return new Promise(function (resolve, reject) {
            var properties = new propertiesSeries_1.PropertiesSeries();
            if (busqueda.includes('from')) {
                serie.name = monitor.name + ' (F)';
                serie.type = 'spline';
                serie.dashStyle = 'shortdot';
            }
            else {
                serie.name = monitor.name + ' (T)';
                serie.type = 'line';
                serie.dashStyle = '';
            }
            ;
            _this._comparativaService.getDatavalueMonitor(monitor.idmonitor, kpi, desde, hasta).subscribe(function (response) {
                serie.data = response.data;
                resolve(serie);
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del ' + kpi + ' del monitor ' + monitor.name);
                }
                reject();
            });
        });
    };
    Comparativa.prototype.gestionCPUOficinas = function (maquinas, parOImpar) {
        var _this = this;
        var promesas = [];
        this.visibleCPUOficinas = true;
        maquinas.forEach(function (maquina, index) {
            promesas.push(_this.obtencionSeriesCPU(maquina, index, 'from', _this.fechas.fromDesde, _this.fechas.fromHasta));
        });
        Promise.all(promesas).then(function () {
            maquinas.forEach(function (maquina, index) {
                promesas.push(_this.obtencionSeriesCPU(maquina, index, 'from', _this.fechas.fromDesde, _this.fechas.fromHasta));
            });
            Promise.all(promesas).then(function (resultado) {
                _this.series = resultado;
                _this.pintarGrafica(parOImpar);
            });
        });
    };
    Comparativa.prototype.gestionGraficoRecursos = function (ids, idchannel, kpi) {
        var _this = this;
        var promesas = [];
        ids.forEach(function (id, index) {
            promesas.push(_this.obtencionSeriesRecursos(id, idchannel, _this.name, kpi, index, 'from', _this.fechas.fromDesde, _this.fechas.fromHasta));
        });
        Promise.all(promesas).then(function () {
            ids.forEach(function (id, index) {
                promesas.push(_this.obtencionSeriesRecursos(id, idchannel, _this.name, kpi, index, 'to', _this.fechas.toDesde, _this.fechas.toHasta));
            });
            Promise.all(promesas).then(function (resultado) {
                _this.series = resultado;
                _this.pintarGrafica(kpi);
            });
        });
    };
    Comparativa.prototype.gestionGraficoMonitores = function (monitores, kpi) {
        var _this = this;
        var promesas = [];
        //var series = [];
        monitores.forEach(function (monitor, index) {
            promesas.push(_this.obtencionSeriesMonitores(monitor, index, kpi, 'from', _this.fechas.fromDesde, _this.fechas.fromHasta));
        });
        Promise.all(promesas).then(function () {
            monitores.forEach(function (monitor, index) {
                promesas.push(_this.obtencionSeriesMonitores(monitor, index, kpi, 'to', _this.fechas.toDesde, _this.fechas.toHasta));
            });
            Promise.all(promesas).then(function () {
                if (kpi === 'Throughput') {
                    promesas.push(_this.obtenerWaterMark(monitores));
                }
                Promise.all(promesas).then(function (resultado) {
                    _this.series = resultado;
                    _this.pintarGrafica(kpi);
                });
            });
        });
    };
    Comparativa.prototype.gestionRecursos = function (idchannel, channel, name) {
        var _this = this;
        //Obtención idHost asociado al canal y a la UUAA informada
        if (idchannel != 4) {
            if (idchannel == 6) {
                this._comparativaService.getIdHostChannelAsoApx(idchannel, channel).subscribe(function (response) {
                    _this.gestionGraficoRecursos(response.data, idchannel, 'CPU');
                }, function (error) {
                    _this.errorMessage = error;
                    if (_this.errorMessage != null) {
                        alert('Error en la obtención de los IDHOST asociados al Canal');
                    }
                });
            }
            else {
                if (name.indexOf('ASO') != -1) {
                    this._comparativaService.getIdHostChannelAsoApx(idchannel, name.substring(0, 3)).subscribe(function (response) {
                        _this.gestionGraficoRecursos(response.data, idchannel, 'CPU');
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error en la obtención de los IDHOST asociados al Canal');
                        }
                    });
                }
                else {
                    this._comparativaService.getIdHost(idchannel, name).subscribe(function (response) {
                        _this.gestionGraficoRecursos(response.data, idchannel, 'CPU');
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error en la obtención de los IDHOST asociados al Canal');
                        }
                    });
                }
            }
        }
        else {
            this.visibleCPU = false;
            this.visibleMemoria = false;
            var cpuPar = ['spnac006', 'spnac008', 'spnac010', 'spnac012'];
            var cpuImpar = ['spnac005', 'spnac007', 'spnac009'];
            this.gestionCPUOficinas(cpuPar, 'cpuPar');
            this.gestionCPUOficinas(cpuImpar, 'cpuImpar');
        }
        //Obtención idclon asociado al canal y a la UUAA informada
        if (idchannel < 4) {
            this._comparativaService.getIdClon(idchannel, name).subscribe(function (response) {
                _this.gestionGraficoRecursos(response.data, idchannel, 'Memory');
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención de los IDHOST asociados al Canal');
                }
            });
        }
    };
    Comparativa.prototype.gestionMonitores = function (idchannel, name) {
        var _this = this;
        //obtención del idUUAA asociado a la UUAA del canal informado.
        this._comparativaService.getIdUuaa(idchannel, name).subscribe(function (response) {
            _this.uuaa = response.data;
            var iduuaa = response.data.iduuaa;
            _this._comparativaService.getMonitors(iduuaa).subscribe(function (response) {
                _this.gestionGraficoMonitores(response.data, 'Time');
                _this.gestionGraficoMonitores(response.data, 'Throughput');
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    alert('Error en la obtención del ID del monitor');
                }
            });
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                alert('Error en la obtención del ID de la UUAA');
            }
        });
    };
    Comparativa.prototype.comparativa = function (from, to) {
        var _this = this;
        this.visibleCPU = false;
        this.visibleMemoria = false;
        this.visibleCPUOficinas = false;
        //Gestión fechas From y To. Si To es el día actual se realiza la busqueda hasta la hora actual - menos 20 minutos;
        this.fechas = new fechas_1.Fechas('', '', '', '', '', '');
        var horaMenos20 = new Date().getTime() - 1200000;
        if (new Date().toDateString() === new Date(to.date.year + '-' + to.date.month + '-' + to.date.day).toDateString()) {
            this.fechas.toHasta = to.date.year + '-' + to.date.month + '-' + to.date.day + ' ' + new Date(horaMenos20).getHours() + ':' +
                new Date(horaMenos20).getMinutes() + ':' + new Date(horaMenos20).getSeconds();
        }
        else {
            this.fechas.toHasta = to.date.year + '-' + to.date.month + '-' + to.date.day + ' 23:59:00';
        }
        this.fechas.toDesde = to.date.year + '-' + to.date.month + '-' + to.date.day + ' 00:00:00';
        this.fechas.fromDesde = from.date.year + '-' + from.date.month + '-' + from.date.day + ' 00:00:00';
        this.fechas.fromHasta = from.date.year + '-' + from.date.month + '-' + from.date.day + ' 23:59:00';
        this.fechas.to = to.date.day + '-' + to.date.month + '-' + to.date.year;
        this.fechas.from = from.date.day + '-' + from.date.month + '-' + from.date.year;
        this._route.params.forEach(function (params) {
            //Recupera parametros URL.
            var name = params['name'];
            var channel = params['channel'];
            _this.name = name;
            switch (channel) {
                case "APX":
                    var monitor = [{
                            idmonitor: 361,
                            name: 'Transacciones APX'
                        }];
                    _this.name = "APX";
                    _this.uuaa = {
                        description: 'Acumulado Transacciones'
                    };
                    _this.gestionGraficoMonitores(monitor, 'Time');
                    _this.gestionGraficoMonitores(monitor, 'Throughput');
                    _this.gestionRecursos(6, channel, "");
                    break;
                case "ASO":
                    console.log(channel);
                    break;
                default:
                    //Obtención idchannel asociado al canal
                    _this._comparativaService.getIdChannel(channel).subscribe(function (response) {
                        var idchannel = response.data.idchannel;
                        _this.gestionMonitores(idchannel, name);
                        _this.gestionRecursos(idchannel, channel, name);
                    }, function (error) {
                        _this.errorMessage = error;
                        if (_this.errorMessage != null) {
                            alert('Error en la obtención del ID del canal');
                        }
                    });
                    break;
            }
        });
    };
    return Comparativa;
}());
Comparativa = __decorate([
    core_1.Component({
        selector: 'comparativa',
        templateUrl: 'app/views/comparativa.html',
        providers: [comparativa_service_1.ComparativaService]
    }),
    __metadata("design:paramtypes", [comparativa_service_1.ComparativaService,
        router_1.ActivatedRoute,
        router_1.Router])
], Comparativa);
exports.Comparativa = Comparativa;
//# sourceMappingURL=comparativa.component.js.map