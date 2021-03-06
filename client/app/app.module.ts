import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts'; 
import { routing, appRoutingProviders }  from './app.routing';

import { MyDatePickerModule } from 'mydatepicker';


import { AppComponent }  from './app.component';
import { Comparativa }  from './components/comparativa.component';
import { Highstock }  from './components/highstock.component';
import { Seguimiento }  from './components/seguimiento.component';
import { Transacciones }  from './components/transacciones.component';
import { Informe }  from './components/informe.component';
import { VisionMaquina }  from './components/visionMaquina.component';


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
                Highstock,
                Seguimiento,
                Informe,
                VisionMaquina,
                Transacciones
                ],
  exports: [
                MyDatePickerModule
                ],
  providers: [ appRoutingProviders ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
