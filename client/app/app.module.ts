import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts'; 
import { routing, appRoutingProviders }  from './app.routing';


import { AppComponent }  from './app.component';
import { Comparativa }  from './components/comparativa.component';
import { GraficaTiempo }  from './components/comparativa/comparativaGrafTiempo.component';
import { GraficaPeticiones }  from './components/comparativa/comparativaGrafPeticiones.component';



@NgModule({
  imports:      [
                  BrowserModule,
                  FormsModule,
                  HttpModule,
                  JsonpModule,
                  routing,
                  ChartModule.forRoot(require('highcharts/highstock')),
                  ],
  declarations: [
                AppComponent,
                Comparativa,
                GraficaTiempo,
                GraficaPeticiones
                ],
  providers: [ appRoutingProviders ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
