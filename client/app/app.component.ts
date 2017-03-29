
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, Component }    from '@angular/core';
import { BrowserModule }          from '@angular/platform-browser';
import { ChartModule }            from 'angular2-highcharts'; 

@Component({
    selector: 'my-app',
    template: `<chart [options]="options"></chart>`
})
export class AppComponent {
    constructor() { 
        this.options = {
            title : { text : 'simple chart' },
            subtitle: {text: 'prueba'},
            series: [{
                data: [29.9, 71.5, 106.4, 129],
            }]
        };
    }
    options: Object;
}

@NgModule({
  imports:      [BrowserModule, ChartModule.forRoot(require('highcharts'))],
  declarations: [AppComponent],
  bootstrap:    [AppComponent]
})
class AppModule { }


platformBrowserDynamic().bootstrapModule(AppModule);


