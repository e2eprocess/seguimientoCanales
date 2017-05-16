import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts'; 
import { routing, appRoutingProviders }  from './app.routing';

import { MyDatePickerModule } from 'mydatepicker';


import { AppComponent }  from './app.component';
import { Comparativa }  from './components/comparativa.component';
import { GraficaTiempo }  from './components/comparativa/comparativaGrafTiempo.component';
import { GraficaPeticiones }  from './components/comparativa/comparativaGrafPeticiones.component';
import { GraficaCpu }  from './components/comparativa/comparativaGrafCpu.component';
import {GraficaMemoria } from './components/comparativa/comparativaGrafMemoria.component';




@NgModule({
  imports:      [
                  BrowserModule,
                  FormsModule,
                  HttpModule,
                  JsonpModule,
                  routing,
                  ChartModule.forRoot(require('highcharts/highstock')),
                  MyDatePickerModule
                  ],
  declarations: [
                AppComponent,
                Comparativa,
                GraficaTiempo,
                GraficaPeticiones,
                GraficaCpu,
                GraficaMemoria
                ],
  exports: [
                MyDatePickerModule
                ],
  providers: [ appRoutingProviders ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
