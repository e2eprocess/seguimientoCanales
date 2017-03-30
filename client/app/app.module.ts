import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts'; 



import { AppComponent }  from './app.component';
import { Highcharts }  from './components/highcharts.component';
import { HighchartsjQuery }  from './components/highchartsjQuery.component';
import { StockChartExample }  from './components/stockChart.component';



@NgModule({
  imports:      [
                  BrowserModule,
                  FormsModule,
                  HttpModule,
                  JsonpModule,
                  ChartModule.forRoot(require('highcharts/highstock'))
                ],
  declarations: [
                AppComponent,
                Highcharts,
                HighchartsjQuery,
                StockChartExample
                ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
