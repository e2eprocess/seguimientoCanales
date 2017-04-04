// Importar Component desde el núcleo de Angular
import {Component} from '@angular/core';

// Decorador component, indicamos en que etiqueta se va a cargar la plantilla
@Component({
    selector: 'comparativa',
    templateUrl: 'app/views/comparativa.html'
})

// Clase del componente donde irán los datos y funcionalidades
export class Comparativa {
  public title: string;

  constructor(){
    this.title = 'KYGU - Perfilado de usuarios';
  }
}
