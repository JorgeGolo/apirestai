import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navegation',
  standalone: true,
  imports: [],
  templateUrl: './navegation.component.html',
  styleUrl: './navegation.component.css'
})
export class NavegationComponent {
  @Output() documentationSelected = new EventEmitter<void>(); // Definimos el evento
  @Output() infoSelected = new EventEmitter<void>(); // Definimos el evento
  @Output() chattypeSelected = new EventEmitter<void>(); // Definimos el evento

  // Método que se llamará al seleccionar la opción de documentación
  onSelectDocumentation() {
    this.documentationSelected.emit(); // Emitimos el evento
  }

  onSelectInfo() {
    //console.log("Información seleccionada"); // Este mensaje debe aparecer en la consola
    this.infoSelected.emit(); // Emitimos el evento
  }

  onSelectChattype() {
    console.log("list"); // Este mensaje debe aparecer en la consola
    this.chattypeSelected.emit(); // Emitimos el evento
  }

}
