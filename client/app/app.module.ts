import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts'; 



import { AppComponent }  from './app.component';
import { Highcharts }  from './components/highcharts.component';

@NgModule({
  imports:      [
                  BrowserModule,
                  FormsModule,
                  HttpModule,
                  ChartModule.forRoot(require('highcharts/highstock'))
                ],
  declarations: [
                AppComponent,
                Highcharts
                ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
