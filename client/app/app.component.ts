// Importar Component desde el núcleo de Angular
import {Component} from '@angular/core';

// Decorador component, indicamos en que etiqueta se va a cargar la plantilla
@Component({
    selector: 'my-app',
    templateUrl: 'app/views/home.html'
})

// Clase del componente donde irán los datos y funcionalidades
export class AppComponent {
  public title: string;
  public description: string;

  constructor(){
    this.title = 'Seguimiento Canales';
    this.description = 'Aplicacion web de seguimiento de los canales pertenecientes a la infraestructura del BBVA';
  }
}
